import assert from "node:assert/strict";
import { test } from "node:test";
import type { LearningRoute } from "../../onboarding-agent/model/learningRouteTypes";
import { getEmployeeFocusSummary } from "./getEmployeeFocusSummary";
import { buildNextTaskAnswer, isNextTaskPrompt } from "./mentorRouteAnswer";
import {
  getTaskHref,
  getTaskIdFromPathname,
  getWorkspaceHref,
  getWorkspaceViewFromPathname,
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

test("keeps zero task completion at zero percent", () => {
  const route = makeRoute();
  route.days[1]!.tasks = route.days[1]!.tasks.map((task) => ({
    ...task,
    status: "todo",
  }));

  const summary = getEmployeeFocusSummary(route);

  assert.equal(summary.completedTodayCount, 0);
  assert.equal(summary.totalTodayCount, 2);
  assert.equal(summary.todayProgressPercent, 0);
  assert.equal(summary.routeCompletedCount, 0);
  assert.equal(summary.routeTaskCount, 2);
  assert.equal(summary.routeProgressPercent, 0);
});

test("does not count in-progress or blocked tasks as complete", () => {
  const route = makeRoute();
  route.days[1]!.tasks = [
    { ...route.days[1]!.tasks[0]!, status: "in_progress" },
    { ...route.days[1]!.tasks[1]!, status: "blocked" },
  ];

  const summary = getEmployeeFocusSummary(route);

  assert.equal(summary.completedTodayCount, 0);
  assert.equal(summary.todayProgressPercent, 0);
  assert.equal(summary.routeProgressPercent, 0);
  assert.equal(summary.nextTask?.id, "done-task");
});

test("skips blocked tasks when selecting the next task", () => {
  const route = makeRoute();
  route.days[1]!.tasks = [
    { ...route.days[1]!.tasks[0]!, status: "blocked" },
    { ...route.days[1]!.tasks[1]!, status: "todo" },
  ];

  const summary = getEmployeeFocusSummary(route);

  assert.equal(summary.nextTask?.id, "next-task");
});

test("returns a safe empty summary without a route", () => {
  const summary = getEmployeeFocusSummary(undefined);

  assert.deepEqual(summary.todayTasks, []);
  assert.equal(summary.nextTask, undefined);
  assert.equal(summary.todayProgressPercent, 0);
  assert.equal(summary.routeProgressPercent, 0);
});

test("moves through desktop workspace tabs with wrapping keyboard navigation", () => {
  assert.equal(getNextWorkspaceTab("today", "ArrowLeft"), "mentor");
  assert.equal(getNextWorkspaceTab("mentor", "ArrowRight"), "today");
  assert.equal(getNextWorkspaceTab("mentor", "Home"), "today");
  assert.equal(getNextWorkspaceTab("route", "End"), "mentor");
  assert.equal(getNextWorkspaceTab("route", "Tab"), undefined);
});

test("maps employee workspace views to canonical URLs", () => {
  assert.equal(getWorkspaceHref("today"), "/onboarding-agent/today");
  assert.equal(getWorkspaceHref("route"), "/onboarding-agent/plan");
  assert.equal(getWorkspaceHref("mentor"), "/onboarding-agent/mentor");
  assert.equal(
    getTaskHref("milk-texture", "route"),
    "/onboarding-agent/tasks/milk-texture?from=route",
  );

  assert.equal(getWorkspaceViewFromPathname("/onboarding-agent"), "today");
  assert.equal(getWorkspaceViewFromPathname("/onboarding-agent/today"), "today");
  assert.equal(getWorkspaceViewFromPathname("/onboarding-agent/plan"), "route");
  assert.equal(getWorkspaceViewFromPathname("/onboarding-agent/mentor"), "mentor");
  assert.equal(getWorkspaceViewFromPathname("/onboarding-agent/tasks/milk-texture"), "task");
  assert.equal(getTaskIdFromPathname("/onboarding-agent/tasks/milk-texture"), "milk-texture");
});

test("builds the mentor next-task answer from the personal route", () => {
  const nextTask = makeRoute().days[1]!.tasks[1]!;
  const answer = buildNextTaskAnswer(nextTask, () => "answer-1");

  assert.equal(isNextTaskPrompt("С чего начать сегодня?"), true);
  assert.equal(isNextTaskPrompt(" с чего начать сегодня "), true);
  assert.equal(answer.id, "answer-1");
  assert.equal(answer.author, "guide");
  assert.match(answer.text, /Настройка эспрессо/);
  assert.match(answer.text, /12 минут/);
  assert.equal(answer.sourceLabel, "Ваш персональный план");
  assert.deepEqual(answer.action, {
    label: "Открыть задачу",
    href: "/onboarding-agent/tasks/next-task",
  });
});

test("builds a mentor plan answer when every task is complete or blocked", () => {
  const answer = buildNextTaskAnswer(undefined, () => "answer-empty");

  assert.equal(answer.id, "answer-empty");
  assert.match(answer.text, /На сегодня всё/);
  assert.equal(answer.sourceLabel, "Ваш персональный план");
  assert.deepEqual(answer.action, {
    label: "Открыть мой план",
    href: "/onboarding-agent/plan",
  });
});

test("toggles a generated Today task between done and todo", () => {
  assert.equal(getTodayTaskToggleStatus("done"), "todo");
  assert.equal(getTodayTaskToggleStatus("todo"), "done");
  assert.equal(getTodayTaskToggleStatus("in_progress"), "done");
  assert.equal(getTodayTaskToggleStatus("blocked"), "done");
});
