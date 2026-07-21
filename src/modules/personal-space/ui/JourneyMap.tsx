import { ArrowRight, ChevronRight, HelpCircle } from "lucide-react";
import type {
  LearningRoute,
  LearningRouteDay,
  LearningTask,
  LearningTaskStatus,
} from "../../onboarding-agent/model/learningRouteTypes";
import { getLearningProgressValue } from "../../onboarding-agent/model/onboardingSelectors";

export function JourneyMap({
  route,
  onOpenTask,
}: {
  route?: LearningRoute;
  onOpenTask: (taskId: string) => void;
}) {
  const tasks = route?.days.flatMap((day) => day.tasks) ?? [];
  const progress = getLearningProgressValue(route);

  return (
    <section
      className="mx-auto flex w-full max-w-[900px] min-w-0 flex-col rounded-3xl border border-border bg-card/90 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-8 lg:p-12"
      id="route-plan"
    >
      <header className="mb-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
          Персональный маршрут
        </p>
        <h1 className="mt-2 font-brand text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
          Мой план
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-sm">
          Весь путь — по этапам. Открывайте детали только тогда, когда они нужны.
        </p>
      </header>

      {route && tasks.length > 0 && (
        <div className="mb-4 rounded-2xl bg-secondary/75 px-5 py-4">
          <div className="mb-3 flex items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>Учебный прогресс</span>
            <strong className="text-foreground">
              {progress.done} из {progress.total}
            </strong>
          </div>
          <div
            aria-label={`Выполнено ${progress.percent}% маршрута`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress.percent}
            className="h-1.5 overflow-hidden rounded-full bg-card"
            role="progressbar"
          >
            <span
              className="block h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {route && tasks.length > 0 ? (
        <div className="grid gap-2">
          {route.days.map((day, index) => (
            <RouteDayTasks
              day={day}
              index={index}
              key={day.id}
              onOpenTask={onOpenTask}
              open={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-secondary/50 p-5">
          <p className="text-sm font-semibold text-foreground">
            {route ? "План пока пуст" : "Маршрут появится после диагностики"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {route
              ? "План пока пуст. Обновите страницу или обратитесь к наставнику."
              : "Сначала система соберёт ответы и только потом покажет персональные задачи."}
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
  open,
}: {
  day: LearningRouteDay;
  index: number;
  onOpenTask: (taskId: string) => void;
  open: boolean;
}) {
  const doneCount = day.tasks.filter((task) => task.status === "done").length;

  return (
    <details className="group overflow-hidden rounded-2xl border border-border bg-card" open={open}>
      <summary className="grid min-h-[76px] cursor-pointer grid-cols-[44px_1fr_auto_24px] items-center gap-3 px-4 text-left sm:px-5">
        <span className="font-brand text-xl font-medium text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <strong className="block text-sm font-semibold text-foreground">{day.title}</strong>
          <small className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground sm:text-[10px]">
            {day.goal}
          </small>
        </span>
        <span className="text-xs text-muted-foreground sm:text-[10px]">
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
}: {
  task: LearningTask;
  isCurrent: boolean;
  onOpenTask: (taskId: string) => void;
}) {
  return (
    <button
      aria-label={`Открыть задачу ${task.title}`}
      className="grid min-h-[72px] w-full cursor-pointer grid-cols-[24px_1fr_auto_20px] items-center gap-3 border-b border-border py-3 text-left transition last:border-b-0 hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-[-2px] focus-visible:outline-ring/45"
      id={`route-task-${task.id}`}
      onClick={() => onOpenTask(task.id)}
      type="button"
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
      <span className="min-w-0">
        <small className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-primary">
          {isCurrent ? "Следующая" : task.status === "in_progress" ? "В процессе" : getTaskTypeLabel(task.type)}
        </small>
        <strong className="mt-0.5 block text-sm leading-snug text-foreground">{task.title}</strong>
        <span className="mt-0.5 block text-xs text-muted-foreground sm:text-[10px]">
          {getTaskTypeLabel(task.type)} · {task.estimatedMinutes} мин
        </span>
      </span>
      <RouteStatusPill status={task.status} />
      <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
    </button>
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
    <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex sm:text-[10px]">
      {status === "blocked" && <HelpCircle className="h-3 w-3 text-primary" aria-hidden="true" />}
      {label[status]}
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
