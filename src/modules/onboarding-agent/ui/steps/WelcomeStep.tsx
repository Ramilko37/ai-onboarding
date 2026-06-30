import {
  ArrowRight,
  Compass,
  Heart,
  Sparkles,
} from "lucide-react";
import {
  MayakBadge,
  MayakInsightCard,
  MayakPanel,
  MayakSectionHeader,
} from "@/shared/ui/mayak";
import { PrimaryButton } from "../components";

export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid min-h-0 gap-3">
      <MayakPanel padding="lg" className="flex min-h-0 flex-col justify-center gap-5">
        <MayakSectionHeader
          className="mb-0"
          kicker={
            <>
              <Heart className="h-3 w-3 text-primary" aria-hidden="true" />
              Valle Sanchez · barista assessment
            </>
          }
          title={
            <>
              Входное тестирование бариста.
              <br />
              <span className="text-muted-foreground">Стандарты кофе, диагностика и личный план.</span>
            </>
          }
          description="Система мягко определяет стартовый уровень по demo-стандартам кофеварения, показывает skill gaps и собирает маршрут развития на 1, 7 и 14 дней. Это поддержка обучения, а не кадровое решение."
        />

        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["1", "Профиль", "грейд и кофейня"],
            ["2", "Диагностика", "кофейные стандарты"],
            ["3", "Маршрут", "day 1 / 7 / 14"],
          ].map(([number, title, caption]) => (
            <div className="rounded-2xl border border-border bg-card p-3" key={number}>
              <MayakBadge tone="primary">{number}</MayakBadge>
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{caption}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <MayakInsightCard
            tone="primary"
            icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
            title="Сократим знакомое, усилим новое"
            description="Темы, которые вы уже знаете, пройдём короче."
          />
          <MayakInsightCard
            tone="accent"
            icon={<Compass className="h-4 w-4" aria-hidden="true" />}
            title="Покажем, что делать сегодня"
            description="После диагностики появится первый план развития."
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <PrimaryButton onClick={onStart}>
            Начать тестирование
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
          <span className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            Диагностика не оценивает человека — она убирает лишнее обучение.
          </span>
        </div>
      </MayakPanel>
    </section>
  );
}
