import type {
  LearningRoute,
  LearningRouteStatus,
  LearningTask,
} from "./learningRouteTypes";

export function getRouteTasks(route?: LearningRoute): LearningTask[] {
  return route?.days.flatMap((day) => day.tasks) ?? [];
}

export function getTodayTasks(route?: LearningRoute): LearningTask[] {
  return (route?.days.find((day) => day.id === "day_1")?.tasks ?? []).slice(0, 3);
}

export function getNextTask(route?: LearningRoute): LearningTask | undefined {
  return getRouteTasks(route).find((task) => task.status !== "done");
}

export function getLearningProgress(route?: LearningRoute): number {
  const tasks = getRouteTasks(route);
  const doneTasks = tasks.filter((task) => task.status === "done").length;
  return tasks.length === 0 ? 0 : Math.round((doneTasks / tasks.length) * 100);
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
