"use client";

import { ArrowRight, BookOpen, Check, Clock, Play } from "lucide-react";
import type {
  LearningTask,
  LearningRoute,
  LearningTaskStatus,
} from "../../onboarding-agent/model/learningRouteTypes";
import { getEmployeeFocusSummary } from "../lib/getEmployeeFocusSummary";
import type { PersonalSpaceProfile } from "../PersonalSpace";

export function TodayFocus({
  profile,
  route,
  onOpenTask,
  onUpdateTaskStatus,
}: {
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
  onOpenTask: (taskId: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
}) {
  const focus = getEmployeeFocusSummary(route);
  const tasks = focus.todayTasks;
  const visibleTasks = tasks.filter((task) => task.status !== "done").slice(0, 3);
  const nextTask = visibleTasks[0];
  const doneCount = focus.completedTodayCount;
  const progressPercent =
    focus.totalTodayCount > 0
      ? Math.max(4, Math.round((doneCount / focus.totalTodayCount) * 100))
      : 100;
  const name = profile?.name.split(" ")[0] ?? "София";

  function update(id: string, status: LearningTaskStatus) {
    onUpdateTaskStatus?.(id, status);
  }

  return (
    <section className="mx-auto w-full min-w-0 rounded-[20px] border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-8 lg:p-10">
      <header className="mb-7 flex items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
            Вторник, 21 июля
          </p>
          <h1 className="mt-2 font-brand text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
            Сегодня
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Добрый день, {name}. Продолжим с того места, где остановились.
          </p>
        </div>

        <div className="w-24 shrink-0 sm:w-52">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <strong className="font-brand text-2xl font-medium leading-none text-primary sm:text-3xl">
              {doneCount}
            </strong>
            <span className="text-[10px] text-muted-foreground sm:text-xs">
              из {focus.totalTodayCount} задач
            </span>
          </div>
          <div
            aria-label={`Сегодня выполнено ${progressPercent}%`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progressPercent}
            className="h-1.5 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
          >
            <span
              className="block h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {visibleTasks.length === 0 ? (
        <div className="rounded-2xl bg-secondary p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 font-brand text-3xl leading-tight text-foreground">На сегодня всё</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            На сегодня обязательных задач не осталось. Можно открыть полный маршрут и
            посмотреть следующий контроль.
          </p>
        </div>
      ) : (
        <div>
          {nextTask && (
            <>
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                Следующий шаг
              </p>
              <TaskCard
                featured
                task={nextTask}
                onOpenTask={onOpenTask}
                onUpdate={update}
              />
            </>
          )}

          {visibleTasks.length > 1 && (
            <div className="mt-5 grid gap-2">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                Затем
              </p>
              {visibleTasks.slice(1).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onOpenTask={onOpenTask}
                  onUpdate={update}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function TaskCard({
  task,
  featured = false,
  onOpenTask,
  onUpdate,
}: {
  task: LearningTask;
  featured?: boolean;
  onOpenTask: (taskId: string) => void;
  onUpdate: (id: string, status: LearningTaskStatus) => void;
}) {
  return (
    <article
      className={
        featured
          ? "overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(132deg,var(--card)_0%,color-mix(in_oklch,var(--primary)_7%,var(--card))_100%)] p-5 shadow-[0_13px_32px_color-mix(in_oklch,var(--accent-foreground)_8%,transparent)]"
          : "overflow-hidden rounded-[14px] border border-border bg-card transition hover:border-primary/35"
      }
    >
      <button
        className={featured ? "flex w-full cursor-pointer items-start gap-4 text-left" : "flex min-h-[72px] w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"}
        onClick={() => onOpenTask(task.id)}
        type="button"
      >
        <span
          className={
            featured
              ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
              : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          }
          aria-hidden="true"
        >
          {featured ? <Play className="h-5 w-5" /> : <BookOpen className="h-4 w-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="mb-1 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
            <span>{getTaskTypeLabel(task.type)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {task.estimatedMinutes} мин
            </span>
          </span>
          <strong className={featured ? "block font-brand text-2xl font-medium leading-tight text-foreground" : "block text-sm font-semibold leading-snug text-foreground"}>
            {task.title}
          </strong>
          {featured ? (
            <span className="mt-2 block max-w-xl text-xs leading-relaxed text-muted-foreground">
              {task.description}
            </span>
          ) : (
            <StatusLabel status={task.status} />
          )}
        </span>
        {!featured && <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
      </button>

      {featured && (
        <button
          className="mt-5 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45 sm:ml-16 sm:w-[calc(100%-4rem)]"
          onClick={() => {
            if (task.status === "todo") {
              onUpdate(task.id, "in_progress");
            }
            onOpenTask(task.id);
          }}
          type="button"
        >
          {task.status === "in_progress" ? "Продолжить" : "Начать"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </article>
  );
}

function StatusLabel({ status }: { status: LearningTaskStatus }) {
  const label: Record<LearningTaskStatus, string> = {
    blocked: "Нужна помощь",
    done: "Готово",
    in_progress: "В процессе",
    todo: "Не начато",
  };

  return (
    <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <span
        className={
          status === "done"
            ? "h-1.5 w-1.5 rounded-full bg-success"
            : status === "in_progress"
              ? "h-1.5 w-1.5 rounded-full bg-primary"
              : "h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
        }
        aria-hidden="true"
      />
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
