import assert from "node:assert/strict";
import { test } from "node:test";
import type { LearningRoute } from "../../onboarding-agent/model/learningRouteTypes";
import { getEmployeeFocusSummary } from "./getEmployeeFocusSummary";
import {
  getNextWorkspaceTab,
  getTodayTaskToggleStatus,
} from "./workspaceNavigation";

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
        id: "day_7",
        title: "День 7",
        goal: "Стабильность",
        focus: "Повторение",
        tasks: [],
      },
      {
        id: "day_1",
        title: "День 1",
        goal: "Уверенный старт",
        focus: "Эспрессо",
        tasks: [
          {
            id: "done-task",
            dayId: "day_1",
            title: "Гигиена стойки",
            description: "Проверить рабочую зону",
            type: "check",
            priority: "required",
            status: "done",
            estimatedMinutes: 5,
            reason: "Обязательный стандарт",
          },
          {
            id: "next-task",
            dayId: "day_1",
            title: "Настройка эспрессо",
            description: "Настроить рецепт",
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

test("selects Day 1 tasks and returns the next incomplete task", () => {
  const summary = getEmployeeFocusSummary(makeRoute());

  assert.deepEqual(
    summary.todayTasks.map((task) => task.id),
    ["done-task", "next-task"],
  );
  assert.equal(summary.completedTodayCount, 1);
  assert.equal(summary.totalTodayCount, 2);
  assert.equal(summary.nextTask?.id, "next-task");
});

test("calculates progress across every route day", () => {
  const route = makeRoute();
  route.days[0]?.tasks.push({
    id: "day-seven-task",
    dayId: "day_7",
    title: "Повторная проверка",
    description: "Проверить стабильность",
    type: "check",
    priority: "recommended",
    status: "done",
    estimatedMinutes: 8,
    reason: "Закрепить навык",
  });

  const summary = getEmployeeFocusSummary(route);

  assert.equal(summary.routeCompletedCount, 2);
  assert.equal(summary.routeTaskCount, 3);
  assert.equal(summary.routeProgressPercent, 67);
});

test("returns a safe empty summary without a route", () => {
  const summary = getEmployeeFocusSummary(undefined);

  assert.deepEqual(summary.todayTasks, []);
  assert.equal(summary.nextTask, undefined);
  assert.equal(summary.routeProgressPercent, 0);
});

test("moves through desktop workspace tabs with wrapping keyboard navigation", () => {
  assert.equal(getNextWorkspaceTab("today", "ArrowLeft"), "knowledge");
  assert.equal(getNextWorkspaceTab("knowledge", "ArrowRight"), "today");
  assert.equal(getNextWorkspaceTab("mentor", "Home"), "today");
  assert.equal(getNextWorkspaceTab("route", "End"), "knowledge");
  assert.equal(getNextWorkspaceTab("route", "Tab"), undefined);
});

test("toggles a generated Today task between done and todo", () => {
  assert.equal(getTodayTaskToggleStatus("done"), "todo");
  assert.equal(getTodayTaskToggleStatus("todo"), "done");
  assert.equal(getTodayTaskToggleStatus("in_progress"), "done");
  assert.equal(getTodayTaskToggleStatus("needs_mentor"), "done");
});
