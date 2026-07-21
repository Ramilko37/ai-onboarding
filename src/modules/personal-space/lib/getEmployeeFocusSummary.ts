import type {
  LearningRoute,
  LearningTask,
} from "../../onboarding-agent/model/learningRouteTypes";
import { getLearningProgress, getNextTask, getRouteTasks, getTodayTasks } from "../../onboarding-agent/model/onboardingSelectors";

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
  const todayTasks = getTodayTasks(route);
  const routeTasks = getRouteTasks(route);
  const completedTodayCount = todayTasks.filter((task) => task.status === "done").length;
  const routeCompletedCount = routeTasks.filter((task) => task.status === "done").length;

  return {
    todayTasks,
    completedTodayCount,
    totalTodayCount: todayTasks.length,
    nextTask: getNextTask(route),
    routeCompletedCount,
    routeTaskCount: routeTasks.length,
    routeProgressPercent: getLearningProgress(route),
  };
}
