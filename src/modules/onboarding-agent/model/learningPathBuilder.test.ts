import assert from "node:assert/strict";
import test from "node:test";
import { buildLearningPath, getLearningFormat } from "../lib/buildLearningPath";
import { learningModules } from "./learningModules.mock";
import { competencyTopics } from "./mockData";
import type { DiagnosticResult, EmployeeProfile, TopicScore } from "./types";

const employee: EmployeeProfile = {
  id: "emp-learning-1",
  name: "Мария",
  role: "admin",
  grade: "horeca_experience",
  location: "Кафе Тверская",
  startDate: "2026-06-21"
};

test("getLearningFormat keeps required topics in the route and skips only fully skippable strong topics", () => {
  assert.equal(
    getLearningFormat({
      scorePercent: 92,
      required: true,
      skippable: false
    }),
    "summary"
  );
  assert.equal(
    getLearningFormat({
      scorePercent: 92,
      required: false,
      skippable: true
    }),
    "skip"
  );
  assert.equal(
    getLearningFormat({
      scorePercent: 58,
      required: false,
      skippable: "partial"
    }),
    "full_module"
  );
});

test("buildLearningPath creates a sourced 14 day route with checkpoints, metrics, and manager recommendations", () => {
  const result = createDiagnosticResult([
    createTopicScore("admin-communication", 90, {
      required: false,
      skippable: "partial"
    }),
    createTopicScore("admin-refunds", 25, {
      required: true,
      skippable: false
    }),
    createTopicScore("admin-kitchen", 45, {
      required: false,
      skippable: "partial"
    }),
    createTopicScore("admin-reporting", 90, {
      required: false,
      skippable: "partial"
    }),
    createTopicScore("admin-shift-close", 92, {
      required: false,
      skippable: true
    })
  ]);

  const path = buildLearningPath({
    employee,
    diagnosticResult: result,
    topics: competencyTopics,
    learningModules
  });

  assert.equal(path.days.length, 14);
  assert.equal(path.days[6].checkpoint?.title, "Промежуточная проверка");
  assert.equal(path.days[13].checkpoint?.title, "Итоговая проверка готовности");
  assert.equal(path.totalStandardMinutes, 400);
  assert.equal(path.totalPersonalizedMinutes > 0, true);
  assert.equal(path.savedMinutes, path.totalStandardMinutes - path.totalPersonalizedMinutes);

  const allModules = path.days.flatMap((day) => day.modules);
  const refundsModules = allModules.filter(
    (module) => module.topicId === "admin-refunds"
  );
  assert.equal(
    refundsModules.some((module) => module.format === "full_module"),
    true
  );
  assert.equal(
    refundsModules.some((module) => module.format === "mentor_task"),
    true
  );
  assert.equal(
    refundsModules.every((module) => module.sources.length > 0),
    true
  );
  assert.equal(
    allModules.some((module) => module.topicId === "admin-shift-close"),
    false
  );
  assert.equal(
    path.shortenedTopics.some((topic) => topic.topicId === "admin-communication"),
    true
  );
  assert.equal(
    path.strengthenedTopics.some(
      (topic) => topic.topicId === "admin-communication"
    ),
    false
  );
  assert.equal(
    path.strengthenedTopics.some((topic) => topic.topicId === "admin-refunds"),
    true
  );
  assert.equal(
    path.criticalTopics.some((topic) => topic.topicId === "admin-refunds"),
    true
  );
  assert.equal(
    path.managerRecommendations.some(
      (recommendation) => recommendation.topicId === "admin-refunds"
    ),
    true
  );
});

function createDiagnosticResult(topicScores: TopicScore[]): DiagnosticResult {
  return {
    employeeId: employee.id,
    role: employee.role,
    grade: employee.grade,
    totalScorePercent: Math.round(
      topicScores.reduce((sum, topic) => sum + topic.scorePercent, 0) /
        topicScores.length
    ),
    topicScores,
    strongTopics: topicScores.filter((topic) => topic.scorePercent >= 80),
    weakTopics: topicScores.filter((topic) => topic.scorePercent < 60),
    criticalTopics: topicScores.filter((topic) => topic.scorePercent < 40),
    requiredTopics: topicScores.filter((topic) => topic.required),
    completedAt: "2026-06-21T08:00:00.000Z"
  };
}

function createTopicScore(
  topicId: string,
  scorePercent: number,
  options: Pick<TopicScore, "required" | "skippable">
): TopicScore {
  const topic = competencyTopics.find((item) => item.id === topicId);

  if (!topic) {
    throw new Error(`Unknown topic: ${topicId}`);
  }

  return {
    topicId,
    topicTitle: topic.title,
    role: topic.role,
    scorePercent,
    correctAnswers: scorePercent >= 80 ? 2 : scorePercent >= 40 ? 1 : 0,
    totalQuestions: 2,
    totalWeight: 2,
    earnedWeight: scorePercent >= 80 ? 2 : scorePercent >= 40 ? 1 : 0,
    importance: topic.importance,
    required: options.required,
    skippable: options.skippable,
    status:
      scorePercent >= 80
        ? "strong"
        : scorePercent >= 60
          ? "good"
          : scorePercent >= 40
            ? "medium_gap"
            : "critical_gap",
    recommendation:
      scorePercent >= 80
        ? options.skippable === true
          ? "skip_detailed_module"
          : "short_summary"
        : scorePercent >= 60
          ? "short_module"
          : scorePercent >= 40
            ? "full_module"
            : "full_module_with_mentor"
  };
}
