import {
  ArrowRight,
  Clock,
  Heart,
  ListChecks,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  MayakActionBar,
  MayakBadge,
  MayakIconBadge,
  MayakInsightCard,
  MayakPanel,
  MayakSectionHeader,
} from "@/shared/ui/mayak";
import type { EmployeeProfile } from "../../model/types";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";

const facts = [
  { icon: Clock, value: "8 минут", caption: "спокойный темп" },
  { icon: ListChecks, value: "10–14 вопросов", caption: "по одному на экран" },
  { icon: ShieldCheck, value: "без оценки", caption: "не влияет на кадровые решения" },
  { icon: Sparkles, value: "персональный маршрут", caption: "результат диагностики" },
];

const willHappen = [
  { icon: Plus, text: "Подсветим темы, которые вы уже знаете" },
  { icon: Minus, text: "Уберём из маршрута лишнее обучение" },
  { icon: Heart, text: "Усилим зоны, где пригодится поддержка" },
  { icon: ListChecks, text: "Соберём 3 понятные задачи на сегодня" },
];

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
    <MayakPanel padding="lg" className="mx-auto grid h-full max-w-5xl gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="flex min-h-0 flex-col gap-4">
        <MayakSectionHeader
          className="mb-0"
          kicker="Шаг 3 · вводная"
          title="Короткая диагностика без тревоги"
          description={
            <>
              Сотрудник: {employee.name}. Роль — {getRoleLabel(employee.role).toLowerCase()}. Это не
              экзамен, а настройка маршрута под ваш реальный стартовый уровень.
            </>
          }
        />

        <div className="grid grid-cols-2 gap-2">
          {facts.map(({ icon: Icon, value, caption }) => (
            <div className="rounded-2xl border border-border bg-card p-3" key={value}>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="mt-2 text-sm font-semibold leading-snug text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{caption}</p>
            </div>
          ))}
        </div>

        <MayakInsightCard
          tone="primary"
          icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
          title="Маяк не ставит оценку"
          description="Ответы нужны только для настройки маршрута и не влияют на кадровые решения."
        />

        <MayakActionBar className="mt-auto border-t border-border pt-4">
          <SecondaryButton onClick={onBack}>К карте</SecondaryButton>
          <PrimaryButton onClick={onStart}>
            Начать
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
        </MayakActionBar>
      </div>

      <MayakPanel
        variant="deep"
        padding="lg"
        className="flex min-h-0 flex-col gap-4 shadow-none"
      >
        <div className="flex items-center gap-3">
          <MayakIconBadge tone="accent" className="h-11 w-11 rounded-2xl">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </MayakIconBadge>
          <div className="min-w-0">
            <MayakBadge tone="accent">что произойдёт</MayakBadge>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-deep-foreground">
              После диагностики Маяк сразу соберёт маршрут
            </h2>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 content-center gap-2.5">
          {willHappen.map(({ icon: Icon, text }) => (
            <div
              className="flex items-center gap-3 rounded-2xl border border-deep-border bg-white/5 p-3"
              key={text}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-sm leading-snug text-deep-foreground">{text}</p>
            </div>
          ))}
        </div>

        <p className="text-xs leading-relaxed text-deep-muted">
          Знакомые темы пройдём короче, а где нужно — добавим конспект, практику или наставника.
        </p>
      </MayakPanel>
    </MayakPanel>
  );
}
