import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { newcomer } from "../data";

function ProgressRing({ value }: { value: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg
        className="h-32 w-32 -rotate-90"
        viewBox="0 0 120 120"
        role="img"
        aria-label={`Прогресс адаптации ${value} процентов`}
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          className="stroke-secondary"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          {value}%
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          путь
        </span>
      </div>
    </div>
  );
}

export function HeroGreeting() {
  const hour = 9;
  const partOfDay = hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col justify-between gap-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-sm sm:p-8">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-secondary-foreground">
            <Heart className="h-3 w-3 text-primary" aria-hidden="true" />
            Ваше пространство адаптации
          </span>
          <h1 className="text-pretty text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {partOfDay}, {newcomer.name}.
            <br />
            <span className="text-muted-foreground">
              Сегодня всё под рукой — и спешить некуда.
            </span>
          </h1>
          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Я собрал ваш путь, знания и подсказки в одном спокойном месте. Один
            понятный шаг за раз — без хаоса, чатов и потерянных инструкций.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/onboarding-agent"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Продолжить путь
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <span className="text-sm text-muted-foreground">
            {newcomer.role} · {newcomer.location}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card/80 p-6 text-center backdrop-blur-sm">
        <ProgressRing value={newcomer.progress} />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Вы движетесь спокойно и уверенно
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            2 шага пройдено · 1 шаг сегодня · впереди ещё 3
          </p>
        </div>
      </div>
    </section>
  );
}
