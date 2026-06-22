import { ArrowRight, Check, MapPin } from "lucide-react";
import Link from "next/link";
import { journeyStages, type JourneyStage } from "../data";

function StageNode({ status }: { status: JourneyStage["status"] }) {
  if (status === "done") {
    return (
      <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="animate-pulse-ring relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-card">
        <span className="h-3 w-3 rounded-full bg-primary" />
      </span>
    );
  }

  return (
    <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
    </span>
  );
}

export function JourneyMap() {
  return (
    <section className="rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-sm sm:p-7">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Карта пути
          </h2>
          <p className="text-xs text-muted-foreground">
            Где вы сейчас и что ждёт впереди
          </p>
        </div>
      </div>

      <ol className="relative">
        {journeyStages.map((stage, index) => {
          const isLast = index === journeyStages.length - 1;
          return (
            <li key={stage.id} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute top-9 left-[17px] h-[calc(100%-1rem)] w-px ${
                    stage.status === "done" ? "bg-primary/40" : "bg-border"
                  }`}
                  aria-hidden="true"
                />
              )}
              <StageNode status={stage.status} />
              <div
                className={`flex-1 rounded-2xl border p-4 transition ${
                  stage.status === "active"
                    ? "border-primary/40 bg-primary/5"
                    : "border-transparent"
                }`}
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {stage.day}
                  </p>
                  {stage.status === "active" && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                      сейчас
                    </span>
                  )}
                  {stage.status === "done" && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                      готово
                    </span>
                  )}
                </div>
                <h3
                  className={`mt-1 text-sm font-semibold ${
                    stage.status === "upcoming"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {stage.title}
                </h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {stage.caption}
                </p>
                {stage.href && stage.cta && (
                  <Link
                    href={stage.href}
                    className="group mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    {stage.cta}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
