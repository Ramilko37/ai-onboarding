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
    <section className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.45fr_0.9fr]">
      <MayakPanel padding="lg" className="flex min-h-0 flex-col justify-between">
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
                <span className="text-muted-foreground">Один экран — один понятный шаг.</span>
              </>
            }
            description="Маяк сначала понимает стартовый уровень, затем собирает персональный маршрут на 1, 7 и 14 дней. Без ощущения экзамена и без длинных полотен интерфейса."
          />
        </div>

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

        <MayakActionBar className="items-center justify-between">
          <PrimaryButton onClick={onStart}>
            Начать адаптацию
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
          <span className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            Диагностика не оценивает человека — она убирает лишнее обучение.
          </span>
        </MayakActionBar>
      </MayakPanel>

      <MayakPanel variant="deep" padding="lg" className="flex min-h-0 flex-col justify-between gap-3">
        <div>
          <MayakIconBadge tone="accent" className="h-11 w-11 rounded-2xl">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </MayakIconBadge>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-deep-foreground">
            Маяк держит весь путь в одном спокойном пространстве.
          </h2>
        </div>
        <div className="grid gap-3">
          {[
            ["01", "Не обучаем всех одинаково."],
            ["02", "Понимаем, что сотрудник уже знает."],
            ["03", "Подсвечиваем следующий лучший шаг."],
          ].map(([number, text]) => (
            <div className="border-t border-deep-border pt-3" key={number}>
              <MayakBadge tone="accent">{number}</MayakBadge>
              <p className="mt-2 text-sm font-medium leading-snug text-deep-foreground">{text}</p>
            </div>
          ))}
        </div>
        <p className="flex items-center gap-2 text-xs text-deep-muted">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
          Экран помещается в viewport, детали раскрываются по мере необходимости.
        </p>
      </MayakPanel>
    </section>
  );
}
