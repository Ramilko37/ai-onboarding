import type { LearningTaskStatus } from "../../onboarding-agent/model/learningRouteTypes";

export type WorkspaceTabId = "today" | "route" | "mentor";

export const workspaceTabs: Array<{ id: WorkspaceTabId; label: string }> = [
  { id: "today", label: "Сегодня" },
  { id: "route", label: "Мой план" },
  { id: "mentor", label: "Наставник" },
];

export function getNextWorkspaceTab(
  currentTab: WorkspaceTabId,
  key: string,
): WorkspaceTabId | undefined {
  if (key === "Home") {
    return workspaceTabs[0]?.id;
  }

  if (key === "End") {
    return workspaceTabs[workspaceTabs.length - 1]?.id;
  }

  if (key !== "ArrowLeft" && key !== "ArrowRight") {
    return undefined;
  }

  const currentIndex = workspaceTabs.findIndex((tab) => tab.id === currentTab);
  const direction = key === "ArrowRight" ? 1 : -1;
  const nextIndex = (currentIndex + direction + workspaceTabs.length) % workspaceTabs.length;

  return workspaceTabs[nextIndex]?.id;
}

export function getTodayTaskToggleStatus(
  status: LearningTaskStatus,
): LearningTaskStatus {
  return status === "done" ? "todo" : "done";
}
