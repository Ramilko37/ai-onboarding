import { Check, HelpCircle, MapPin, Play } from "lucide-react";
import type {
  LearningRoute,
  LearningRouteDay,
  LearningTaskStatus
} from "../../onboarding-agent/model/learningRouteTypes";
import { journeyStages, type JourneyStage } from "../data";

function StageNode({ status }: { status: JourneyStage["status"] }) {
  if (status === "done") {
    return (
      <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="animate-pulse-ring relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-card">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
      </span>
    );
  }

  return (
    <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
    </span>
  );
}

export function JourneyMap({
  route,
  onUpdateTaskStatus,
}: {
  route?: LearningRoute;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
}) {
  const stages = route ? getRouteStages(route) : journeyStages;

  return (
    <section
      className="flex w-full min-w-0 flex-col rounded-3xl border border-border bg-card/80 p-4 backdrop-blur-sm"
      id="route-plan"
    >
      <div className="mb-3 flex shrink-0 items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Карта пути</h2>
          <p className="text-xs text-muted-foreground">Где вы сейчас и что ждёт впереди</p>
        </div>
      </div>

      <ol>
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1;
          return (
            <li key={stage.id} className="relative flex gap-3 pb-3 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute top-7 left-[13px] h-[calc(100%-0.5rem)] w-px ${
                    stage.status === "done" ? "bg-primary/40" : "bg-border"
                  }`}
                  aria-hidden="true"
                />
              )}
              <StageNode status={stage.status} />
              <div
                className={`min-w-0 flex-1 rounded-2xl border p-3 transition ${
                  stage.status === "active"
                    ? "border-primary/40 bg-primary/5"
                    : "border-transparent"
                }`}
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {stage.day}
                  </p>
                  {stage.status === "active" && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                      сейчас
                    </span>
                  )}
                  {stage.status === "done" && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                      готово
                    </span>
                  )}
                </div>
                <h3
                  className={`mt-1 text-sm font-semibold ${
                    stage.status === "upcoming" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {stage.title}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {stage.caption}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {route && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Задачи маршрута
              </h3>
              <p className="text-xs text-muted-foreground">
                Статусы видны руководителю в дашборде
              </p>
            </div>
            <RouteStatusPill route={route} />
          </div>
          <div className="grid gap-3">
            {route.days.map((day, index) => (
              <RouteDayTasks
                day={day}
                key={day.id}
                onUpdateTaskStatus={onUpdateTaskStatus}
                open={index === 0}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function getRouteStages(route: LearningRoute): JourneyStage[] {
  return [
    {
      id: "diagnostic",
      title: "Диагностика знаний",
      caption: route.summary,
      status: "done",
      day: "Сегодня",
    },
    ...route.days.map<JourneyStage>((day, index) => ({
      id: day.id,
      title: day.title,
      caption: day.goal,
      status: index === 0 ? "active" : "upcoming",
      day: day.title,
    })),
  ];
}

function RouteDayTasks({
  day,
  onUpdateTaskStatus,
  open,
}: {
  day: LearningRouteDay;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
  open: boolean;
}) {
  return (
    <details className="rounded-2xl border border-border bg-secondary/30 p-3" open={open}>
      <summary className="cursor-pointer text-xs font-semibold text-foreground">{day.title}</summary>
      <div className="mt-2 grid gap-2">
        {day.tasks.map((task) => (
          <article
            className="grid gap-2 rounded-xl border border-border bg-card px-3 py-2 sm:grid-cols-[1fr_auto] sm:items-center"
            id={`route-task-${task.id}`}
            key={task.id}
            tabIndex={-1}
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-snug text-foreground">
                {task.title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                {task.reason}
              </p>
            </div>
            <TaskStatusAction taskId={task.id} status={task.status} onUpdateTaskStatus={onUpdateTaskStatus} />
          </article>
        ))}
      </div>
    </details>
  );
}

function TaskStatusAction({ taskId, status, onUpdateTaskStatus }: { taskId: string; status: LearningTaskStatus; onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void }) {
  if (status === "done") return <span className="text-xs text-muted-foreground">Выполнено</span>;
  if (status === "blocked") return <button className="min-h-11 text-xs font-semibold text-primary" onClick={() => onUpdateTaskStatus?.(taskId, "in_progress")} type="button">Попросить помощь</button>;
  if (status === "in_progress") return <span className="grid gap-1 text-right"><button className="min-h-7 text-xs font-semibold text-primary" onClick={() => onUpdateTaskStatus?.(taskId, "done")} type="button">Завершить</button><button className="text-[11px] text-muted-foreground" onClick={() => onUpdateTaskStatus?.(taskId, "blocked")} type="button">Есть проблема</button></span>;
  return <span className="grid gap-1 text-right"><button className="inline-flex min-h-7 items-center gap-1 text-xs font-semibold text-primary" onClick={() => onUpdateTaskStatus?.(taskId, "in_progress")} type="button"><Play className="h-3.5 w-3.5" />Начать</button><button className="text-[11px] text-muted-foreground" onClick={() => onUpdateTaskStatus?.(taskId, "blocked")} type="button">Есть проблема</button></span>;
}

function RouteStatusPill({ route }: { route: LearningRoute }) {
  const tasks = route.days.flatMap((day) => day.tasks);
  const needsMentor = tasks.filter((task) => task.status === "blocked").length;
  const done = tasks.filter((task) => task.status === "done").length;
  const inProgress = tasks.filter((task) => task.status === "in_progress").length;
  const total = tasks.length;
  const label =
    needsMentor > 0
      ? "есть блокеры"
      : total > 0 && done === total
        ? "завершён"
        : done > 0 || inProgress > 0
          ? "в работе"
          : "не начат";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
      {needsMentor > 0 && <HelpCircle className="h-3 w-3 text-primary" aria-hidden="true" />}
      {label}
    </span>
  );
}
