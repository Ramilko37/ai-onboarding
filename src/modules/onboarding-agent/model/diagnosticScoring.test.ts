import assert from "node:assert/strict";
import test from "node:test";
import { competencyTopics } from "./mockData";
import type { DiagnosticAnswer, DiagnosticQuestion, EmployeeProfile } from "./types";
import { calculateDiagnosticResult } from "../lib/calculateDiagnosticResult";
import { getDiagnosticQuestions } from "../lib/getDiagnosticQuestions";

test("getDiagnosticQuestions returns stable role and grade specific sets", () => {
  const cookNoExperience = getDiagnosticQuestions({
    role: "cook",
    grade: "no_experience"
  });
  const cookNetwork = getDiagnosticQuestions({
    role: "cook",
    grade: "network_experience"
  });
  const adminNoExperience = getDiagnosticQuestions({
    role: "admin",
    grade: "no_experience"
  });

  assert.equal(cookNoExperience.length >= 10, true);
  assert.equal(adminNoExperience.length >= 10, true);
  assert.deepEqual(
    cookNoExperience.map((question) => question.id),
    getDiagnosticQuestions({ role: "cook", grade: "no_experience" }).map(
      (question) => question.id
    )
  );
  assert.equal(cookNoExperience.every((question) => question.role === "cook"), true);
  assert.equal(adminNoExperience.every((question) => question.role === "admin"), true);
  assert.equal(
    cookNoExperience.every(
      (question) =>
        question.difficulty === "basic" || question.difficulty === "intermediate"
    ),
    true
  );
  assert.equal(
    cookNetwork.every(
      (question) =>
        question.difficulty === "intermediate" || question.difficulty === "advanced"
    ),
    true
  );
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
  assert.equal(result.topicScores.length, 2);
  assert.equal(result.criticalTopics[0]?.topicId, "cook-labeling");
  assert.equal(result.strongTopics[0]?.topicId, "cook-packaging");

  const requiredLabeling = result.topicScores.find(
    (topic) => topic.topicId === "cook-labeling"
  );
  assert.equal(requiredLabeling?.required, true);
  assert.equal(requiredLabeling?.skippable, false);
  assert.equal(requiredLabeling?.recommendation, "full_module_with_mentor");
});
