import assert from "node:assert/strict";
import test from "node:test";
import { answerKnowledgeQuestion } from "../lib/answerKnowledgeQuestion";
import { retrieveKnowledge } from "../lib/retrieveKnowledge";
import type { EmployeeRole } from "./types";

const smokeQuestions: Array<{
  question: string;
  role: EmployeeRole;
  topicId: string;
  expectedSource: string;
}> = [
  {
    question: "Что делать, если на контейнере нет маркировки?",
    role: "cook",
    topicId: "cook-labeling",
    expectedSource: "Маркировка и сроки хранения"
  },
  {
    question: "Где смотреть граммовку ингредиента?",
    role: "cook",
    topicId: "cook-tech-cards",
    expectedSource: "Работа с техкартами"
  },
  {
    question: "Что делать, если ролл получился не по стандарту?",
    role: "cook",
    topicId: "cook-defects",
    expectedSource: "Работа с браком и переделками"
  },
  {
    question: "Можно ли использовать ингредиент без даты подготовки?",
    role: "cook",
    topicId: "cook-labeling",
    expectedSource: "Маркировка и сроки хранения"
  },
  {
    question: "Что входит в проверку упаковки заказа?",
    role: "cook",
    topicId: "cook-packaging",
    expectedSource: "Упаковка заказа"
  },
  {
    question: "Что делать, если заказ задерживается?",
    role: "admin",
    topicId: "admin-delivery",
    expectedSource: "Доставка и самовывоз"
  },
  {
    question: "Как действовать при возврате?",
    role: "admin",
    topicId: "admin-refunds",
    expectedSource: "Отмена и возврат заказа"
  },
  {
    question: "Что делать, если клиент недоволен заказом?",
    role: "admin",
    topicId: "admin-complaints",
    expectedSource: "Работа с претензиями"
  },
  {
    question: "Как обновить стоп-лист?",
    role: "admin",
    topicId: "admin-kitchen",
    expectedSource: "Стоп-лист и доступность позиций"
  },
  {
    question: "Что делать, если оплата не прошла?",
    role: "admin",
    topicId: "admin-payment",
    expectedSource: "Касса и оплата"
  }
];

test("RAG smoke answers operational questions with visible source labels", () => {
  for (const item of smokeQuestions) {
    const answer = answerKnowledgeQuestion({
      question: item.question,
      role: item.role,
      topicId: item.topicId
    });

    assert.match(answer.text, /Ответ:/);
    assert.match(answer.text, new RegExp(`Источник: ${item.expectedSource}`));
    assert.equal(answer.sources[0]?.title, item.expectedSource);
  }
});

test("RAG retrieves expected source documents for diagnostic topics", () => {
  const expectedTopicSources = [
    {
      role: "cook" as const,
      topicId: "cook-labeling",
      expectedSource: "Маркировка и сроки хранения"
    },
    {
      role: "cook" as const,
      topicId: "cook-tech-cards",
      expectedSource: "Работа с техкартами"
    },
    {
      role: "admin" as const,
      topicId: "admin-refunds",
      expectedSource: "Отмена и возврат заказа"
    },
    {
      role: "admin" as const,
      topicId: "admin-complaints",
      expectedSource: "Работа с претензиями"
    }
  ];

  for (const item of expectedTopicSources) {
    const results = retrieveKnowledge({
      role: item.role,
      topicId: item.topicId,
      limit: 1
    });

    assert.equal(results[0]?.title, item.expectedSource);
  }
});

test("RAG does not invent answers outside the knowledge base", () => {
  const answer = answerKnowledgeQuestion({
    question: "Как оформить больничный и кто оплачивает первые дни?",
    role: "admin"
  });

  assert.equal(answer.sources.length, 0);
  assert.match(answer.text, /Я не нашёл точного ответа в базе знаний УК/);
  assert.match(answer.text, /Лучше уточнить у управляющего точки/);
  assert.match(
    answer.text,
    /Источник в базе знаний не найден\. Рекомендуется уточнить у управляющего\./
  );
});
