import type { ReactNode } from "react";
import { Check, Circle, Sparkles } from "lucide-react";
import {
  MayakBadge,
  MayakButton,
  MayakOptionCard,
  MayakPanel,
  MayakStatCard,
  cn,
} from "@/shared/ui/mayak";
import type {
  CompetencyMilestone,
  CompetencyTopic,
  EmployeeGrade,
  EmployeeProfile,
  EmployeeRole,
  Importance,
  OnboardingStep,
  Skippable,
} from "../model/types";
import { getGradeLabel } from "../lib/getGradeLabel";
import { getRoleLabel } from "../lib/getRoleLabel";

export const onboardingSteps: Array<{ id: OnboardingStep; label: string; caption: string }> = [
  { id: "welcome", label: "Старт", caption: "знакомство" },
  { id: "employee_profile", label: "Профиль", caption: "роль" },
  { id: "competency_map", label: "Карта", caption: "темы" },
  { id: "diagnostic_intro", label: "Вводная", caption: "контекст" },
  { id: "diagnostic", label: "Вопросы", caption: "8 минут" },
  { id: "diagnostic_result", label: "Результат", caption: "итоги" },
  { id: "learning_route", label: "Маяк", caption: "маршрут" },
];

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export function StepProgress({ currentStep }: { currentStep: OnboardingStep }) {
  const currentIndex = onboardingSteps.findIndex((step) => step.id === currentStep);
  const progressPercent = Math.round(((currentIndex + 1) / onboardingSteps.length) * 100);

  return (
    <nav
      className="shrink-0 rounded-3xl border border-border bg-card/70 p-2 backdrop-blur-xl"
      aria-label="Прогресс сценария"
    >
      <div className="mb-2 h-1 overflow-hidden rounded-full bg-secondary">
        <span
          className="block h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {onboardingSteps.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div
              className={cn(
                "flex min-w-fit items-center gap-2 rounded-full border px-2.5 py-1.5 transition",
                isActive && "border-primary/40 bg-primary/10 text-primary shadow-sm",
                isDone && "border-border bg-card text-foreground",
                !isDone && !isActive && "border-transparent text-muted-foreground",
              )}
              key={step.id}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                  isDone && "bg-primary text-primary-foreground",
                  isActive && "animate-pulse-ring bg-card text-primary ring-1 ring-primary/40",
                  !isDone && !isActive && "bg-secondary text-muted-foreground",
                )}
                aria-hidden="true"
              >
                {isDone ? <Check className="h-3 w-3" /> : isActive ? <Circle className="h-2.5 w-2.5 fill-current" /> : index + 1}
              </span>
              <span className="text-xs font-semibold">{step.label}</span>
              {isActive && <span className="hidden text-[11px] text-muted-foreground sm:inline">{step.caption}</span>}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export function PrimaryButton({ children, onClick, type = "button", disabled, className }: ButtonProps) {
  return (
    <MayakButton className={className} disabled={disabled} onClick={onClick} type={type} variant="primary">
      {children}
    </MayakButton>
  );
}

export function SecondaryButton({ children, onClick, type = "button", disabled, className }: ButtonProps) {
  return (
    <MayakButton className={className} disabled={disabled} onClick={onClick} type={type} variant="secondary">
      {children}
    </MayakButton>
  );
}

export function RoleCard({
  value,
  title,
  description,
  meta,
  selected,
  onSelect,
}: {
  value: EmployeeRole;
  title: string;
  description: string;
  meta?: ReactNode;
  selected: boolean;
  onSelect: (value: EmployeeRole) => void;
}) {
  return (
    <MayakOptionCard
      className="h-full"
      title={title}
      description={description}
      meta={meta}
      selected={selected}
      onClick={() => onSelect(value)}
    />
  );
}

