"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Map,
  Send,
  Sparkles,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { cn, MayakWorkspaceSurface } from "@/shared/ui/mayak";
import type {
  LearningTask,
  LearningRoute,
  LearningTaskStatus,
} from "../../onboarding-agent/model/learningRouteTypes";
import { getEmployeeFocusSummary } from "../lib/getEmployeeFocusSummary";
import {
  getNextWorkspaceTab,
  workspaceTabs,
  type WorkspaceTabId,
} from "../lib/workspaceNavigation";
import { getWorkspaceHref, type WorkspaceRouteView } from "../lib/workspaceRoute";
import { shouldFocusTaskDetail } from "../lib/shouldFocusTaskDetail";
import { shouldUseTaskSharedTransition } from "../lib/shouldUseTaskSharedTransition";
import type { PersonalSpaceProfile } from "../PersonalSpace";
import { Assistant } from "./Assistant";
import { JourneyMap } from "./JourneyMap";
import { TodayFocus } from "./TodayFocus";
import { usePrefersReducedMotion } from "@/shared/lib/usePrefersReducedMotion";

const tabIcons = {
  today: Sun,
  route: Map,
  mentor: Compass,
} satisfies Record<WorkspaceTabId, typeof Sun>;

type WorkspaceViewId = WorkspaceTabId | "task";

