import type { LearningTaskStatus } from "../../onboarding-agent/model/learningRouteTypes";

export type WorkspaceTabId = "today" | "route" | "mentor";
export type WorkspaceViewId = WorkspaceTabId | "task";

export const onboardingWorkspaceBasePath = "/onboarding-agent";

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

export function getWorkspaceHref(tabId: WorkspaceTabId): string {
  const pathByTab: Record<WorkspaceTabId, string> = {
    mentor: "mentor",
    route: "plan",
    today: "today",
  };

  return `${onboardingWorkspaceBasePath}/${pathByTab[tabId]}`;
}

export function getWorkspaceViewFromPathname(pathname: string): WorkspaceViewId {
  if (pathname.startsWith(`${onboardingWorkspaceBasePath}/tasks/`)) {
    return "task";
  }

  if (pathname === `${onboardingWorkspaceBasePath}/plan`) {
    return "route";
  }

  if (pathname === `${onboardingWorkspaceBasePath}/mentor`) {
    return "mentor";
  }

  return "today";
}

export function getTaskIdFromPathname(pathname: string): string | undefined {
  const prefix = `${onboardingWorkspaceBasePath}/tasks/`;

  if (!pathname.startsWith(prefix)) {
    return undefined;
  }

  const rawTaskId = pathname.slice(prefix.length).split("/")[0];
  return rawTaskId ? decodeURIComponent(rawTaskId) : undefined;
}

export function getTaskHref(taskId: string, from?: WorkspaceTabId): string {
  const href = `${onboardingWorkspaceBasePath}/tasks/${encodeURIComponent(taskId)}`;

  return from ? `${href}?from=${from}` : href;
}

export function getWorkspaceTabFromParam(value: string | null | undefined): WorkspaceTabId {
  return value === "route" || value === "mentor" || value === "today" ? value : "today";
}

export function getTodayTaskToggleStatus(
  status: LearningTaskStatus,
): LearningTaskStatus {
  return status === "done" ? "todo" : "done";
}
