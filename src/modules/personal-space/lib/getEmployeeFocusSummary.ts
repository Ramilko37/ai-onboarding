import type {
  LearningRoute,
  LearningTask,
} from "../../onboarding-agent/model/learningRouteTypes";

export type EmployeeFocusSummary = {
  todayTasks: LearningTask[];
  completedTodayCount: number;
  totalTodayCount: number;
  nextTask?: LearningTask;
  routeCompletedCount: number;
  routeTaskCount: number;
  routeProgressPercent: number;
};

export function getEmployeeFocusSummary(
  route?: LearningRoute,
): EmployeeFocusSummary {
  const todayTasks = route?.days.find((day) => day.id === "day_1")?.tasks ?? [];
  const routeTasks = route?.days.flatMap((day) => day.tasks) ?? [];
  const completedTodayCount = todayTasks.filter((task) => task.status === "done").length;
  const routeCompletedCount = routeTasks.filter((task) => task.status === "done").length;

  return {
    todayTasks,
    completedTodayCount,
    totalTodayCount: todayTasks.length,
    nextTask: todayTasks.find((task) => task.status !== "done"),
    routeCompletedCount,
    routeTaskCount: routeTasks.length,
    routeProgressPercent:
      routeTasks.length === 0
        ? 0
        : Math.round((routeCompletedCount / routeTasks.length) * 100),
  };
}