export function PersonalSpaceWorkspace({
  profile,
  route,
  onUpdateTaskStatus,
  onCreateEscalation,
  initialView = "today",
  initialTaskId,
}: {
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
  onCreateEscalation?: (question: string) => void;
  initialView?: WorkspaceRouteView;
  initialTaskId?: string;
}) {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState<WorkspaceViewId>(initialView);
  const [previousTab, setPreviousTab] = useState<WorkspaceTabId>(
    initialView === "task" ? "route" : initialView,
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(initialTaskId);
  const [transitionTaskId, setTransitionTaskId] = useState<string | undefined>();
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const tabRefs = useRef<Partial<Record<WorkspaceTabId, HTMLButtonElement | null>>>({});
  const reasonTriggerRef = useRef<HTMLButtonElement>(null);
  const wasReasonOpenRef = useRef(false);
  const scrollPositionRef = useRef(0);
  const focus = getEmployeeFocusSummary(route);
  const selectedTask = getSelectedTask(route, selectedTaskId) ?? focus.nextTask ?? focus.todayTasks[0];

  useEffect(() => {
    if (!isReasonOpen) {
      return;
    }

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsReasonOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isReasonOpen]);

  useEffect(() => {
    if (!isReasonOpen && wasReasonOpenRef.current) {
      reasonTriggerRef.current?.focus();
    }
    wasReasonOpenRef.current = isReasonOpen;
  }, [isReasonOpen]);

  useEffect(() => {
    if (!initialView) return;

    setActiveTab(initialView);
    setSelectedTaskId(initialView === "task" ? initialTaskId : undefined);
    if (initialView !== "task") {
      setPreviousTab(initialView);
    }
  }, [initialTaskId, initialView]);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (activeTab === "task") {
      return;
    }

    const nextTab = getNextWorkspaceTab(activeTab, event.key);

    if (!nextTab) {
      return;
    }

    event.preventDefault();
    handleOpenTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  }

  function panelClass(tabId: WorkspaceTabId, desktopDisplay = "lg:block") {
    return activeTab === tabId ? cn("contents", desktopDisplay) : "hidden";
  }

  function handleOpenTask(taskId: string) {
    if (activeTab !== "task") {
      setPreviousTab(activeTab);
    }
    scrollPositionRef.current = window.scrollY;
    router.push(getWorkspaceHref("task", taskId));
    requestAnimationFrame(() => {
      const isDesktopViewport = window.matchMedia("(min-width: 1024px)").matches;
      const canUseSharedTransition = shouldUseTaskSharedTransition(isDesktopViewport, prefersReducedMotion);
      const startViewTransition = (
        document as Document & {
          startViewTransition?: (update: () => void) => { finished: Promise<void> };
        }
      ).startViewTransition;
      const showTask = () => {
        setSelectedTaskId(taskId);
        setActiveTab("task");
      };

      if (startViewTransition && canUseSharedTransition) {
        setTransitionTaskId(taskId);
        void startViewTransition.call(document, showTask).finished.finally(() => setTransitionTaskId(undefined));
      } else {
        showTask();
        setTransitionTaskId(undefined);
      }
      requestAnimationFrame(() => {
        if (shouldFocusTaskDetail(isDesktopViewport)) {
          document.getElementById("task-detail")?.focus();
        }
      });
    });
  }

  function handleOpenTab(tabId: WorkspaceTabId) {
    setActiveTab(tabId);
    setSelectedTaskId(undefined);
    setIsReasonOpen(false);
    router.push(getWorkspaceHref(tabId));
  }

  return (
    <section className="relative min-w-0" aria-label="Пространство развития сотрудника">
      <div
        aria-label="Разделы личного кабинета"
        data-motion
        className={cn(
          "relative mb-4 hidden w-full items-stretch gap-1 rounded-[16px] border border-border bg-secondary p-1 lg:flex",
          activeTab === "task" && "lg:hidden",
        )}
        role="tablist"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1 bottom-1 rounded-[12px] bg-card shadow-[var(--shadow-card)] transition-transform duration-[var(--motion-control)] ease-[var(--motion-ease-premium)]"
          style={{
            left: "0.25rem",
            width: "calc((100% - 0.5rem) / 3)",
            transform: `translateX(${workspaceTabs.findIndex((tab) => tab.id === activeTab) * 100}%)`,
          }}
        />
        {workspaceTabs.map((tab) => {
          const Icon = tabIcons[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              aria-controls={`${tab.id}-panel`}
              aria-current={isActive ? "page" : undefined}
              aria-selected={isActive}
              className={cn(
                "relative z-10 inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] px-4 text-sm font-medium text-muted-foreground transition-[color] duration-[var(--motion-control)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45",
                isActive
                  ? "text-foreground"
                  : "hover:text-foreground",
              )}
              id={`${tab.id}-tab`}
              key={tab.id}
              onClick={() => handleOpenTab(tab.id)}
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

      <div className="grid min-w-0 gap-3" data-motion>
        {activeTab === "task" && selectedTask && (
          <section aria-label="Задача маршрута" className="contents" key={`task-${selectedTask.id}`}>
            <MayakWorkspaceSurface className="motion-surface-enter">
              <TaskDetail
                task={selectedTask}
                transitionTaskId={transitionTaskId}
                onBack={() => {
                  router.push(getWorkspaceHref(previousTab));
                  const returnToList = () => setActiveTab(previousTab);
                  const startViewTransition = (
                    document as Document & {
                      startViewTransition?: (update: () => void) => { finished: Promise<void> };
                    }
                  ).startViewTransition;
                  const canUseSharedTransition = shouldUseTaskSharedTransition(
                    window.matchMedia("(min-width: 1024px)").matches,
                    prefersReducedMotion,
                  );
                  if (startViewTransition && transitionTaskId && canUseSharedTransition) {
                    void startViewTransition.call(document, returnToList).finished.finally(() => setTransitionTaskId(undefined));
                  } else {
                    returnToList();
                    setTransitionTaskId(undefined);
                  }
                  requestAnimationFrame(() => {
                    window.scrollTo({ top: scrollPositionRef.current, behavior: "auto" });
                    document.getElementById(`route-task-${selectedTask.id}`)?.focus();
                  });
                }}
                onOpenMentor={() => handleOpenTab("mentor")}
                onUpdateTaskStatus={onUpdateTaskStatus}
              />
            </MayakWorkspaceSurface>
          </section>
        )}

        <section
          aria-labelledby="route-tab"
          className={cn(panelClass("route"), activeTab === "route" && "motion-route-enter")}
          id="route-panel"
          role="tabpanel"
        >
          <MayakWorkspaceSurface className="order-1 min-w-0 lg:order-none">
            <JourneyMap
              route={route}
              transitionTaskId={transitionTaskId}
              onOpenTask={handleOpenTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          </MayakWorkspaceSurface>
        </section>

        <section
          aria-labelledby="mentor-tab"
          className={cn(panelClass(
            "mentor",
            "lg:block",
          ), activeTab === "mentor" && "motion-route-enter")}
          id="mentor-panel"
          role="tabpanel"
        >
          <MayakWorkspaceSurface className="order-3 min-w-0 lg:order-none">
            <Assistant profile={profile} route={route} onCreateEscalation={onCreateEscalation} />
          </MayakWorkspaceSurface>
        </section>

        <section
          aria-labelledby="today-tab"
          className={cn(panelClass(
            "today",
            "lg:block",
          ), activeTab === "today" && "motion-route-enter")}
          id="today-panel"
          role="tabpanel"
        >
          <MayakWorkspaceSurface
            className="order-4 min-w-0 lg:order-none lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)] lg:items-start lg:gap-6"
            id="today-focus"
          >
            <TodayFocus
              profile={profile}
              route={route}
              transitionTaskId={transitionTaskId}
              onOpenTask={handleOpenTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          <aside className="hidden grid-cols-1 gap-3 py-5 pr-5 sm:py-8 sm:pr-8 lg:grid lg:py-10 lg:pr-10">
            <article className="rounded-[20px] bg-deep-surface p-6 text-deep-foreground shadow-[var(--shadow-card)]">
              <span className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-secondary">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary">
                AI-наставник
              </p>
              <h2 className="mt-2 font-brand text-2xl leading-tight tracking-tight">
                Вопрос по работе?
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-deep-muted">
                Подскажу по стандартам, покажу источник и помогу без лишнего стресса.
              </p>
              <button
                className="mt-5 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
                onClick={() => handleOpenTab("mentor")}
                type="button"
              >
                Спросить наставника
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </article>

            <button
              className="flex min-h-13 w-full cursor-pointer items-center gap-2 rounded-xl px-3 text-left text-sm font-medium text-primary transition-[background-color] duration-[var(--motion-fast)] hover:bg-primary/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
              onClick={() => setIsReasonOpen(true)}
              ref={reasonTriggerRef}
              type="button"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Почему такой план?
              <ArrowRight className="ml-auto h-4 w-4" aria-hidden="true" />
            </button>
          </aside>
          </MayakWorkspaceSurface>
        </section>
      </div>

      {activeTab !== "task" && (
        <nav
          aria-label="Основные разделы"
          className="fixed inset-x-0 bottom-0 z-30 grid h-[68px] grid-cols-3 border-t border-border bg-card/95 px-4 pb-[env(safe-area-inset-bottom)] shadow-[0_-14px_30px_color-mix(in_oklch,var(--foreground)_8%,transparent)] backdrop-blur-xl lg:hidden"
        >
          {workspaceTabs.map((tab) => {
            const Icon = tabIcons[tab.id];
            const isActive = activeTab === tab.id;

            return (
              <button
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 text-xs font-medium transition-[color,background-color] duration-[var(--motion-control)] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-ring/45",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                key={tab.id}
                onClick={() => handleOpenTab(tab.id)}
                type="button"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      )}

      {isReasonOpen && (
        <div
          className="motion-dialog-overlay fixed inset-0 z-40 flex items-end justify-center bg-deep/35 p-0 lg:items-center lg:p-6"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsReasonOpen(false);
            }
          }}
        >
          <section
            aria-modal="true"
            aria-labelledby="route-reason-title"
            className="motion-sheet-enter motion-responsive-dialog max-h-[calc(100dvh-1rem)] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-[0_-24px_70px_color-mix(in_oklch,var(--accent-foreground)_18%,transparent)] sm:rounded-3xl lg:max-h-[calc(100dvh-3rem)]"
            role="dialog"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
              Персонализация
            </p>
            <h2 id="route-reason-title" className="mt-2 font-brand text-3xl leading-tight tracking-tight text-foreground">
              Почему такой план?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Диагностика изменила порядок тем: в начало попали задачи, которые быстрее
              помогут выйти на спокойную смену. Это не оценка и не экзамен.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <ReasonCard title="Уже знакомо" items={getFamiliarTopics(route)} tone="calm" />
              <ReasonCard title="Сфокусируемся" items={getFocusTopics(route)} tone="focus" />
            </div>
            <div className="mt-5 flex gap-2">
              <button
                className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-xl bg-secondary px-4 text-sm font-semibold text-secondary-foreground"
                onClick={() => setIsReasonOpen(false)}
                type="button"
              >
                Понятно
              </button>
              <button
                className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
                onClick={() => {
                  setIsReasonOpen(false);
                  handleOpenTab("route");
                }}
                type="button"
              >
                Мой план
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function TaskDetail({
  task,
  transitionTaskId,
  onBack,
  onOpenMentor,
  onUpdateTaskStatus,
}: {
  task: LearningTask;
  transitionTaskId?: string;
  onBack: () => void;
  onOpenMentor: () => void;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
}) {
  const isStarted = task.status !== "todo";
  const isDone = task.status === "done";

  return (
    <article
      className="mx-auto w-full max-w-[760px] p-5 sm:p-8 lg:p-10"
      data-motion
      data-task-transition={transitionTaskId === task.id || undefined}
      style={transitionTaskId === task.id ? ({ "--task-transition-name": `task-${task.id}` } as CSSProperties) : undefined}
      id="task-detail"
      tabIndex={-1}
    >
      <button
        className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        К задачам
      </button>

      <div className="py-5 sm:py-7">
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
          {getTaskTypeLabel(task.type)} · {task.estimatedMinutes} минут
        </p>
        <h1 className="mt-2 max-w-2xl font-brand text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {task.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {task.description}
        </p>
      </div>

      <section className="rounded-2xl bg-secondary/70 p-5 sm:p-7">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
          Коротко о главном
        </p>
        <h2 className="mt-2 font-brand text-2xl leading-tight tracking-tight text-foreground">
          Три ориентира для уверенного результата
        </h2>
        <ol className="mt-5 grid gap-4">
          {getTaskOrientations(task).map((item, index) => (
            <li className="grid grid-cols-[32px_1fr] gap-3" key={item.title}>
              <span className="font-mono text-xs font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <strong className="text-sm text-foreground">{item.title}</strong>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-primary">
        <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            Источник
          </p>
          <p className="truncate text-xs font-semibold text-primary">
            {task.source ?? "База знаний Valle Sanchez"}
          </p>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-5 mt-5 flex gap-2 bg-card/95 px-5 pt-3 pb-1 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:p-0">
        <button
        className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-[opacity,background-color,transform] duration-[var(--motion-local)] hover:opacity-90 active:scale-[0.985] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
          onClick={() => onUpdateTaskStatus?.(task.id, isStarted ? "done" : "in_progress")}
          type="button"
        >
          {isDone ? "Задача выполнена" : isStarted ? "Завершить задачу" : "Начать задачу"}
          {isStarted ? <Check className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </button>
        <button
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
          onClick={() => {
            onUpdateTaskStatus?.(task.id, "blocked");
            onOpenMentor();
          }}
          type="button"
        >
          Есть проблема
        </button>
      </div>
    </article>
  );
}

function ReasonCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "calm" | "focus";
}) {
  return (
    <div className={cn("rounded-2xl p-4", tone === "focus" ? "bg-primary/10" : "bg-secondary")}>
      <p className="text-xs font-semibold text-foreground">{title}</p>
      <ul className="mt-3 grid gap-2 text-xs text-muted-foreground">
        {items.map((item) => (
          <li className="flex items-center gap-2" key={item}>
            {tone === "focus" ? (
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            ) : (
              <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function getSelectedTask(route: LearningRoute | undefined, taskId: string | undefined) {
  if (!route || !taskId) {
    return undefined;
  }

  return route.days.flatMap((day) => day.tasks).find((task) => task.id === taskId);
}

function getFamiliarTopics(route?: LearningRoute) {
  if (!route) {
    return ["Рабочая станция", "Состав напитков", "Безопасность"];
  }

  const familiar = route.days
    .flatMap((day) => day.tasks)
    .filter((task) => task.status === "done")
    .map((task) => task.title.replace(/^Полный модуль:\s*/i, ""))
    .slice(0, 3);

  return familiar.length > 0
    ? familiar
    : ["Профиль бариста", "Опыт в HORECA", "Знакомые темы — короче"];
}

function getFocusTopics(route?: LearningRoute) {
  const tasks = route?.days.flatMap((day) => day.tasks).filter((task) => task.status !== "done");

  if (!tasks || tasks.length === 0) {
    return ["Следующий контроль", "Закрепление навыка", "Самостоятельная смена"];
  }

  return tasks.map((task) => task.title.replace(/^Полный модуль:\s*/i, "")).slice(0, 3);
}

function getTaskTypeLabel(type: LearningTask["type"]) {
  const labels: Record<LearningTask["type"], string> = {
    check: "Чек-лист",
    intro: "Вводный шаг",
    practice: "Практика",
    quiz: "Проверка",
    read: "Материал",
    summary: "Итог",
  };

  return labels[type];
}

function getTaskOrientations(task: LearningTask) {
  if (task.topicId?.includes("milk") || task.title.toLowerCase().includes("молок")) {
    return [
      {
        title: "Начните с холодной базы",
        text: "Холодное молоко и сухой питчер дают больше времени на спокойную текстуру.",
      },
      {
        title: "Слушайте звук",
        text: "Ровное тихое шипение обычно означает, что паровик стоит в правильной позиции.",
      },
      {
        title: "Проверяйте поверхность",
        text: "Глянец и однородность важнее большой шапки пены.",
      },
    ];
  }

  if (task.topicId?.includes("espresso") || task.title.toLowerCase().includes("эспресс")) {
    return [
      {
        title: "Сверьте рецепт",
        text: "Перед корректировкой проверьте дозу, выход напитка и время экстракции.",
      },
      {
        title: "Меняйте один параметр",
        text: "Так проще понять, что именно повлияло на вкус и скорость пролива.",
      },
      {
        title: "Позовите наставника при сомнении",
        text: "Спорный шот лучше разобрать до выдачи гостю.",
      },
    ];
  }

  return [
    {
      title: "Сначала цель",
      text: task.reason,
    },
    {
      title: "Затем короткое действие",
      text: "Пройдите шаг по стандарту и отметьте статус, чтобы руководитель видел прогресс.",
    },
    {
      title: "Если не получается — зовите помощь",
      text: "Кнопка «Есть проблема» передаст сигнал наставнику и сохранит контекст задачи.",
    },
  ];
}
