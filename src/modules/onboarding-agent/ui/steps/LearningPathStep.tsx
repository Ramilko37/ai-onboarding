import type {
  EmployeeProfile,
  LearningModuleFormat,
  LearningPath,
  LearningPathDay,
  LearningPathModule,
  LearningPathSource,
  LearningPathTopicSummary,
  LearningPriority,
  ManagerRecommendation
} from "../../model/types";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";
import styles from "../OnboardingAgentPage.module.css";

export function LearningPathStep({
  employee,
  learningPath,
  onBack,
  onReset
}: {
  employee: EmployeeProfile;
  learningPath: LearningPath;
  onBack: () => void;
  onReset: () => void;
}) {
  return (
    <section className={styles.learningPathPanel}>
      <LearningPathSummaryCard employee={employee} learningPath={learningPath} />
      <LearningPathMetricsCard learningPath={learningPath} />

      <div className={styles.learningPathTwoColumn}>
        <LearningPathTopicGroups learningPath={learningPath} />
        <ManagerRecommendationsCard
          recommendations={learningPath.managerRecommendations}
        />
      </div>

      <section className={styles.learningPathDays} aria-label="План на 14 дней">
        <div className={styles.learningPathSectionHeader}>
          <p className={styles.kicker}>План на 14 дней</p>
          <h2>Модули распределены по нагрузке и приоритету темы.</h2>
        </div>
        <div className={styles.learningPathDayGrid}>
          {learningPath.days.map((day) => (
            <LearningPathDayCard day={day} key={day.day} />
          ))}
        </div>
      </section>

      <div className={styles.actions}>
        <SecondaryButton onClick={onBack}>Вернуться к результатам</SecondaryButton>
        <PrimaryButton onClick={onReset}>Начать сценарий заново</PrimaryButton>
      </div>
    </section>
  );
}

