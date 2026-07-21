"use client";

import { AlertCircle, Check, Clock, Play, Sparkles, Sun } from "lucide-react";
import type {
  LearningRoute,
  LearningTaskStatus,
} from "../../onboarding-agent/model/learningRouteTypes";
import { getEmployeeFocusSummary } from "../lib/getEmployeeFocusSummary";

export function TodayFocus({
  route,
  onUpdateTaskStatus,
}: {
  route?: LearningRoute;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
}) {
  const focus = getEmployeeFocusSummary(route);
  const tasks = focus.todayTasks;
  const doneCount = tasks.filter((task) => task.status === "done").length;

  function update(id: string, status: LearningTaskStatus) {
    onUpdateTaskStatus?.(id, status);
  }

  return (
    <section className="w-full min-w-0 rounded-3xl border border-border bg-card/80 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Sun className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Фокус на сегодня</h2>
            <p className="text-xs text-muted-foreground">Маленькие шаги</p>
          </div>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {doneCount}/{tasks.length}
        </span>
      </div>

      <p className="mb-2 flex items-center gap-1.5 rounded-xl bg-primary/8 px-2.5 py-1.5 text-[11px] font-medium text-primary">
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        Эти задачи собраны по итогам диагностики
      </p>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-border bg-secondary/40 p-4">
          <p className="text-sm font-medium text-foreground">На сегодня всё готово</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            На сегодня обязательных задач не осталось. Можно открыть полный маршрут и
            посмотреть следующий контроль.
          </p>
        </div>
      ) : (
        <ul className="grid min-w-0 gap-2">
            {tasks.map((task) => (
              <li key={task.id} className="min-w-0">
              <article className={`flex w-full min-w-0 items-start gap-2.5 rounded-2xl border p-3 text-left transition ${
                  task.status === "done"
                    ? "border-border bg-secondary/50"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}>
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    task.status === "done"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card"
                  }`}
                  aria-hidden="true"
                >
                  {task.status === "done" && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-medium leading-snug ${
                      task.status === "done"
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-xs leading-relaxed text-muted-foreground">
                    {task.description}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {task.estimatedMinutes} мин
                </span>
                <TaskAction task={task} onUpdate={update} />
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function TaskAction({ task, onUpdate }: { task: LearningRoute["days"][number]["tasks"][number]; onUpdate: (id: string, status: LearningTaskStatus) => void }) {
  if (task.status === "blocked") {
    return <button className="shrink-0 text-xs font-semibold text-primary" onClick={() => onUpdate(task.id, "in_progress")} type="button"><AlertCircle className="mr-1 inline h-3.5 w-3.5" />Попросить помощь</button>;
  }
  if (task.status === "done") return <span className="shrink-0 text-xs font-medium text-muted-foreground">Выполнено</span>;
  if (task.status === "in_progress") return <span className="grid shrink-0 gap-1 text-right"><button className="text-xs font-semibold text-primary" onClick={() => onUpdate(task.id, "done")} type="button">Завершить</button><button className="text-[11px] text-muted-foreground" onClick={() => onUpdate(task.id, "blocked")} type="button">Есть проблема</button></span>;
  return <span className="grid shrink-0 gap-1 text-right"><button className="text-xs font-semibold text-primary" onClick={() => onUpdate(task.id, "in_progress")} type="button"><Play className="mr-1 inline h-3.5 w-3.5" />Начать</button><button className="text-[11px] text-muted-foreground" onClick={() => onUpdate(task.id, "blocked")} type="button">Есть проблема</button></span>;
}
