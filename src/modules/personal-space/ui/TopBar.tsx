import { Compass, Sparkles } from "lucide-react";
import { company, newcomer } from "../data";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              Маяк
            </p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {company.name} · {company.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            День {newcomer.dayIndex} из {newcomer.dayTotal}
          </span>
          <div className="flex items-center gap-2.5 rounded-full border border-border bg-card/80 py-1 pr-3 pl-1">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
              aria-hidden="true"
            >
              {newcomer.name.charAt(0)}
            </span>
            <span className="hidden text-sm font-medium text-foreground sm:inline">
              {newcomer.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
