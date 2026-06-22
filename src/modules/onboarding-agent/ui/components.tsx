import type { ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChefHat,
  Circle,
  ClipboardList,
  Compass,
  Flag,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";
import type {
  CompetencyMilestone,
  CompetencyTopic,
  EmployeeGrade,
  EmployeeProfile,
  EmployeeRole,
  Importance,
  OnboardingStep,
  Skippable
} from "../model/types";
import { getGradeLabel } from "../lib/getGradeLabel";
import { getRoleLabel } from "../lib/getRoleLabel";
import styles from "./OnboardingAgentPage.module.css";

const steps: Array<{ id: OnboardingStep; label: string }> = [
  { id: "welcome", label: "Старт" },
  { id: "employee_profile", label: "Профиль" },
  { id: "competency_map", label: "Карта" },
  { id: "diagnostic_intro", label: "Вводная" },
  { id: "diagnostic", label: "Вопросы" },
  { id: "diagnostic_result", label: "Результат" },
  { id: "learning_route", label: "Маршрут" }
];

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: ReactNode;
};

export function StepProgress({ currentStep }: { currentStep: OnboardingStep }) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <nav className={styles.progressShell} aria-label="Прогресс сценария">
      <div className={styles.progressIntro}>
        <span>
          <Compass aria-hidden="true" />
        </span>
        <div>
          <p>Маяк</p>
          <strong>Карта адаптации</strong>
        </div>
      </div>
      <ol className={styles.progress}>
      {steps.map((step, index) => (
        <li
          aria-current={index === currentIndex ? "step" : undefined}
          className={
            index < currentIndex
              ? styles.progressItemDone
              : index === currentIndex
                ? styles.progressItemActive
                : styles.progressItem
          }
          key={step.id}
        >
          <span>
            {index < currentIndex ? (
              <Check aria-hidden="true" />
            ) : index === currentIndex ? (
              <Circle aria-hidden="true" />
            ) : (
              index + 1
            )}
          </span>
          <p>{step.label}</p>
        </li>
      ))}
      </ol>
    </nav>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
  icon
}: ButtonProps) {
  return (
    <button
      className={styles.primaryButton}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  type = "button",
  disabled,
  icon
}: ButtonProps) {
  return (
    <button
      className={styles.secondaryButton}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
      {children}
    </button>
  );
}

export function RoleCard({
  value,
  title,
  description,
  selected,
  onSelect
}: {
  value: EmployeeRole;
  title: string;
  description: string;
  selected: boolean;
  onSelect: (value: EmployeeRole) => void;
}) {
  return (
    <button
      className={selected ? styles.optionCardSelected : styles.optionCard}
      onClick={() => onSelect(value)}
      type="button"
    >
      <span className={styles.optionIcon}>
        {value === "cook" ? (
          <ChefHat aria-hidden="true" />
        ) : (
          <ClipboardList aria-hidden="true" />
        )}
      </span>
      <span>{title}</span>
      <p>{description}</p>
    </button>
  );
}

export function GradeSelector({
  options,
  value,
  onChange
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
    <div className={styles.gradeGrid}>
      {options.map((option) => (
        <button
          className={
            option.value === value ? styles.gradeOptionSelected : styles.gradeOption
          }
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          <span className={styles.optionIcon}>
            <Sparkles aria-hidden="true" />
          </span>
          <span>{option.label}</span>
          <p>{option.description}</p>
        </button>
      ))}
    </div>
  );
}

export function EmployeeSummaryCard({ employee }: { employee: EmployeeProfile }) {
  return (
    <section className={styles.summaryCard} aria-label="Профиль сотрудника">
      <div>
        <p className={styles.kicker}>Профиль адаптации</p>
        <h2>{employee.name}</h2>
      </div>
      <dl>
        <div>
          <dt><UserRound aria-hidden="true" />Роль</dt>
          <dd>{getRoleLabel(employee.role)}</dd>
        </div>
        <div>
          <dt><Sparkles aria-hidden="true" />Грейд</dt>
          <dd>{getGradeLabel(employee.grade)}</dd>
        </div>
        <div>
          <dt><MapPin aria-hidden="true" />Точка</dt>
          <dd>{employee.location}</dd>
        </div>
        <div>
          <dt><CalendarDays aria-hidden="true" />Дата выхода</dt>
          <dd>{formatDate(employee.startDate)}</dd>
        </div>
      </dl>
      <p>
        На основе роли и грейда агент определит, какие знания нужно проверить в
        первый день. Диагностика нужна не для оценки сотрудника, а для
        персонализации обучения.
      </p>
    </section>
  );
}

export function CompetencyMilestoneCard({
  milestone
}: {
  milestone: CompetencyMilestone;
}) {
  return (
    <article className={styles.milestoneCard}>
      <span><Flag aria-hidden="true" />День {milestone.day}</span>
      <h3>{getMilestoneTitle(milestone.day)}</h3>
      <p>{milestone.goal}</p>
      <ul>
        {milestone.competencies.map((competency) => (
          <li key={competency}>{competency}</li>
        ))}
      </ul>
    </article>
  );
}

export function CompetencyTopicCard({ topic }: { topic: CompetencyTopic }) {
  return (
    <article className={styles.topicCard}>
      <span className={styles.topicIcon}>
        {topic.required ? (
          <ShieldCheck aria-hidden="true" />
        ) : (
          <BookOpen aria-hidden="true" />
        )}
      </span>
      <div>
        <h3>{topic.title}</h3>
        <div className={styles.badges}>
          <ImportanceBadge importance={topic.importance} />
          <SkippableBadge required={topic.required} skippable={topic.skippable} />
        </div>
      </div>
    </article>
  );
}

export function ImportanceBadge({ importance }: { importance: Importance }) {
  const label =
    importance === "high"
      ? "Высокая важность"
      : importance === "medium"
        ? "Средняя важность"
        : "Низкая важность";

  return <span className={styles.importanceBadge}>{label}</span>;
}

export function SkippableBadge({
  skippable,
  required
}: {
  skippable: Skippable;
  required: boolean;
}) {
  if (required || skippable === false) {
    return <span className={styles.requiredBadge}>Обязательный блок</span>;
  }

  if (skippable === "partial") {
    return <span className={styles.partialBadge}>Можно сократить</span>;
  }

  return <span className={styles.optionalBadge}>Можно пропустить</span>;
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
