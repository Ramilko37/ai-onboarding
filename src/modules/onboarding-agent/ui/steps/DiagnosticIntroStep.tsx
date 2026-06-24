import { Heart, Sparkles } from "lucide-react";
import { MayakActionBar, MayakBadge, MayakIconBadge, MayakPanel, MayakSectionHeader } from "@/shared/ui/mayak";
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
    <MayakPanel padding="lg" className="mx-auto max-w-4xl">
      <MayakSectionHeader
        kicker="Шаг 3 · перед диагностикой"
        title="Сейчас будет короткая диагностика"
        description={
          <>
            Сценарий для сотрудника: {employee.name}, роль — {getRoleLabel(employee.role).toLowerCase()}.
            Это не экзамен и не HR-решение, а способ собрать обучение под реальный стартовый уровень.
          </>
        }
      />

      <MayakPanel padding="lg" className="border-primary/25 bg-primary/5 shadow-none">
        <div className="flex gap-4">
          <MayakIconBadge tone="primary" className="h-11 w-11 rounded-2xl">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </MayakIconBadge>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Маяк задаст несколько вопросов спокойно и по делу.
            </h2>
            <p className="leading-relaxed text-muted-foreground">Он поможет понять:</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "какие темы уже знакомы",
                "что можно сократить",
                "где лучше дать поддержку",
              ].map((item) => (
                <div className="rounded-2xl border border-border bg-card p-4" key={item}>
                  <MayakBadge tone="secondary">
                    <Sparkles className="mr-1.5 h-3 w-3 text-primary" aria-hidden="true" />
                    важно
                  </MayakBadge>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85">{item}</p>
                </div>
              ))}
            </div>
            <p className="leading-relaxed text-muted-foreground">
              Так мы не будем тратить время на лишнее обучение и соберём персональный маршрут именно под сотрудника.
            </p>
          </div>
        </div>
      </MayakPanel>

      <MayakActionBar>
        <SecondaryButton onClick={onBack}>Вернуться к карте</SecondaryButton>
        <PrimaryButton onClick={onStart}>Начать диагностику</PrimaryButton>
      </MayakActionBar>
    </MayakPanel>
  );
}