export function LearningPathSummaryCard({
  employee,
  learningPath
}: {
  employee: EmployeeProfile;
  learningPath: LearningPath;
}) {
  return (
    <header className={styles.learningPathSummaryCard}>
      <div>
        <p className={styles.kicker}>Персональная траектория</p>
        <h1>Персональный маршрут обучения</h1>
        <p className={styles.learningPathEmployeeLine}>
          {employee.name} · {getRoleLabel(employee.role)} ·{" "}
          {getGradeLabel(employee.grade)} · {employee.location}
        </p>
        {learningPath.summary.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <SavedTimeBadge learningPath={learningPath} />
    </header>
  );
}

export function LearningPathMetricsCard({
  learningPath
}: {
  learningPath: LearningPath;
}) {
  const isSaved = learningPath.savedMinutes >= 0;

  return (
    <section className={styles.learningPathMetrics} aria-label="Метрики маршрута">
      <MetricItem
        label="Стандартный маршрут"
        value={formatMinutes(learningPath.totalStandardMinutes)}
      />
      <MetricItem
        label="Персональный маршрут"
        value={formatMinutes(learningPath.totalPersonalizedMinutes)}
      />
      <MetricItem
        label={isSaved ? "Экономия" : "Дополнительная поддержка"}
        value={
          isSaved
            ? formatMinutes(learningPath.savedMinutes)
            : `+${formatMinutes(Math.abs(learningPath.savedMinutes))}`
        }
      />
      <MetricItem
        label={isSaved ? "Сокращение" : "Усиление"}
        value={`${Math.abs(learningPath.savedPercent)}%`}
      />
    </section>
  );
}

export function LearningPathTopicGroups({
  learningPath
}: {
  learningPath: LearningPath;
}) {
  return (
    <section className={styles.learningPathTopicGroups}>
      <TopicSummaryGroup
        emptyText="Подробные блоки пока не сокращены."
        title="Что сокращено"
        topics={learningPath.shortenedTopics}
      />
      <TopicSummaryGroup
        emptyText="Нет выраженных усилений по результатам диагностики."
        title="Что усилено"
        topics={learningPath.strengthenedTopics}
      />
      <TopicSummaryGroup
        emptyText="Критичных тем для отдельного review не видно."
        title="Критичные темы"
        topics={learningPath.criticalTopics}
      />
    </section>
  );
}

export function ManagerRecommendationsCard({
  recommendations
}: {
  recommendations: ManagerRecommendation[];
}) {
  return (
    <section className={styles.managerRecommendationsCard}>
      <div className={styles.learningPathSectionHeader}>
        <p className={styles.kicker}>Управляющему</p>
        <h2>Рекомендации для спокойного review</h2>
      </div>
      {recommendations.length === 0 ? (
        <p className={styles.emptyStateText}>
          Отдельных high-risk рекомендаций нет. Достаточно следить за обычным
          прохождением маршрута и отвечать на вопросы сотрудника.
        </p>
      ) : (
        <ul className={styles.managerRecommendationList}>
          {recommendations.map((recommendation) => (
            <li key={recommendation.id}>
              <div>
                <strong>{recommendation.title}</strong>
                <span className={getPriorityClassName(recommendation.priority)}>
                  {getPriorityLabel(recommendation.priority)}
                </span>
              </div>
              <p>{recommendation.text}</p>
              <small>Проверить к дню {recommendation.suggestedDay}</small>
              <LearningPathSources sources={recommendation.sources} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function LearningPathDayCard({ day }: { day: LearningPathDay }) {
  const totalMinutes = day.modules.reduce(
    (sum, module) => sum + module.durationMinutes,
    0
  );

  return (
    <article className={styles.learningPathDayCard}>
      <header>
        <div>
          <span>День {day.day}</span>
          <h3>{day.focus}</h3>
        </div>
        <strong>{formatMinutes(totalMinutes)}</strong>
      </header>

      {day.modules.length === 0 ? (
        <p className={styles.emptyStateText}>
          Новых модулей нет. День оставлен для практики на смене и вопросов
          наставнику.
        </p>
      ) : (
        <div className={styles.learningPathModuleList}>
          {day.modules.map((module) => (
            <LearningPathModuleCard key={module.id} module={module} />
          ))}
        </div>
      )}

      {day.checkpoint && (
        <div className={styles.learningPathCheckpoint}>
          <strong>{day.checkpoint.title}</strong>
          <p>{day.checkpoint.description}</p>
        </div>
      )}
    </article>
  );
}

export function LearningPathModuleCard({
  module
}: {
  module: LearningPathModule;
}) {
  return (
    <article className={styles.learningPathModuleCard}>
      <div className={styles.learningPathModuleHeader}>
        <div>
          <h4>{module.title}</h4>
          <p>{module.reason}</p>
        </div>
        <span className={getPriorityClassName(module.priority)}>
          {getPriorityLabel(module.priority)}
        </span>
      </div>
      <div className={styles.learningPathModuleMeta}>
        <span>{getFormatLabel(module.format)}</span>
        <span>{formatMinutes(module.durationMinutes)}</span>
        {module.required && <span>Обязательный блок</span>}
      </div>
      <LearningPathSources sources={module.sources} />
    </article>
  );
}

export function LearningPathSources({
  sources
}: {
  sources: LearningPathSource[];
}) {
  if (sources.length === 0) {
    return (
      <p className={styles.learningPathSourcesFallback}>
        Источник в базе знаний не найден. Рекомендуется уточнить стандарт у
        управляющего.
      </p>
    );
  }

  return (
    <div className={styles.learningPathSources}>
      <span>{sources.length === 1 ? "Источник" : "Источники"}</span>
      <ul>
        {sources.map((source) => (
          <li key={source.documentId}>
            {source.title}
            {source.sourceType && <small>{source.sourceType}</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SavedTimeBadge({
  learningPath
}: {
  learningPath: LearningPath;
}) {
  const saved = learningPath.savedMinutes >= 0;

  return (
    <aside className={saved ? styles.savedTimeBadge : styles.reinforcedTimeBadge}>
      <span>{saved ? "Экономия времени" : "Маршрут усилен"}</span>
      <strong>
        {saved
          ? formatMinutes(learningPath.savedMinutes)
          : `+${formatMinutes(Math.abs(learningPath.savedMinutes))}`}
      </strong>
      <p>
        {saved
          ? `${learningPath.savedPercent}% меньше стандартного маршрута`
          : "Дополнительные минуты добавлены из-за критичных тем и mentor task"}
      </p>
    </aside>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TopicSummaryGroup({
  title,
  topics,
  emptyText
}: {
  title: string;
  topics: LearningPathTopicSummary[];
  emptyText: string;
}) {
  return (
    <div className={styles.learningPathTopicGroup}>
      <h2>{title}</h2>
      {topics.length === 0 ? (
        <p className={styles.emptyStateText}>{emptyText}</p>
      ) : (
        <ul>
          {topics.map((topic) => (
            <li key={topic.topicId}>
              <strong>{topic.title}</strong>
              <span>{topic.scorePercent}%</span>
              <p>{topic.reason}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getFormatLabel(format: LearningModuleFormat) {
  const labels: Record<LearningModuleFormat, string> = {
    summary: "Краткое резюме",
    short_module: "Короткий модуль",
    full_module: "Полный модуль",
    practice: "Практика",
    mentor_task: "Задача наставнику",
    check: "Проверка"
  };

  return labels[format];
}

function getPriorityLabel(priority: LearningPriority) {
  if (priority === "high") {
    return "Высокий приоритет";
  }

  if (priority === "medium") {
    return "Средний приоритет";
  }

  return "Низкий приоритет";
}

function getPriorityClassName(priority: LearningPriority) {
  if (priority === "high") {
    return styles.priorityHigh;
  }

  if (priority === "medium") {
    return styles.priorityMedium;
  }

  return styles.priorityLow;
}

function formatMinutes(minutes: number) {
  return `${minutes} минут`;
}