export function GradeSelector({
  options,
  value,
  onChange,
}: {
  options: Array<{
    value: EmployeeGrade;
    label: string;
    description: string;
  }>;
  value: EmployeeGrade;
  onChange: (value: EmployeeGrade) => void;
}) {
  return (
    <div className="grid gap-2 lg:grid-cols-3">
      {options.map((option) => (
        <MayakOptionCard
          className="min-h-0"
          key={option.value}
          title={option.label}
          description={option.description}
          selected={option.value === value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

export function EmployeeSummaryCard({ employee }: { employee: EmployeeProfile }) {
  return (
    <MayakPanel variant="deep" padding="md" ariaLabel="Профиль сотрудника">
      <div className="grid gap-4 lg:grid-cols-[0.65fr_1fr_0.85fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent-foreground">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Профиль
          </span>
          <h2 className="mt-2 truncate text-xl font-semibold tracking-tight text-deep-foreground">
            {employee.name}
          </h2>
        </div>
        <dl className="grid gap-2 sm:grid-cols-2">
          <SummaryFact label="Роль" value={getRoleLabel(employee.role)} />
          <SummaryFact label="Грейд" value={getGradeLabel(employee.grade)} />
          <SummaryFact label="Точка" value={employee.location} />
          <SummaryFact label="Дата выхода" value={formatDate(employee.startDate)} />
        </dl>
        <p className="line-clamp-3 text-xs leading-relaxed text-deep-muted">
          Маяк использует роль и грейд только для персонализации: что знакомо — сократит, где нужна поддержка — подсветит.
        </p>
      </div>
    </MayakPanel>
  );
}

function SummaryFact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-t border-deep-border pt-2">
      <dt className="text-[11px] text-deep-muted">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold text-deep-foreground">{value}</dd>
    </div>
  );
}

export function CompetencyMilestoneCard({ milestone }: { milestone: CompetencyMilestone }) {
  return (
    <MayakPanel padding="sm" className="h-full transition hover:-translate-y-0.5 hover:border-primary/40">
      <MayakBadge tone="primary">День {milestone.day}</MayakBadge>
      <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
        {getMilestoneTitle(milestone.day)}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{milestone.goal}</p>
      <ul className="mt-3 space-y-1.5 text-xs text-foreground/85">
        {milestone.competencies.slice(0, 4).map((competency) => (
          <li className="flex gap-2" key={competency}>
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span className="line-clamp-1">{competency}</span>
          </li>
        ))}
      </ul>
    </MayakPanel>
  );
}

export function CompetencyTopicCard({ topic }: { topic: CompetencyTopic }) {
  return (
    <MayakPanel padding="xs" className="transition hover:border-primary/40">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xs font-semibold leading-snug text-foreground">{topic.title}</h3>
        <ImportanceBadge importance={topic.importance} />
      </div>
      <div className="mt-2">
        <SkippableBadge required={topic.required} skippable={topic.skippable} />
      </div>
    </MayakPanel>
  );
}

export function ImportanceBadge({ importance }: { importance: Importance }) {
  const label = importance === "high" ? "Высокая" : importance === "medium" ? "Средняя" : "Низкая";

  return <MayakBadge tone={importance === "high" ? "accent" : "secondary"}>{label}</MayakBadge>;
}

export function SkippableBadge({
  skippable,
  required,
}: {
  skippable: Skippable;
  required: boolean;
}) {
  if (required || skippable === false) {
    return <MayakBadge tone="primary">Обязательный</MayakBadge>;
  }

  if (skippable === "partial") {
    return <MayakBadge tone="secondary">Сократить</MayakBadge>;
  }

  return <MayakBadge tone="muted">Пропустить</MayakBadge>;
}

export function StatGrid({
  stats,
  className,
}: {
  stats: Array<{ value: ReactNode; label: ReactNode; description?: ReactNode }>;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2 md:grid-cols-3", className)}>
      {stats.map((stat) => (
        <MayakStatCard
          key={`${stat.label}-${stat.value}`}
          value={stat.value}
          label={stat.label}
          description={stat.description}
        />
      ))}
    </div>
  );
}

function getMilestoneTitle(day: 1 | 7 | 14) {
  if (day === 1) {
    return "Первый день";
  }

  if (day === 7) {
    return "За 7 дней";
  }

  return "За 14 дней";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU").format(new Date(value));
}
