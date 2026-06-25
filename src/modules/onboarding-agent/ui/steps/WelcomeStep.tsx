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
              HORECA franchise onboarding
            </>
          }
          title={
            <>
              AI-агент адаптации сотрудников.
              <br />
              <span className="text-muted-foreground">Один экран — один понятный шаг.</span>
            </>
          }
          description="Маяк сначала понимает ваш стартовый уровень, затем за пару минут собирает персональный маршрут на 1, 7 и 14 дней. Без экзамена и без длинных полотен интерфейса."
        />

        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["1", "Профиль", "роль и грейд"],
            ["2", "Диагностика", "мягкие вопросы"],
            ["3", "Маршрут", "под реальные зоны"],
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
            description="После диагностики Маяк соберёт ваш первый день."
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <PrimaryButton onClick={onStart}>
            Начать адаптацию
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
