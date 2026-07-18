import assert from "node:assert/strict";
import { test } from "node:test";
import type { LearningRoute } from "../../onboarding-agent/model/learningRouteTypes";
import { knowledgeLinks, knowledgeNodes } from "../data";
import {
  getKnowledgeConstellationItems,
  getNextConstellationIndex,
} from "./getKnowledgeConstellationItems";

function makeRoute(): LearningRoute {
  return {
    employeeId: "employee-1",
    role: "barista",
    grade: "no_experience",
    generatedAt: "2026-07-18T09:00:00.000Z",
    totalScorePercent: 64,
    summary: "Маршрут для теста",
    days: [
      {
        id: "day_1",
        title: "День 1",
        goal: "Уверенный старт",
        focus: "Молоко",
        tasks: [
          {
            id: "hygiene-task",
            dayId: "day_1",
            topicId: "hygiene",
            title: "Стандарт: Гигиена стойки",
            description: "Проверить рабочую зону перед сменой.",
            type: "check",
            priority: "required",
            status: "done",
            estimatedMinutes: 5,
            reason: "Обязательный стандарт",
          },
          {
            id: "milk-task",
            dayId: "day_1",
            topicId: "milk",
            title: "Практика: Молоко и текстура",
            description: "Отработать текстуру молока для капучино.",
            type: "practice",
            priority: "required",
            status: "todo",
            estimatedMinutes: 12,
            reason: "Зона развития",
          },
        ],
      },
    ],
  };
}

test("derives selected-topic details and links from a learning route", () => {
  const routeMap = getKnowledgeConstellationItems(makeRoute());

  assert.equal(routeMap.items[1]?.title, "Молоко и текстура");
  assert.equal(routeMap.items[1]?.statusLabel, "Впереди");
  assert.equal(routeMap.items[1]?.task?.id, "milk-task");
  assert.deepEqual(routeMap.links, [["hygiene", "milk"]]);
});

test("keeps the fallback constellation readable without a route", () => {
  const fallbackMap = getKnowledgeConstellationItems();

  assert.equal(fallbackMap.items.length, knowledgeNodes.length);
  assert.deepEqual(fallbackMap.links, knowledgeLinks);
  assert.equal(fallbackMap.items[0]?.title, "Гигиена");
  assert.equal(fallbackMap.items[0]?.actionLabel, "Открыть материалы");
});

test("moves constellation selection with wrapping keyboard navigation", () => {
  assert.equal(getNextConstellationIndex(0, "ArrowLeft", 3), 2);
  assert.equal(getNextConstellationIndex(2, "ArrowRight", 3), 0);
  assert.equal(getNextConstellationIndex(1, "Home", 3), 0);
  assert.equal(getNextConstellationIndex(1, "End", 3), 2);
  assert.equal(getNextConstellationIndex(0, "ArrowRight", 0), 0);
});
