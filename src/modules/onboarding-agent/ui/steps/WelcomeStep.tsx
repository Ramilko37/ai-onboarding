import { ArrowRight, CalendarDays, Heart, Sparkles } from "lucide-react";
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
    <section className="mx-auto grid w-full max-w-3xl min-h-0 gap-3">
      <MayakPanel padding="lg" className="flex min-h-0 flex-col justify-center gap-5">
        <MayakSectionHeader
          className="mb-0"
          kicker={
            <>
              <Heart className="h-3 w-3 text-primary" aria-hidden="true" />
              Добро пожаловать, {firstName}
            </>
          }
          title={
            <>
              Соберём ваш персональный план
            </>
          }
          description="Ответьте на несколько вопросов — мы подберём первые задачи и не будем повторять уже знакомое."
        />

        <p className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4 text-primary" /> Бариста · {employee?.location ?? "Valle Sanchez"} · старт сегодня</p>

        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["1", "Ответьте на вопросы", "8 коротких ситуаций"],
            ["2", "Получите фокус", "что уже знакомо"],
            ["3", "Начните маршрут", "первые задачи на сегодня"],
          ].map(([number, title, caption]) => (
            <div className="rounded-2xl border border-border bg-card p-3" key={number}>
              <MayakBadge tone="primary">{number}</MayakBadge>
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{caption}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <PrimaryButton onClick={onStart}>
            Начать диагностику
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
          {onContinue && <SecondaryButton onClick={onContinue}>Продолжить</SecondaryButton>}
          <span className="max-w-xs text-xs leading-relaxed text-muted-foreground">Это не экзамен. Ответы нужны только для фокуса обучения.</span>
        </div>
      </MayakPanel>
    </section>
  );
}
