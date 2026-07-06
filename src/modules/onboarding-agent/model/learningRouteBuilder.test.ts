import assert from "node:assert/strict";
import test from "node:test";
import { buildPersonalLearningRoute } from "../lib/buildPersonalLearningRoute";
import { calculateDiagnosticResult } from "../lib/calculateDiagnosticResult";
import { getDiagnosticQuestions } from "../lib/getDiagnosticQuestions";
import type { LearningRoute } from "./learningRouteTypes";
import { competencyTopics } from "./mockData";
import type {
  DiagnosticAnswer,
  DiagnosticQuestion,
  DiagnosticResult,
  EmployeeProfile,
  TopicScore
} from "./types";

const employee: EmployeeProfile = {
  id: "emp-route-1",
  name: "Анна",
  role: "cook",
  grade: "no_experience",
  location: "Кафе Тверская",
  startDate: "2026-06-22"
};

const topics: TopicScore[] = [
  makeTopic({
    topicId: "cook-labeling",
    topicTitle: "Маркировка и сроки",
    scorePercent: 90,
    required: true,
    status: "strong",
    recommendation: "short_summary",
    importance: "high"
  }),
  makeTopic({
    topicId: "cook-packaging",
    topicTitle: "Упаковка заказа",
    scorePercent: 100,
    required: false,
    status: "strong",
    recommendation: "skip_detailed_module",
    importance: "medium",
    skippable: true
  }),
  makeTopic({
    topicId: "cook-hygiene",
    topicTitle: "Гигиена и безопасность",
    scorePercent: 0,
    required: true,
    status: "critical_gap",
    recommendation: "full_module_with_mentor",
    importance: "high"
  }),
  makeTopic({
    topicId: "cook-tech-cards",
    topicTitle: "Техкарты популярных роллов",
    scorePercent: 65,
    required: false,
    status: "medium_gap",
    recommendation: "short_module",
    importance: "high",
    skippable: "partial"
  }),
  makeTopic({
    topicId: "cook-assembly",
    topicTitle: "Стандарты нарезки и сборки",
    scorePercent: 45,
    required: false,
    status: "medium_gap",
    recommendation: "full_module",
    importance: "high",
    skippable: "partial"
  })
];

const result: DiagnosticResult = {
  employeeId: employee.id,
  role: employee.role,
  grade: employee.grade,
  totalScorePercent: 55,
  topicScores: topics,
  strongTopics: topics.filter((topic) => topic.status === "strong"),
  weakTopics: topics.filter(
    (topic) => topic.status === "medium_gap" || topic.status === "critical_gap"
  ),
  criticalTopics: topics.filter((topic) => topic.status === "critical_gap"),
  requiredTopics: topics.filter((topic) => topic.required),
  completedAt: "2026-06-22T09:00:00.000Z"
};

test("buildPersonalLearningRoute creates day 1, day 7 and day 14 route", () => {
  const route = buildPersonalLearningRoute({ employee, result });

  assert.equal(route.employeeId, employee.id);
  assert.equal(route.role, employee.role);
  assert.equal(route.grade, employee.grade);
  assert.equal(route.totalScorePercent, result.totalScorePercent);
  assert.deepEqual(
    route.days.map((day) => day.id),
    ["day_1", "day_7", "day_14"]
  );
  assert.equal(route.days.every((day) => day.tasks.length > 0), true);
});

test("required topics always stay in the route", () => {
  const route = buildPersonalLearningRoute({ employee, result });
  const taskTopicIds = new Set(getAllTasks(route).map((task) => task.topicId));

  for (const topic of result.requiredTopics) {
    assert.equal(taskTopicIds.has(topic.topicId), true);
  }
});

test("strong topics are shortened and do not receive full modules", () => {
  const route = buildPersonalLearningRoute({ employee, result });
  const strongOptionalTasks = getAllTasks(route).filter(
    (task) => task.topicId === "cook-packaging"
  );

  assert.equal(strongOptionalTasks.length, 1);
  assert.equal(strongOptionalTasks[0].type, "summary");
  assert.equal(
    strongOptionalTasks.some((task) => task.title.includes("Полный модуль")),
    false
  );
  assert.match(strongOptionalTasks[0].reason, /Тема сокращена/);
});

test("critical topics receive full module, practice and repeated check", () => {
  const route = buildPersonalLearningRoute({ employee, result });
  const criticalTasks = getAllTasks(route).filter(
    (task) => task.topicId === "cook-hygiene"
  );

  assert.deepEqual(
    criticalTasks.map((task) => task.type),
    ["read", "practice", "check"]
  );
  assert.equal(
    criticalTasks.some((task) => task.title.includes("под контролем управляющего")),
    true
  );
});

