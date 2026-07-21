import assert from "node:assert/strict";
import test from "node:test";
import { competencyTopics } from "./mockData";
import type {
  DiagnosticAnswer,
  DiagnosticQuestion,
  EmployeeGrade,
  EmployeeProfile,
  EmployeeRole
} from "./types";
import { calculateDiagnosticResult } from "../lib/calculateDiagnosticResult";
import { getDiagnosticQuestions } from "../lib/getDiagnosticQuestions";

const roles: EmployeeRole[] = ["cook", "admin", "barista"];
const grades: EmployeeGrade[] = [
  "no_experience",
  "horeca_experience",
  "network_experience"
];

test("getDiagnosticQuestions returns stable eight-question role and grade specific sets", () => {
  for (const role of roles) {
    for (const grade of grades) {
      const questions = getDiagnosticQuestions({ role, grade });
      const repeatedQuestions = getDiagnosticQuestions({ role, grade });
      const selectedTopicIds = new Set(questions.map((question) => question.topicId));

      assert.equal(questions.length, 8);
      assert.deepEqual(
        questions.map((question) => question.id),
        repeatedQuestions.map((question) => question.id)
      );
      assert.equal(questions.every((question) => question.role === role), true);

      assert.equal(selectedTopicIds.size, questions.length);
    }
  }
});

test("getDiagnosticQuestions keeps basic anchors for network employees when a topic has no harder question", () => {
  const cookNetworkTopicIds = new Set(
    getDiagnosticQuestions({ role: "cook", grade: "network_experience" }).map(
      (question) => question.topicId
    )
  );
  const adminNetworkTopicIds = new Set(
    getDiagnosticQuestions({ role: "admin", grade: "network_experience" }).map(
      (question) => question.topicId
    )
  );

  assert.equal(cookNetworkTopicIds.has("cook-hygiene"), true);
  assert.equal(cookNetworkTopicIds.has("cook-packaging"), true);
  assert.equal(adminNetworkTopicIds.has("admin-communication"), true);
  assert.equal(adminNetworkTopicIds.has("admin-orders"), true);
  assert.equal(adminNetworkTopicIds.has("admin-discounts"), true);
});

test("barista diagnostic covers coffee standards and keeps safety topics required", () => {
  const questions = getDiagnosticQuestions({
    role: "barista",
    grade: "network_experience"
  });
  const selectedTopicIds = new Set(questions.map((question) => question.topicId));

  assert.equal(questions.length, 8);
  assert.equal(questions.every((question) => question.role === "barista"), true);
  assert.equal(selectedTopicIds.has("barista-espresso-setup"), true);
  assert.equal(selectedTopicIds.has("barista-milk-texture"), true);
  assert.equal(selectedTopicIds.has("barista-equipment-cleaning"), true);
  assert.deepEqual(getRoleTopicIds("barista", true), [
    "barista-equipment-cleaning",
    "barista-hygiene",
    "barista-milk-texture"
  ]);
});

test("barista diagnostic includes methodologist day-one espresso material", () => {
  const questions = getDiagnosticQuestions({
    role: "barista",
    grade: "no_experience"
  });
  const methodologistQuestions = questions.filter(
    (question) => question.source === "Материалы методолога · День 1: Эспрессо"
  );
  const questionText = questions.map((question) => question.question).join(" ");
  const optionText = questions
    .flatMap((question) => question.options.map((option) => option.text))
    .join(" ");

  assert.equal(methodologistQuestions.length >= 5, true);
  assert.match(questionText, /18-27-38/);
  assert.match(questionText, /закладк/i);
  assert.match(questionText, /времени экстракции/i);
  assert.match(questionText, /температур/i);
  assert.match(optionText, /55-65°C|23-32 секунды|17\.5 г/);
});

