import type {
  LearningRoute,
  LearningRouteDayId,
  LearningRouteStatus,
  LearningTask,
} from "./learningRouteTypes";

export type ProgressValue = {
  done: number;
  total: number;
  percent: number;
};

export function getRouteTasks(route?: LearningRoute): LearningTask[] {
  return route?.days.flatMap((day) => day.tasks) ?? [];
}

export function getTodayTasks(route?: LearningRoute): LearningTask[] {
  return (route?.days.find((day) => day.id === "day_1")?.tasks ?? []).slice(0, 3);
}

export function getNextTask(route?: LearningRoute): LearningTask | undefined {
  const todayTasks = getTodayTasks(route);
  const routeTasks = getRouteTasks(route);

  return (
    todayTasks.find((task) => task.status === "in_progress") ??
    todayTasks.find((task) => task.status === "todo") ??
    routeTasks.find((task) => task.status === "in_progress") ??
    routeTasks.find((task) => task.status === "todo")
  );
}

export function calculateTaskProgress(tasks: LearningTask[]): ProgressValue {
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === "done").length;

  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export function getLearningProgressValue(route?: LearningRoute): ProgressValue {
  return calculateTaskProgress(getRouteTasks(route));
}

export function getPeriodProgress(
  route: LearningRoute | undefined,
  dayId: LearningRouteDayId,
): ProgressValue & { periodId: LearningRouteDayId } {
  const tasks = route?.days.find((day) => day.id === dayId)?.tasks ?? [];

  return {
    ...calculateTaskProgress(tasks),
    periodId: dayId,
  };
}

export function getLearningProgress(route?: LearningRoute): number {
  return getLearningProgressValue(route).percent;
}

export function getRouteStatus(route?: LearningRoute): LearningRouteStatus {
  const tasks = getRouteTasks(route);
  if (tasks.some((task) => task.status === "blocked")) return "has_blockers";
  if (tasks.length > 0 && tasks.every((task) => task.status === "done")) return "completed";
  if (tasks.some((task) => task.status === "in_progress" || task.status === "done")) {
    return "in_progress";
  }
  return "not_started";
}
