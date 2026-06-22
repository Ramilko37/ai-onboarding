"use client";

import { Check, Clock, Sun } from "lucide-react";
import { useState } from "react";
import { initialTodayTasks } from "../data";

export function TodayFocus() {
  const [tasks, setTasks] = useState(initialTodayTasks);
  const doneCount = tasks.filter((task) => task.done).length;

  function toggle(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-sm sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Sun className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Фокус на сегодня
            </h2>
            <p className="text-xs text-muted-foreground">
              Маленькие шаги, без перегруза
            </p>
          </div>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {doneCount}/{tasks.length}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              onClick={() => toggle(task.id)}
              aria-pressed={task.done}
              className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
                task.done
                  ? "border-border bg-secondary/50"
                  : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                  task.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card"
                }`}
                aria-hidden="true"
              >
                {task.done && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className="flex-1">
                <span
                  className={`block text-sm font-medium ${
                    task.done
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  {task.meta}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {task.minutes} мин
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
