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
  { id: "employee_profile", label: "Профиль", caption: "роль и точка" },
  { id: "competency_map", label: "Карта", caption: "что важно" },
  { id: "diagnostic_intro", label: "Вводная", caption: "без тревоги" },
  { id: "diagnostic", label: "Вопросы", caption: "мягкая диагностика" },
  { id: "diagnostic_result", label: "Результат", caption: "зоны поддержки" },
  { id: "learning_route", label: "Маяк", caption: "личный маршрут" },
];

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function StepProgress({ currentStep }: { currentStep: OnboardingStep }) {
  const currentIndex = onboardingSteps.findIndex((step) => step.id === currentStep);

  return (
    <nav className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-7" aria-label="Прогресс сценария">
      {onboardingSteps.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div
            className={cn(
              "rounded-2xl border bg-card/75 p-3 backdrop-blur-sm transition",
              isActive && "border-primary/40 bg-primary/5 shadow-[var(--shadow-card)]",
              isDone && "border-border bg-card/80",
              !isDone && !isActive && "border-border/70 opacity-75",
            )}
            key={step.id}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  isDone && "border-primary bg-primary text-primary-foreground",
                  isActive && "animate-pulse-ring border-primary bg-card text-primary",
                  !isDone && !isActive && "border-border bg-secondary text-muted-foreground",
                )}
                aria-hidden="true"
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : isActive ? <Circle className="h-3 w-3 fill-current" /> : index + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">{step.label}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{step.caption}</span>
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export function PrimaryButton({ children, onClick, type = "button", disabled }: ButtonProps) {
  return (
    <MayakButton disabled={disabled} onClick={onClick} type={type} variant="primary">
      {children}
    </MayakButton>
  );
}

export function SecondaryButton({ children, onClick, type = "button", disabled }: ButtonProps) {
  return (
    <MayakButton disabled={disabled} onClick={onClick} type={type} variant="secondary">
      {children}
    </MayakButton>
  );
}

export function RoleCard({
  value,
  title,
  description,
  selected,
  onSelect,
}: {
  value: EmployeeRole;
  title: string;
  description: string;
  selected: boolean;
  onSelect: (value: EmployeeRole) => void;
}) {
  return (
    <MayakOptionCard
      title={title}
      description={description}
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
    <div className="mt-2 grid gap-3 lg:grid-cols-3">
      {options.map((option) => (
        <MayakOptionCard
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
    <MayakPanel variant="deep" padding="lg" ariaLabel="Профиль сотрудника">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-accent-foreground">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Профиль адаптации
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-deep-foreground">
            {employee.name}
          </h2>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <SummaryFact label="Роль" value={getRoleLabel(employee.role)} />
          <SummaryFact label="Грейд" value={getGradeLabel(employee.grade)} />
          <SummaryFact label="Точка" value={employee.location} />
          <SummaryFact label="Дата выхода" value={formatDate(employee.startDate)} />
        </dl>
        <p className="text-sm leading-relaxed text-deep-muted">
          Маяк использует роль и грейд только для персонализации маршрута: что уже знакомо — сократим, где нужна поддержка — подсветим спокойно.
        </p>
      </div>
    </MayakPanel>
  );
}

function SummaryFact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-t border-deep-border pt-3">
      <dt className="text-xs text-deep-muted">{label}</dt>
      <dd className="mt-1 font-semibold text-deep-foreground">{value}</dd>
    </div>
  );
}

export function CompetencyMilestoneCard({ milestone }: { milestone: CompetencyMilestone }) {
  return (
    <MayakPanel padding="md" className="transition hover:-translate-y-0.5 hover:border-primary/40">
      <MayakBadge tone="primary">День {milestone.day}</MayakBadge>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
        {getMilestoneTitle(milestone.day)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{milestone.goal}</p>
      <ul className="mt-4 space-y-2 text-sm text-foreground/85">
        {milestone.competencies.map((competency) => (
          <li className="flex gap-2" key={competency}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span>{competency}</span>
          </li>
        ))}
      </ul>
    </MayakPanel>
  );
}

export function CompetencyTopicCard({ topic }: { topic: CompetencyTopic }) {
  return (
    <MayakPanel padding="sm" className="transition hover:-translate-y-0.5 hover:border-primary/40">
      <h3 className="text-sm font-semibold text-foreground">{topic.title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <ImportanceBadge importance={topic.importance} />
        <SkippableBadge required={topic.required} skippable={topic.skippable} />
      </div>
    </MayakPanel>
  );
}

export function ImportanceBadge({ importance }: { importance: Importance }) {
  const label =
    importance === "high"
      ? "Высокая важность"
      : importance === "medium"
        ? "Средняя важность"
        : "Низкая важность";

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
    return <MayakBadge tone="primary">Обязательный блок</MayakBadge>;
  }

  if (skippable === "partial") {
    return <MayakBadge tone="secondary">Можно сократить</MayakBadge>;
  }

  return <MayakBadge tone="muted">Можно пропустить</MayakBadge>;
}

export function StatGrid({
  stats,
  className,
}: {
  stats: Array<{ value: ReactNode; label: ReactNode; description?: ReactNode }>;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 md:grid-cols-3", className)}>
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
    return "Что важно в первый день";
  }

  if (day === 7) {
    return "Что нужно освоить за 7 дней";
  }

  return "Что нужно освоить за 14 дней";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU").format(new Date(value));
}
