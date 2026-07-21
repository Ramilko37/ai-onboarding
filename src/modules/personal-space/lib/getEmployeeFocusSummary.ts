import type {
  LearningRoute,
  LearningTask,
} from "../../onboarding-agent/model/learningRouteTypes";
import {
  calculateTaskProgress,
  getLearningProgressValue,
  getNextTask,
  getRouteTasks,
  getTodayTasks,
} from "../../onboarding-agent/model/onboardingSelectors";

export type EmployeeFocusSummary = {
  todayTasks: LearningTask[];
  completedTodayCount: number;
  totalTodayCount: number;
  todayProgressPercent: number;
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
  const todayProgress = calculateTaskProgress(todayTasks);
  const routeProgress = getLearningProgressValue(route);

  return {
    todayTasks,
    completedTodayCount: todayProgress.done,
    totalTodayCount: todayProgress.total,
    todayProgressPercent: todayProgress.percent,
    nextTask: getNextTask(route),
    routeCompletedCount: routeProgress.done,
    routeTaskCount: routeTasks.length,
    routeProgressPercent: routeProgress.percent,
  };
}
