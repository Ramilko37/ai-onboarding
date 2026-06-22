import { ArrowLeft, Route } from "lucide-react";
import type { DiagnosticResult, EmployeeProfile, TopicScore } from "../../model/types";
import {
  getRecommendationLabel,
  getStatusLabel
} from "../../lib/getRecommendationLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";
import styles from "../OnboardingAgentPage.module.css";

export function DiagnosticResultStep({
  employee,
  result,
  onBackToDiagnostic,
  onBuildRoute
}: {
  employee: EmployeeProfile;
  result: DiagnosticResult;
  onBackToDiagnostic: () => void;
  onBuildRoute: () => void;
}) {
  const skippableTopics = result.topicScores.filter(
    (topic) =>
      topic.recommendation === "skip_detailed_module" ||
      topic.recommendation === "short_summary"
  );
  const reinforcedTopics = result.topicScores.filter(
    (topic) =>
      topic.recommendation === "full_module" ||
      topic.recommendation === "full_module_with_mentor"
  );

  return (
    <section className={styles.resultPanel}>
      <DiagnosticSummaryCard
        employee={employee}
        result={result}
        skippableCount={skippableTopics.length}
        reinforcedCount={reinforcedTopics.length}
      />

      <div className={styles.resultColumns}>
        <StrongTopicsList topics={result.strongTopics} />
        <WeakTopicsList topics={result.weakTopics} />
        <RequiredTopicsList topics={result.requiredTopics} />
      </div>

      <div className={styles.routeInsightGrid}>
        <section>
          <span>Что можно сократить</span>
          <TopicNameList
            emptyText="Пока нет тем для сокращения: маршрут оставит больше поддержки."
            topics={skippableTopics}
          />
        </section>
        <section>
          <span>Что нужно усилить</span>
          <TopicNameList
            emptyText="Критичных усилений не видно, но обязательные темы останутся в маршруте."
            topics={reinforcedTopics}
          />
        </section>
      </div>

      <section className={styles.topicScoreTable} aria-label="Результаты по темам">
        <div className={styles.topicScoreHeader}>
          <span>Тема</span>
          <span>Результат</span>
          <span>Статус</span>
          <span>Решение</span>
        </div>
        {result.topicScores.map((topic) => (
          <TopicScoreCard key={topic.topicId} topic={topic} />
        ))}
      </section>

      <div className={styles.actions}>
        <SecondaryButton
          icon={<ArrowLeft aria-hidden="true" />}
          onClick={onBackToDiagnostic}
        >
          Вернуться к вопросам
        </SecondaryButton>
        <PrimaryButton icon={<Route aria-hidden="true" />} onClick={onBuildRoute}>
          Сформировать персональный маршрут
        </PrimaryButton>
      </div>
    </section>
  );
}

export function DiagnosticSummaryCard({
  employee,
  result,
  skippableCount,
  reinforcedCount
}: {
  employee: EmployeeProfile;
  result: DiagnosticResult;
  skippableCount: number;
  reinforcedCount: number;
}) {
  return (
    <header className={styles.resultSummaryCard}>
      <div>
        <p className={styles.kicker}>Диагностика завершена</p>
        <h1>Мы собрали стартовый профиль знаний.</h1>
        <p>
          Результат помогает персонализировать обучение для {employee.name}. Он
          не является HR-решением и показывает, где сотруднику будет полезна
          поддержка в первые дни.
        </p>
      </div>
      <div className={styles.scoreDial} aria-label={`Общий результат ${result.totalScorePercent}%`}>
        <strong>{result.totalScorePercent}%</strong>
        <span>{getRoleLabel(result.role)}</span>
      </div>
      <dl className={styles.resultFacts}>
        <div>
          <dt>Сильные зоны</dt>
          <dd>{result.strongTopics.length}</dd>
        </div>
        <div>
          <dt>Зоны развития</dt>
          <dd>{result.weakTopics.length}</dd>
        </div>
        <div>
          <dt>Обязательные блоки</dt>
          <dd>{result.requiredTopics.length}</dd>
        </div>
        <div>
          <dt>Можно сократить</dt>
          <dd>{skippableCount}</dd>
        </div>
        <div>
          <dt>Нужно усилить</dt>
          <dd>{reinforcedCount}</dd>
        </div>
      </dl>
    </header>
  );
}

export function TopicScoreCard({ topic }: { topic: TopicScore }) {
  return (
    <article className={styles.topicScoreRow}>
      <div>
        <span className={styles.topicScoreLabel}>Тема</span>
        <strong>{topic.topicTitle}</strong>
        <small>
          {topic.correctAnswers} из {topic.totalQuestions} ответов по теме
        </small>
      </div>
      <div>
        <span className={styles.topicScoreLabel}>Результат</span>
        <strong>{topic.scorePercent}%</strong>
      </div>
      <div>
        <span className={styles.topicScoreLabel}>Статус</span>
        <span className={getStatusClassName(topic.status)}>
          {getStatusLabel(topic.status)}
        </span>
      </div>
      <div>
        <span className={styles.topicScoreLabel}>Решение</span>
        <TopicRecommendationBadge topic={topic} />
      </div>
    </article>
  );
}

export function TopicRecommendationBadge({ topic }: { topic: TopicScore }) {
  return (
    <span className={styles.recommendationBadge}>
      {topic.required && "Обязательный блок: "}
      {getRecommendationLabel(topic.recommendation)}
    </span>
  );
}

export function StrongTopicsList({ topics }: { topics: TopicScore[] }) {
  return (
    <TopicListCard
      title="Сильные зоны"
      emptyText="Сильные зоны появятся после первых уверенных ответов."
      topics={topics}
    />
  );
}

export function WeakTopicsList({ topics }: { topics: TopicScore[] }) {
  return (
    <TopicListCard
      title="Зоны развития"
      emptyText="Пока нет выраженных зон развития."
      topics={topics}
    />
  );
}

export function RequiredTopicsList({ topics }: { topics: TopicScore[] }) {
  return (
    <TopicListCard
      title="Обязательные блоки"
      emptyText="В этом наборе нет обязательных тем."
      topics={topics}
    />
  );
}

function TopicListCard({
  title,
  emptyText,
  topics
}: {
  title: string;
  emptyText: string;
  topics: TopicScore[];
}) {
  return (
    <section className={styles.topicListCard}>
      <h2>{title}</h2>
      <TopicNameList emptyText={emptyText} topics={topics} />
    </section>
  );
}

function TopicNameList({
  emptyText,
  topics
}: {
  emptyText: string;
  topics: TopicScore[];
}) {
  if (topics.length === 0) {
    return <p>{emptyText}</p>;
  }

  return (
    <ul>
      {topics.map((topic) => (
        <li key={topic.topicId}>{topic.topicTitle}</li>
      ))}
    </ul>
  );
}

function getStatusClassName(status: TopicScore["status"]) {
  if (status === "strong") {
    return styles.statusStrong;
  }

  if (status === "good") {
    return styles.statusGood;
  }

  if (status === "medium_gap") {
    return styles.statusMediumGap;
  }

  return styles.statusCriticalGap;
}
