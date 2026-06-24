import {
  ArrowRight,
  Compass,
  Heart,
  ListChecks,
  MapPin,
  MessageCircle,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  MayakBadge,
  MayakButton,
  MayakIconBadge,
  MayakInsightCard,
  MayakPanel,
  MayakSectionHeader,
} from "@/shared/ui/mayak";
import { PrimaryButton } from "../components";

const cockpitPreview = [
  { icon: MapPin, label: "Маршрут", caption: "1 · 7 · 14 дней" },
  { icon: ListChecks, label: "Задачи на сегодня", caption: "3 понятных шага" },
  { icon: MessageCircle, label: "Ассистент Маяк", caption: "ответит на вопросы" },
  { icon: UserRound, label: "Наставник", caption: "на связи в смене" },
];

export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.4fr_0.95fr]">
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

      <MayakPanel variant="deep" padding="lg" className="flex min-h-0 flex-col gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent-foreground">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Через 5 минут
          </span>
          <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-deep-foreground">
            Так будет выглядеть ваше личное пространство адаптации
          </h2>
        </div>

        <div className="grid min-h-0 flex-1 content-center gap-2.5">
          {cockpitPreview.map(({ icon: Icon, label, caption }) => (
            <div
              className="flex items-center gap-3 rounded-2xl border border-deep-border bg-white/5 p-3"
              key={label}
            >
              <MayakIconBadge tone="accent" className="h-9 w-9 rounded-xl">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </MayakIconBadge>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-deep-foreground">{label}</p>
                <p className="truncate text-xs text-deep-muted">{caption}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="flex items-center gap-2 text-xs text-deep-muted">
          <Compass className="h-4 w-4 text-accent" aria-hidden="true" />
          Маяк ведёт весь путь в одном спокойном пространстве.
        </p>
      </MayakPanel>
    </section>
  );
}
