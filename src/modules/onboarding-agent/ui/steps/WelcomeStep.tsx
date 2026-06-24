import { ArrowRight, Compass, Heart, Sparkles } from "lucide-react";
import {
  MayakActionBar,
  MayakBadge,
  MayakIconBadge,
  MayakPanel,
  MayakSectionHeader,
} from "@/shared/ui/mayak";
import { PrimaryButton } from "../components";

export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <MayakPanel padding="lg" className="flex min-h-[520px] flex-col justify-between lg:col-span-2">
        <div>
          <MayakSectionHeader
            kicker={
              <>
                <Heart className="h-3 w-3 text-primary" aria-hidden="true" />
                HORECA franchise onboarding
              </>
            }
            title={
              <>
                AI-агент адаптации сотрудников.
                <br />
                <span className="text-muted-foreground">Теперь весь путь — в стиле Маяка.</span>
              </>
            }
            description="Маяк помогает франчайзинговой сети быстрее и спокойнее обучать новых сотрудников: сначала понимает стартовый уровень, затем собирает персональный маршрут на 1, 7 и 14 дней."
          />
        </div>

        <MayakActionBar>
          <PrimaryButton onClick={onStart}>
            Начать адаптацию сотрудника
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
          <span className="text-sm leading-relaxed text-muted-foreground">
            Диагностика не оценивает человека — она убирает лишнее обучение.
          </span>
        </MayakActionBar>
      </MayakPanel>

      <MayakPanel variant="deep" padding="lg" className="flex flex-col justify-end gap-5">
        <MayakIconBadge tone="accent" className="h-12 w-12 rounded-2xl">
          <Compass className="h-6 w-6" aria-hidden="true" />
        </MayakIconBadge>
        {[
          ["01", "Не обучаем всех одинаково."],
          ["02", "Сначала понимаем, что сотрудник уже знает."],
          ["03", "Затем собираем маршрут под реальные зоны развития."],
        ].map(([number, text]) => (
          <div className="border-t border-deep-border pt-4" key={number}>
            <MayakBadge tone="accent">{number}</MayakBadge>
            <p className="mt-3 text-lg font-medium leading-snug text-deep-foreground">{text}</p>
          </div>
        ))}
        <p className="flex items-center gap-2 text-sm text-deep-muted">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
          Один понятный шаг за раз.
        </p>
      </MayakPanel>
    </section>
  );
}
