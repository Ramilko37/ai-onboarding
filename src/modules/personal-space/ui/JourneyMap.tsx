import { ArrowRight, ChevronRight, HelpCircle, Play } from "lucide-react";
import type {
  LearningRoute,
  LearningRouteDay,
  LearningTask,
  LearningTaskStatus,
} from "../../onboarding-agent/model/learningRouteTypes";

export function JourneyMap({
  route,
  onOpenTask,
  onUpdateTaskStatus,
}: {
  route?: LearningRoute;
  onOpenTask: (taskId: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
}) {
  const tasks = route?.days.flatMap((day) => day.tasks) ?? [];
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length > 0 ? Math.max(4, Math.round((doneCount / tasks.length) * 100)) : 0;

  return (
    <section
      className="flex w-full min-w-0 flex-col p-5 sm:p-8 lg:p-10"
      id="route-plan"
    >
      <header className="mb-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
          Персональный маршрут
        </p>
        <h1 className="mt-2 font-brand text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
          Мой план
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Весь путь — по этапам. Открывайте детали только тогда, когда они нужны.
        </p>
      </header>

      {route && (
        <div className="mb-4 rounded-[14px] bg-secondary px-5 py-4">
          <div className="mb-3 flex items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>Учебный прогресс</span>
            <strong className="text-foreground">
              {doneCount} из {tasks.length}
            </strong>
          </div>
          <div
            aria-label={`Выполнено ${progress}% маршрута`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className="h-1.5 overflow-hidden rounded-full bg-card"
            role="progressbar"
          >
            <span
              className="block h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {route ? (
        <div className="grid gap-2">
          {route.days.map((day, index) => (
            <RouteDayTasks
              day={day}
              index={index}
              key={day.id}
              onOpenTask={onOpenTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
              open={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-secondary/50 p-5">
          <p className="text-sm font-semibold text-foreground">Маршрут появится после диагностики</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Сначала система соберёт ответы и только потом покажет персональные задачи.
          </p>
        </div>
      )}
    </section>
  );
}

function RouteDayTasks({
  day,
  index,
  onOpenTask,
  onUpdateTaskStatus,
  open,
}: {
  day: LearningRouteDay;
  index: number;
  onOpenTask: (taskId: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
  open: boolean;
}) {
  const doneCount = day.tasks.filter((task) => task.status === "done").length;

  return (
    <details className="group overflow-hidden rounded-[14px] border border-border bg-card" open={open}>
      <summary className="grid min-h-[76px] cursor-pointer grid-cols-[44px_1fr_auto_24px] items-center gap-3 px-4 text-left sm:px-5">
        <span className="font-brand text-xl font-medium text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <strong className="block text-sm font-semibold text-foreground">{day.title}</strong>
          <small className="mt-0.5 line-clamp-1 block text-[10px] text-muted-foreground">
            {day.goal}
          </small>
        </span>
        <span className="text-[10px] text-muted-foreground">
          {doneCount} / {day.tasks.length}
        </span>
        <ChevronRight
          className="h-4 w-4 text-muted-foreground transition group-open:rotate-90"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-border px-4 sm:px-5">
        {day.tasks.map((task, taskIndex) => (
          <RouteTask
            isCurrent={index === 0 && taskIndex === 0 && task.status !== "done"}
            key={task.id}
            onOpenTask={onOpenTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            task={task}
          />
        ))}
      </div>
    </details>
  );
}

function RouteTask({
  task,
  isCurrent,
  onOpenTask,
  onUpdateTaskStatus,
}: {
  task: LearningTask;
  isCurrent: boolean;
  onOpenTask: (taskId: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
}) {
  return (
    <article
      className="grid min-h-[72px] grid-cols-[24px_1fr_20px] items-center gap-3 border-b border-border py-3 last:border-b-0 sm:grid-cols-[24px_1fr_auto_auto_20px]"
      id={`route-task-${task.id}`}
      tabIndex={-1}
    >
      <span
        className={
          task.status === "done"
            ? "h-2.5 w-2.5 rounded-full bg-success shadow-[0_0_0_4px_var(--card)]"
            : isCurrent || task.status === "in_progress"
              ? "h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_4px_var(--card)]"
              : "h-2.5 w-2.5 rounded-full bg-muted-foreground/35 shadow-[0_0_0_4px_var(--card)]"
        }
        aria-hidden="true"
      />
      <button
        className="min-w-0 cursor-pointer text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
        onClick={() => onOpenTask(task.id)}
        type="button"
      >
        <small className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-primary">
          {task.status === "in_progress" ? "Следующая" : getTaskTypeLabel(task.type)}
        </small>
        <strong className="mt-0.5 block text-sm leading-snug text-foreground">{task.title}</strong>
        <span className="mt-0.5 block text-[10px] text-muted-foreground">
          {task.estimatedMinutes} мин
        </span>
      </button>
      <RouteStatusPill status={task.status} />
      <div className="hidden sm:block">
        <TaskStatusAction
          onUpdateTaskStatus={onUpdateTaskStatus}
          status={task.status}
          taskId={task.id}
        />
      </div>
      <button
        aria-label={`Открыть задачу ${task.title}`}
        className="cursor-pointer text-muted-foreground transition hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
        onClick={() => onOpenTask(task.id)}
        type="button"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="col-span-3 flex justify-end gap-3 sm:hidden">
        <TaskStatusAction
          onUpdateTaskStatus={onUpdateTaskStatus}
          status={task.status}
          taskId={task.id}
        />
      </div>
    </article>
  );
}

function RouteStatusPill({ status }: { status: LearningTaskStatus }) {
  const label: Record<LearningTaskStatus, string> = {
    blocked: "Нужна помощь",
    done: "Готово",
    in_progress: "В процессе",
    todo: "Не начато",
  };

  return (
    <span className="hidden items-center gap-1.5 text-[10px] text-muted-foreground sm:inline-flex">
      {status === "blocked" && <HelpCircle className="h-3 w-3 text-primary" aria-hidden="true" />}
      {label[status]}
    </span>
  );
}

function TaskStatusAction({
  taskId,
  status,
  onUpdateTaskStatus,
}: {
  taskId: string;
  status: LearningTaskStatus;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
}) {
  if (status === "done") {
    return <span className="text-xs text-muted-foreground">Выполнено</span>;
  }

  if (status === "blocked") {
    return (
      <button
        className="min-h-8 cursor-pointer text-xs font-semibold text-primary"
        onClick={() => onUpdateTaskStatus?.(taskId, "in_progress")}
        type="button"
      >
        Вернуться
      </button>
    );
  }

  if (status === "in_progress") {
    return (
      <span className="grid gap-1 text-right">
        <button
          className="min-h-8 cursor-pointer text-xs font-semibold text-primary"
          onClick={() => onUpdateTaskStatus?.(taskId, "done")}
          type="button"
        >
          Завершить
        </button>
        <button
          className="cursor-pointer text-[11px] text-muted-foreground"
          onClick={() => onUpdateTaskStatus?.(taskId, "blocked")}
          type="button"
        >
          Есть проблема
        </button>
      </span>
    );
  }

  return (
    <span className="grid gap-1 text-right">
      <button
        className="inline-flex min-h-8 cursor-pointer items-center gap-1 text-xs font-semibold text-primary"
        onClick={() => onUpdateTaskStatus?.(taskId, "in_progress")}
        type="button"
      >
        <Play className="h-3.5 w-3.5" />
        Начать
      </button>
      <button
        className="cursor-pointer text-[11px] text-muted-foreground"
        onClick={() => onUpdateTaskStatus?.(taskId, "blocked")}
        type="button"
      >
        Есть проблема
      </button>
    </span>
  );
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
