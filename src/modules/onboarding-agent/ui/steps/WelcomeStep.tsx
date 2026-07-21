import { ArrowRight, CalendarDays, Heart } from "lucide-react";
import { MayakBadge, MayakPanel, MayakSectionHeader } from "@/shared/ui/mayak";
import { PrimaryButton } from "../components";
import type { EmployeeProfile } from "../../model/types";
import type { WelcomeDiagnosticAction } from "../../lib/getWelcomeDiagnosticAction";

export function WelcomeStep({ employee, action, onStart, onContinue }: {
  employee: EmployeeProfile | null;
  action: WelcomeDiagnosticAction;
  onStart: () => void;
  onContinue?: () => void;
}) {
  const firstName = employee?.name.split(" ")[0] ?? "София";
  const handleAction = action.mode === "continue" && onContinue ? onContinue : onStart;

  return (
    <section className="mx-auto w-full max-w-[800px]">
      <MayakPanel
        variant="soft"
        padding="lg"
        className="grid gap-8 lg:p-9"
      >
        <div className="grid gap-6">
          <MayakSectionHeader
            className="mb-0"
            kicker={
              <>
                <Heart className="h-3 w-3 text-primary" aria-hidden="true" />
                Добро пожаловать, {firstName}
              </>
            }
            title="Соберём ваш персональный план"
            description="Ответьте на несколько вопросов — мы подберём первые задачи и не будем повторять уже знакомое."
          />

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Бариста · {employee?.location ?? "Valle Sanchez"} · старт сегодня
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "8 вопросов",
              "фокус обучения",
              "задачи на сегодня",
            ].map((caption, index) => (
              <span
                className="inline-flex min-h-8 items-center gap-2 rounded-full bg-secondary px-3 text-xs font-medium text-secondary-foreground"
                key={caption}
              >
                <MayakBadge tone="muted">{index + 1}</MayakBadge>
                {caption}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <PrimaryButton onClick={handleAction}>
            {action.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
        </div>
      </MayakPanel>
    </section>
  );
}
