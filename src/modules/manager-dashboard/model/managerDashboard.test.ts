import assert from "node:assert/strict";
import test from "node:test";
import type { LearningRoute } from "../../onboarding-agent/model/learningRouteTypes";
import type {
  DiagnosticResult,
  EmployeeProfile,
  TopicScore
} from "../../onboarding-agent/model/types";
import {
  buildLiveManagerRecord,
  demoManagerRecords,
  getAttentionSummary,
  getTopicAnalytics,
  mergeManagerRecords
} from "./managerDashboardData";

const employee: EmployeeProfile = {
  id: "barista-live-1",
  name: "София Кузнецова",
  role: "barista",
  grade: "horeca_experience",
  location: "Valle Sanchez · Арбат",
  startDate: "2026-06-28"
};

test("buildLiveManagerRecord summarizes barista diagnostic result without raw answers", () => {
  const record = buildLiveManagerRecord({
    employee,
    result: makeResult({
      totalScorePercent: 58,
      criticalTopicIds: ["barista-espresso-setup", "barista-milk-texture"]
    }),
    route: makeRoute()
  });

  assert.equal(record.id, employee.id);
  assert.equal(record.role, "barista");
  assert.equal(record.riskLevel, "high");
  assert.equal(record.readinessLabel, "Нужна поддержка перед сменой");
  assert.match(record.managerRecommendation, /эспрессо|молок|наставник/i);
  assert.equal(record.routeStatus, "has_blockers");
  assert.equal(record.taskStatusSummary.needs_mentor, 1);
  assert.deepEqual(record.blockedTaskTitles, ["Потренировать молоко с наставником"]);
  assert.match(record.manualCheck, /Проверить руками/i);
  assert.deepEqual(record.criticalTopicTitles, [
    "Настройка эспрессо",
    "Молоко и текстура"
  ]);
  assert.equal("answers" in record, false);
});

test("mergeManagerRecords keeps demo cohort and replaces duplicates with live records", () => {
  const demoReplacement = {
    ...demoManagerRecords[0],
    totalScorePercent: 99,
    completedAt: "2026-06-28T10:00:00.000Z"
  };
  const records = mergeManagerRecords([demoReplacement]);

  assert.equal(records.length, demoManagerRecords.length);
  assert.equal(records[0].id, demoReplacement.id);
  assert.equal(records[0].totalScorePercent, 99);
  assert.equal(
    records.every((record) => record.role === "barista"),
    true
  );
});

test("buildLiveManagerRecord marks strong baristas ready for supervised shift", () => {
  const record = buildLiveManagerRecord({
    employee,
    result: makeResult({ totalScorePercent: 86, criticalTopicIds: [] }),
    route: makeRoute()
  });

  assert.equal(record.riskLevel, "low");
  assert.equal(record.readinessLabel, "Готов к смене под обычным контролем");
  assert.match(record.managerRecommendation, /закрепить|контроль/i);
});

test("manager analytics summarize attention and repeated weak topics", () => {
  const liveRecord = buildLiveManagerRecord({
    employee,
    result: makeResult({
      totalScorePercent: 58,
      criticalTopicIds: ["barista-milk-texture"]
    }),
    route: makeRoute()
  });
  const records = mergeManagerRecords([liveRecord]);
  const attention = getAttentionSummary(records);
  const topics = getTopicAnalytics(records);

  assert.equal(attention.highRiskCount >= 1, true);
  assert.equal(attention.milkCriticalCount >= 1, true);
  assert.equal(
    topics.some((topic) => /молок/i.test(topic.title) && topic.count >= 1),
    true
  );
});

function makeResult(params: {
  totalScorePercent: number;
  criticalTopicIds: string[];
}): DiagnosticResult {
  const topics = [
    makeTopic("barista-espresso-setup", "Настройка эспрессо", params),
    makeTopic("barista-milk-texture", "Молоко и текстура", params),
    makeTopic("barista-equipment-cleaning", "Чистка оборудования", params, true)
  ];

  return {
    employeeId: employee.id,
    role: employee.role,
    grade: employee.grade,
    totalScorePercent: params.totalScorePercent,
    topicScores: topics,
    strongTopics: topics.filter((topic) => topic.status === "strong"),
    weakTopics: topics.filter(
      (topic) => topic.status === "medium_gap" || topic.status === "critical_gap"
    ),
    criticalTopics: topics.filter((topic) => topic.status === "critical_gap"),
    requiredTopics: topics.filter((topic) => topic.required),
    completedAt: "2026-06-28T09:00:00.000Z"
  };
}

function makeTopic(
  topicId: string,
  topicTitle: string,
  params: { criticalTopicIds: string[] },
  required = false
): TopicScore {
  const isCritical = params.criticalTopicIds.includes(topicId);

  return {
    topicId,
    topicTitle,
    role: "barista",
    scorePercent: isCritical ? 0 : 90,
    correctAnswers: isCritical ? 0 : 2,
    totalQuestions: 2,
    totalWeight: 4,
    earnedWeight: isCritical ? 0 : 4,
    importance: "high",
    required,
    skippable: required ? false : "partial",
    status: isCritical ? "critical_gap" : "strong",
    recommendation: isCritical ? "full_module_with_mentor" : "short_summary"
  };
}

function makeRoute(): LearningRoute {
  return {
    employeeId: employee.id,
    role: "barista",
    grade: employee.grade,
    generatedAt: "2026-06-28T09:05:00.000Z",
    totalScorePercent: 58,
    summary:
      "Маршрут собран автоматически: фокус на эспрессо, молоке и обязательной чистке оборудования.",
    days: [
      {
        id: "day_1",
        title: "День 1",
        goal: "Закрыть критичные стандарты стойки.",
        focus: "Эспрессо, молоко, чистка.",
        tasks: [
          {
            id: "milk-help",
            dayId: "day_1",
            topicId: "barista-milk-texture",
            title: "Потренировать молоко с наставником",
            description: "Отработать микропену на капучино.",
            type: "practice",
            priority: "required",
            status: "needs_mentor",
            estimatedMinutes: 20,
            source: "Стандарт молока",
            reason: "Критичная тема требует контроля наставника."
          }
        ]
      },
      {
        id: "day_7",
        title: "День 7",
        goal: "Отработать напитки в потоке.",
        focus: "Практика под контролем.",
        tasks: [
          {
            id: "espresso-progress",
            dayId: "day_7",
            topicId: "barista-espresso-setup",
            title: "Контрольные шоты в потоке",
            description: "Проверить повторяемость эспрессо.",
            type: "check",
            priority: "recommended",
            status: "in_progress",
            estimatedMinutes: 15,
            source: "Стандарт эспрессо",
            reason: "Нужно закрепить настройку на практике."
          }
        ]
      },
      {
        id: "day_14",
        title: "День 14",
        goal: "Подтвердить стабильность.",
        focus: "Повторная проверка.",
        tasks: []
      }
    ]
  };
}
