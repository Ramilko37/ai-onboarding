import type { WorkspaceTabId } from "./workspaceNavigation";

export type WorkspaceRouteView = WorkspaceTabId | "task";

const hrefByView: Record<WorkspaceTabId, string> = {
  today: "/onboarding-agent/today",
  route: "/onboarding-agent/plan",
  mentor: "/onboarding-agent/mentor",
};

export function parseWorkspaceSegment(segment: string): WorkspaceTabId {
  if (segment === "plan") return "route";
  if (segment === "mentor") return "mentor";
  return "today";
}

export function getWorkspaceHref(view: WorkspaceRouteView, taskId?: string): string {
  if (view === "task") {
    return taskId ? `/onboarding-agent/task/${encodeURIComponent(taskId)}` : hrefByView.today;
  }

  return hrefByView[view];
}
