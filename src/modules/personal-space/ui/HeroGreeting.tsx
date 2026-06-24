import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { MayakProgressRing } from "@/shared/ui/mayak";
import { newcomer } from "../data";

export function HeroGreeting() {
  const hour = 9;
  const partOfDay = hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";

  return (
    <section className="grid shrink-0 gap-3 lg:grid-cols-[1fr_280px]">
      <div className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-card/80 p-4 backdrop-blur-sm sm:p-5">
        <div className="min-w-0 space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
            <Heart className="h-3 w-3 text-primary" aria-hidden="true" />
            Пространство адаптации
          </span>
          <h1 className="truncate font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {partOfDay}, {newcomer.name}. <span className="text-muted-foreground">Всё под рукой.</span>
          </h1>
          <p className="line-clamp-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
            Путь, знания и подсказки собраны в одном спокойном месте: без хаоса, чатов и потерянных инструкций.
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <span className="text-right text-xs font-medium text-muted-foreground">
            {newcomer.role}
            <br />
            {newcomer.location}
          </span>
          <Link
            href="/onboarding-agent"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Продолжить
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      <div className="hidden items-center justify-center gap-4 rounded-3xl border border-border bg-card/80 p-4 text-center backdrop-blur-sm lg:flex">
        <MayakProgressRing value={newcomer.progress} size={92} />
        <div className="text-left">
          <p className="font-display text-sm font-bold text-foreground">Спокойный прогресс</p>
          <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
            2 пройдено · 1 сегодня · впереди 3
          </p>
        </div>
      </div>
    </section>
  );
}