test("tasks explain why they were assigned and include topic sources", () => {
  const route = buildPersonalLearningRoute({ employee, result });
  const tasks = getAllTasks(route);

  assert.equal(tasks.every((task) => task.reason.length > 0), true);
  assert.equal(
    tasks
      .filter((task) => task.topicId)
      .every((task) => Boolean(task.source)),
    true
  );
});

test("builder is deterministic except generatedAt", () => {
  const first = withoutGeneratedAt(buildPersonalLearningRoute({ employee, result }));
  const second = withoutGeneratedAt(buildPersonalLearningRoute({ employee, result }));

  assert.deepEqual(first, second);
});

test("network employee diagnostic route keeps every role topic in the generated route", () => {
  const networkEmployee: EmployeeProfile = {
    ...employee,
    grade: "network_experience"
  };
  const questions = getDiagnosticQuestions({
    role: networkEmployee.role,
    grade: networkEmployee.grade
  });
  const diagnosticResult = calculateDiagnosticResult({
    employee: networkEmployee,
    questions,
    answers: createCorrectAnswers(questions),
    topics: competencyTopics
  });
  const route = buildPersonalLearningRoute({
    employee: networkEmployee,
    result: diagnosticResult
  });
  const taskTopicIds = new Set(getAllTasks(route).map((task) => task.topicId));
  const roleTopicIds = competencyTopics
    .filter((topic) => topic.role === networkEmployee.role)
    .map((topic) => topic.id);

  for (const topicId of roleTopicIds) {
    assert.equal(taskTopicIds.has(topicId), true, `route misses topic ${topicId}`);
  }
});

test("barista route creates day 1, day 7 and day 14 development plan", () => {
  const baristaEmployee: EmployeeProfile = {
    id: "barista-route-1",
    name: "София",
    role: "barista",
    grade: "horeca_experience",
    location: "Valle Sanchez · Арбат",
    startDate: "2026-06-28"
  };
  const questions = getDiagnosticQuestions({
    role: baristaEmployee.role,
    grade: baristaEmployee.grade
  });
  const diagnosticResult = calculateDiagnosticResult({
    employee: baristaEmployee,
    questions,
    answers: createBaristaGapAnswers(questions),
    topics: competencyTopics
  });
  const route = buildPersonalLearningRoute({
    employee: baristaEmployee,
    result: diagnosticResult
  });
  const tasks = getAllTasks(route);

  assert.equal(route.role, "barista");
  assert.deepEqual(
    route.days.map((day) => day.id),
    ["day_1", "day_7", "day_14"]
  );
  assert.match(route.days[0].focus, /эспрессо|гигиена|оборудован/i);
  assert.equal(
    tasks.some((task) => task.topicId === "barista-milk-texture"),
    true
  );
  assert.equal(
    tasks.some(
      (task) =>
        task.topicId === "barista-espresso-setup" &&
        task.title.includes("под контролем управляющего")
    ),
    true
  );

  for (const topic of diagnosticResult.requiredTopics) {
    assert.equal(
      tasks.some((task) => task.topicId === topic.topicId),
      true,
      `barista route misses required topic ${topic.topicId}`
    );
  }
});

function makeTopic(
  overrides: Partial<TopicScore> & Pick<TopicScore, "topicId" | "topicTitle">
): TopicScore {
  return {
    topicId: overrides.topicId,
    topicTitle: overrides.topicTitle,
    role: "cook",
    scorePercent: overrides.scorePercent ?? 0,
    correctAnswers: 0,
    totalQuestions: 2,
    totalWeight: 2,
    earnedWeight: 0,
    importance: overrides.importance ?? "medium",
    required: overrides.required ?? false,
    skippable: overrides.skippable ?? false,
    status: overrides.status ?? "medium_gap",
    recommendation: overrides.recommendation ?? "full_module"
  };
}

function getAllTasks(route: LearningRoute) {
  return route.days.flatMap((day) => day.tasks);
}

function withoutGeneratedAt(route: LearningRoute) {
  return {
    ...route,
    generatedAt: "<ignored>"
  };
}

function createCorrectAnswers(questions: DiagnosticQuestion[]): DiagnosticAnswer[] {
  return questions.map((question) => {
    const correctOption = question.options.find((option) => option.isCorrect);

    assert.ok(correctOption);

    return {
      questionId: question.id,
      selectedOptionId: correctOption.id,
      isCorrect: true,
      topicId: question.topicId,
      weight: question.weight
    };
  });
}

function createBaristaGapAnswers(questions: DiagnosticQuestion[]): DiagnosticAnswer[] {
  return questions.map((question) => {
    const option =
      question.topicId === "barista-espresso-setup" ||
      question.topicId === "barista-milk-texture"
        ? question.options.find((item) => !item.isCorrect)
        : question.options.find((item) => item.isCorrect);

    assert.ok(option);

    return {
      questionId: question.id,
      selectedOptionId: option.id,
      isCorrect: option.isCorrect,
      topicId: question.topicId,
      weight: question.weight
    };
  });
}
