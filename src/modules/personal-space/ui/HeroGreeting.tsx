import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { MayakProgressRing } from "@/shared/ui/mayak";
import type { LearningRoute } from "../../onboarding-agent/model/learningRouteTypes";
import { newcomer } from "../data";
import type { PersonalSpaceProfile } from "../PersonalSpace";

export function HeroGreeting({
  profile,
  route,
}: {
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
}) {
  const hour = 9;
  const partOfDay = hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
  const name = profile?.name.split(" ")[0] ?? newcomer.name;
  const role = profile?.roleLabel ?? newcomer.role;
  const location = profile?.location ?? newcomer.location;
  const progress = route?.totalScorePercent ?? newcomer.progress;
  const completedTasks = route?.days.flatMap((day) => day.tasks).filter((task) => task.status === "done").length ?? 2;
  const todayTasks = route?.days[0]?.tasks.length ?? 1;
  const upcomingDays = route ? Math.max(route.days.length - 1, 0) : 3;

  return (
    <section className="grid w-full min-w-0 shrink-0 gap-3 lg:grid-cols-[1fr_280px]">
      <div className="flex min-w-0 items-center justify-between gap-4 rounded-3xl border border-border bg-card/80 p-4 backdrop-blur-sm sm:p-5">
        <div className="min-w-0 space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary-foreground">
            <Heart className="h-3 w-3 text-primary" aria-hidden="true" />
            Пространство адаптации
          </span>
          <h1 className="text-pretty text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {partOfDay}, {name}. <span className="text-muted-foreground">Всё под рукой.</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Путь, знания и подсказки собраны в одном спокойном месте: без хаоса, чатов и потерянных инструкций.
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <span className="text-right text-xs text-muted-foreground">
            {role}
            <br />
            {location}
          </span>
          <Link
            href="/onboarding-agent"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
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
        <MayakProgressRing value={progress} size={92} />
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">Спокойный прогресс</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {completedTasks} пройдено · {todayTasks} сегодня · впереди {upcomingDays}
          </p>
        </div>
      </div>
    </section>
  );
}
