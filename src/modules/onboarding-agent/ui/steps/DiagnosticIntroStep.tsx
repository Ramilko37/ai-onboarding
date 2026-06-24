import { Heart, Sparkles } from "lucide-react";
import {
  MayakActionBar,
  MayakBadge,
  MayakIconBadge,
  MayakPanel,
  MayakSectionHeader,
} from "@/shared/ui/mayak";
import type { EmployeeProfile } from "../../model/types";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";

export function DiagnosticIntroStep({
  employee,
  onBack,
  onStart,
}: {
  employee: EmployeeProfile;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <MayakPanel padding="lg" className="mx-auto grid h-full max-w-5xl gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex min-h-0 flex-col justify-between gap-4">
        <MayakSectionHeader
          kicker="Шаг 3 · вводная"
          title="Короткая диагностика без тревоги"
          description={
            <>
              Сотрудник: {employee.name}. Роль — {getRoleLabel(employee.role).toLowerCase()}. Это не экзамен, а настройка маршрута под реальный стартовый уровень.
            </>
          }
        />

        <MayakPanel variant="deep" padding="md" className="shadow-none">
          <MayakBadge tone="accent">позиционирование</MayakBadge>
          <p className="mt-3 text-sm leading-relaxed text-deep-muted">
            Маяк не выставляет оценку. Он определяет, какие темы уже можно сократить, а где лучше дать наставника, конспект или практику.
          </p>
        </MayakPanel>

        <MayakActionBar className="mt-auto">
          <SecondaryButton onClick={onBack}>К карте</SecondaryButton>
          <PrimaryButton onClick={onStart}>Начать</PrimaryButton>
        </MayakActionBar>
      </div>

      <MayakPanel padding="lg" className="flex min-h-0 flex-col justify-center border-primary/25 bg-primary/5 shadow-none">
        <div className="flex gap-4">
          <MayakIconBadge tone="primary" className="h-11 w-11 rounded-2xl">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </MayakIconBadge>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Что произойдёт за несколько минут
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                "подсветим знакомые темы",
                "уберём лишнее обучение",
                "усилим зоны поддержки",
              ].map((item) => (
                <div className="rounded-2xl border border-border bg-card p-3" key={item}>
                  <MayakBadge tone="secondary">
                    <Sparkles className="mr-1.5 h-3 w-3 text-primary" aria-hidden="true" />
                    шаг
                  </MayakBadge>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              После диагностики Маяк сразу соберёт маршрут и покажет, что делать сегодня.
            </p>
          </div>
        </div>
      </MayakPanel>
    </MayakPanel>
  );
}
