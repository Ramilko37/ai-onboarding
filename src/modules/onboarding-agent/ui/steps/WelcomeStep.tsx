import { ArrowRight, CalendarDays, Heart } from "lucide-react";
import { MayakBadge, MayakPanel, MayakSectionHeader } from "@/shared/ui/mayak";
import { PrimaryButton, SecondaryButton } from "../components";
import type { EmployeeProfile } from "../../model/types";

export function WelcomeStep({ employee, onStart, onContinue }: {
  employee: EmployeeProfile | null;
  onStart: () => void;
  onContinue?: () => void;
}) {
  const firstName = employee?.name.split(" ")[0] ?? "София";
  return (
    <section className="mx-auto grid w-full max-w-6xl min-h-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-stretch">
      <MayakPanel padding="lg" className="flex min-h-[440px] flex-col justify-between gap-8 lg:min-h-[520px] lg:p-9">
        <div className="grid gap-6">
          <MayakSectionHeader
            className="mb-0 max-w-3xl"
            kicker={
              <>
                <Heart className="h-3 w-3 text-primary" aria-hidden="true" />
                Добро пожаловать, {firstName}
              </>
            }
            title="Соберём ваш персональный план"
            description="Ответьте на несколько вопросов — мы подберём первые задачи и не будем повторять уже знакомое."
          />

          <p className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4 text-primary" /> Бариста · {employee?.location ?? "Valle Sanchez"} · старт сегодня</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <PrimaryButton onClick={onStart}>
            Начать диагностику
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
          {onContinue && <SecondaryButton onClick={onContinue}>Продолжить</SecondaryButton>}
        </div>
      </MayakPanel>

      <MayakPanel padding="md" className="grid content-start gap-3 lg:p-6">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">Как это работает</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">Три коротких шага</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Первый план появится сразу после диагностики.</p>
        </div>
        <div className="grid gap-2">
          {[
            ["1", "Ответьте на вопросы", "8 коротких ситуаций"],
            ["2", "Получите фокус", "что уже знакомо"],
            ["3", "Начните маршрут", "первые задачи на сегодня"],
          ].map(([number, title, caption]) => (
            <div className="grid grid-cols-[auto_1fr] items-start gap-3 rounded-2xl border border-border bg-card p-4" key={number}>
              <MayakBadge tone="primary">{number}</MayakBadge>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>
              </div>
            </div>
          ))}
        </div>
      </MayakPanel>
    </section>
  );
}
