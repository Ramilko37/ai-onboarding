"use client";

import { BookOpen, Compass, Map, Sun } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/shared/ui/mayak";
import type {
  LearningRoute,
  LearningTaskStatus,
} from "../../onboarding-agent/model/learningRouteTypes";
import { getEmployeeFocusSummary } from "../lib/getEmployeeFocusSummary";
import {
  getNextWorkspaceTab,
  workspaceTabs,
  type WorkspaceTabId,
} from "../lib/workspaceNavigation";
import type { PersonalSpaceProfile } from "../PersonalSpace";
import { Assistant } from "./Assistant";
import { JourneyMap } from "./JourneyMap";
import { KnowledgeConstellation } from "./KnowledgeConstellation";
import { SupportPanel } from "./SupportPanel";
import { TodayFocus } from "./TodayFocus";

const tabIcons = {
  today: Sun,
  route: Map,
  mentor: Compass,
  knowledge: BookOpen,
} satisfies Record<WorkspaceTabId, typeof Sun>;

export function PersonalSpaceWorkspace({
  profile,
  route,
  onUpdateTaskStatus,
}: {
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
}) {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("today");
  const tabRefs = useRef<Partial<Record<WorkspaceTabId, HTMLButtonElement | null>>>({});
  const focus = getEmployeeFocusSummary(route);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const nextTab = getNextWorkspaceTab(activeTab, event.key);

    if (!nextTab) {
      return;
    }

    event.preventDefault();
    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  }

  function panelClass(tabId: WorkspaceTabId, desktopDisplay = "lg:block") {
    return cn("contents", activeTab === tabId ? desktopDisplay : "lg:hidden");
  }

  function handleOpenTask(taskId: string) {
    setActiveTab("route");
    requestAnimationFrame(() => document.getElementById(`route-task-${taskId}`)?.focus());
  }

  return (
    <section className="min-w-0" aria-label="Пространство развития сотрудника">
      <div
        aria-label="Разделы личного кабинета"
        className="mb-3 hidden grid-cols-4 gap-1 rounded-2xl border border-border bg-card/70 p-1.5 backdrop-blur-sm lg:grid"
        role="tablist"
      >
        {workspaceTabs.map((tab) => {
          const Icon = tabIcons[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              aria-controls={`${tab.id}-panel`}
              aria-selected={isActive}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              id={`${tab.id}-tab`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={handleTabKeyDown}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 gap-3">
        <section
          aria-labelledby="route-tab"
          className={panelClass("route")}
          id="route-panel"
          role="tabpanel"
        >
          <div className="order-1 min-w-0 lg:order-none">
            <JourneyMap route={route} onUpdateTaskStatus={onUpdateTaskStatus} />
          </div>
        </section>

        <section
          aria-labelledby="knowledge-tab"
          className={panelClass("knowledge")}
          id="knowledge-panel"
          role="tabpanel"
        >
          <div className="order-2 min-w-0 lg:order-none">
            <KnowledgeConstellation
              onOpenTask={handleOpenTask}
              roleLabel={profile?.roleLabel}
              route={route}
            />
          </div>
        </section>

        <section
          aria-labelledby="mentor-tab"
          className={panelClass(
            "mentor",
            "lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start lg:gap-3",
          )}
          id="mentor-panel"
          role="tabpanel"
        >
          <div className="order-3 min-w-0 lg:order-none">
            <Assistant profile={profile} route={route} />
          </div>
          <div className="order-5 min-w-0 lg:order-none">
            <SupportPanel />
          </div>
        </section>

        <section
          aria-labelledby="today-tab"
          className={panelClass(
            "today",
            "lg:grid lg:max-w-5xl lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-3",
          )}
          id="today-panel"
          role="tabpanel"
        >
          <div className="order-4 min-w-0 lg:order-none" id="today-focus">
            <TodayFocus route={route} onUpdateTaskStatus={onUpdateTaskStatus} />
          </div>

          <aside className="hidden rounded-3xl border border-border bg-card/80 p-5 backdrop-blur-sm lg:flex lg:flex-col">
            <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-primary">
              Ваш темп
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              {focus.routeProgressPercent}%
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {focus.routeCompletedCount} из {focus.routeTaskCount} задач маршрута выполнено
            </p>
            <div
              aria-label={`Выполнено ${focus.routeProgressPercent}% маршрута`}
              className="mt-4 h-2 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={focus.routeProgressPercent}
            >
              <span
                className="block h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${focus.routeProgressPercent}%` }}
              />
            </div>
            <p className="mt-5 text-xs font-medium text-foreground">
              {focus.nextTask ? "Следующий шаг" : "На сегодня всё"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {focus.nextTask?.title ?? "Следующий контроль уже отмечен в полном маршруте."}
            </p>
            <button
              className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
              onClick={() => {
                setActiveTab("route");
                tabRefs.current.route?.focus();
              }}
              type="button"
            >
              Открыть весь маршрут
            </button>
          </aside>
        </section>
      </div>
    </section>
  );
}
