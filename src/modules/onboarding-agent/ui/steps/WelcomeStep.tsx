import { ArrowRight, CalendarDays, Heart } from "lucide-react";
import { MayakPanel, MayakSectionHeader } from "@/shared/ui/mayak";
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

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Диагностика займёт несколько минут и сразу откроет первые задачи на сегодня.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <PrimaryButton onClick={handleAction}>
            {action.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
          <span className="text-sm text-muted-foreground">{action.hint}</span>
        </div>
      </MayakPanel>
    </section>
  );
}