test("calculateDiagnosticResult scores topics and keeps required topics mandatory", () => {
  const employee: EmployeeProfile = {
    id: "emp-1",
    name: "Анна",
    role: "cook",
    grade: "no_experience",
    location: "Кафе Тверская",
    startDate: "2026-06-21"
  };
  const questions: DiagnosticQuestion[] = [
    {
      id: "q-1",
      role: "cook",
      topicId: "cook-labeling",
      type: "single_choice",
      difficulty: "basic",
      question: "Что делать с контейнером без маркировки?",
      options: [
        { id: "a", text: "Использовать", isCorrect: false },
        { id: "b", text: "Не использовать до проверки", isCorrect: true }
      ],
      explanation: "Без маркировки продукт нельзя использовать.",
      weight: 2
    },
    {
      id: "q-2",
      role: "cook",
      topicId: "cook-packaging",
      type: "single_choice",
      difficulty: "basic",
      question: "Когда проверять комплектность заказа?",
      options: [
        { id: "a", text: "Перед передачей", isCorrect: true },
        { id: "b", text: "После жалобы", isCorrect: false }
      ],
      explanation: "Комплектность проверяют до передачи заказа.",
      weight: 1
    }
  ];
  const answers: DiagnosticAnswer[] = [
    {
      questionId: "q-1",
      selectedOptionId: "a",
      isCorrect: false,
      topicId: "cook-labeling",
      weight: 2
    },
    {
      questionId: "q-2",
      selectedOptionId: "a",
      isCorrect: true,
      topicId: "cook-packaging",
      weight: 1
    }
  ];

  const result = calculateDiagnosticResult({
    employee,
    questions,
    answers,
    topics: competencyTopics
  });

  assert.equal(result.totalScorePercent, 33);
  assert.equal(result.topicScores.length, getRoleTopicIds("cook").length);
  assert.equal(
    result.criticalTopics.some((topic) => topic.topicId === "cook-labeling"),
    true
  );
  assert.equal(
    result.strongTopics.some((topic) => topic.topicId === "cook-packaging"),
    true
  );

  const requiredLabeling = result.topicScores.find(
    (topic) => topic.topicId === "cook-labeling"
  );
  assert.equal(requiredLabeling?.required, true);
  assert.equal(requiredLabeling?.skippable, false);
  assert.equal(requiredLabeling?.recommendation, "full_module_with_mentor");

  const unansweredRequiredStorage = result.topicScores.find(
    (topic) => topic.topicId === "cook-storage"
  );
  assert.equal(unansweredRequiredStorage?.totalQuestions, 0);
  assert.equal(unansweredRequiredStorage?.required, true);
  assert.equal(unansweredRequiredStorage?.status, "critical_gap");

  assert.deepEqual(
    result.requiredTopics.map((topic) => topic.topicId).sort(),
    getRoleTopicIds("cook", true)
  );
});

test("calculateDiagnosticResult scores barista gaps by coffee topic", () => {
  const employee: EmployeeProfile = {
    id: "barista-emp-1",
    name: "София",
    role: "barista",
    grade: "horeca_experience",
    location: "Valle Sanchez · Арбат",
    startDate: "2026-06-28"
  };
  const questions = getDiagnosticQuestions({
    role: employee.role,
    grade: employee.grade
  });
  const answers: DiagnosticAnswer[] = questions.map((question) => {
    const selectedOption =
      question.topicId === "barista-espresso-setup"
        ? question.options.find((option) => !option.isCorrect)
        : question.options.find((option) => option.isCorrect);

    assert.ok(selectedOption);

    return {
      questionId: question.id,
      selectedOptionId: selectedOption.id,
      isCorrect: selectedOption.isCorrect,
      topicId: question.topicId,
      weight: question.weight
    };
  });

  const result = calculateDiagnosticResult({
    employee,
    questions,
    answers,
    topics: competencyTopics
  });
  const espresso = result.topicScores.find(
    (topic) => topic.topicId === "barista-espresso-setup"
  );
  const cleaning = result.topicScores.find(
    (topic) => topic.topicId === "barista-equipment-cleaning"
  );

  assert.equal(result.role, "barista");
  assert.equal(result.topicScores.length, getRoleTopicIds("barista").length);
  assert.equal(espresso?.status, "critical_gap");
  assert.equal(espresso?.recommendation, "full_module_with_mentor");
  assert.equal(cleaning?.required, true);
  assert.equal(cleaning?.recommendation, "short_summary");
});

function getRoleTopicIds(role: EmployeeRole, requiredOnly = false) {
  return competencyTopics
    .filter((topic) => topic.role === role && (!requiredOnly || topic.required))
    .map((topic) => topic.id)
    .sort();
}
