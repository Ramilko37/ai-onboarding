import type { DiagnosticResult, EmployeeProfile, TopicScore } from "../../model/types";
import {
  MayakActionBar,
  MayakBadge,
  MayakPanel,
  MayakProgressRing,
  MayakSectionHeader,
  MayakStatCard,
  cn,
} from "@/shared/ui/mayak";
import {
  getRecommendationLabel,
  getStatusLabel,
} from "../../lib/getRecommendationLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";

export function DiagnosticResultStep({
  employee,
  result,
  onBackToDiagnostic,
  onBuildRoute,
}: {
  employee: EmployeeProfile;
  result: DiagnosticResult;
  onBackToDiagnostic: () => void;
  onBuildRoute: () => void;
}) {
  const skippableTopics = result.topicScores.filter(
    (topic) =>
      topic.recommendation === "skip_detailed_module" ||
      topic.recommendation === "short_summary",
  );
  const reinforcedTopics = result.topicScores.filter(
    (topic) =>
      topic.recommendation === "full_module" ||
      topic.recommendation === "full_module_with_mentor",
  );

  return (
    <MayakPanel padding="lg" className="space-y-5">
      <DiagnosticSummaryCard
        employee={employee}
        result={result}
        skippableCount={skippableTopics.length}
        reinforcedCount={reinforcedTopics.length}
      />

      <div className="grid gap-3 lg:grid-cols-3">
        <StrongTopicsList topics={result.strongTopics} />
        <WeakTopicsList topics={result.weakTopics} />
        <RequiredTopicsList topics={result.requiredTopics} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <MayakPanel padding="md" className="shadow-none">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Что можно сократить</h2>
          <TopicNameList
            emptyText="Пока нет тем для сокращения: маршрут оставит больше поддержки."
            topics={skippableTopics}
          />
        </MayakPanel>
        <MayakPanel padding="md" className="shadow-none">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Что нужно усилить</h2>
          <TopicNameList
            emptyText="Критичных усилений не видно, но обязательные темы останутся в маршруте."
            topics={reinforcedTopics}
          />
        </MayakPanel>
      </div>

      <section className="overflow-hidden rounded-3xl border border-border bg-card/80" aria-label="Результаты по темам">
        <div className="hidden grid-cols-[1.2fr_0.35fr_0.55fr_0.9fr] gap-3 bg-secondary px-5 py-3 text-xs font-semibold text-secondary-foreground lg:grid">
          <span>Тема</span>
          <span>Результат</span>
          <span>Статус</span>
          <span>Решение</span>
        </div>
        <div className="divide-y divide-border">
          {result.topicScores.map((topic) => (
            <TopicScoreCard key={topic.topicId} topic={topic} />
          ))}
        </div>
      </section>

      <MayakActionBar>
        <SecondaryButton onClick={onBackToDiagnostic}>Вернуться к вопросам</SecondaryButton>
        <PrimaryButton onClick={onBuildRoute}>Сформировать персональный маршрут</PrimaryButton>
      </MayakActionBar>
    </MayakPanel>
  );
}

export function DiagnosticSummaryCard({
  employee,
  result,
  skippableCount,
  reinforcedCount,
}: {
  employee: EmployeeProfile;
  result: DiagnosticResult;
  skippableCount: number;
  reinforcedCount: number;
}) {
  return (
    <MayakPanel variant="deep" padding="lg">
      <div className="grid gap-6 lg:grid-cols-[1fr_180px_0.7fr] lg:items-center">
        <MayakSectionHeader
          className="mb-0"
          titleClassName="text-deep-foreground"
          kicker="Диагностика завершена"
          title="Мы собрали стартовый профиль знаний"
          description={
            <span className="text-deep-muted">
              Результат помогает персонализировать обучение для {employee.name}. Он не является HR-решением и показывает, где сотруднику будет полезна поддержка в первые дни.
            </span>
          }
        />
        <div className="flex justify-center">
          <MayakProgressRing value={result.totalScorePercent} label={getRoleLabel(result.role)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <ResultFact label="Сильные зоны" value={result.strongTopics.length} />
          <ResultFact label="Зоны развития" value={result.weakTopics.length} />
          <ResultFact label="Обязательные блоки" value={result.requiredTopics.length} />
          <ResultFact label="Можно сократить" value={skippableCount} />
          <ResultFact label="Нужно усилить" value={reinforcedCount} />
        </div>
      </div>
    </MayakPanel>
  );
}

function ResultFact({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-t border-deep-border pt-3">
      <p className="text-xs text-deep-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-deep-foreground">{value}</p>
    </div>
  );
}

export function TopicScoreCard({ topic }: { topic: TopicScore }) {
  return (
    <article className="grid gap-3 px-5 py-4 lg:grid-cols-[1.2fr_0.35fr_0.55fr_0.9fr] lg:items-center">
      <div>
        <strong className="block text-sm text-foreground">{topic.topicTitle}</strong>
        <small className="mt-1 block text-xs text-muted-foreground">
          {topic.correctAnswers} из {topic.totalQuestions} ответов по теме
        </small>
      </div>
      <MayakStatCard
        className="p-3 lg:border-transparent lg:bg-transparent lg:p-0"
        value={`${topic.scorePercent}%`}
        label=""
      />
      <div>
        <span className={getStatusClassName(topic.status)}>{getStatusLabel(topic.status)}</span>
      </div>
      <div>
        <TopicRecommendationBadge topic={topic} />
      </div>
    </article>
  );
}

export function TopicRecommendationBadge({ topic }: { topic: TopicScore }) {
  return (
    <MayakBadge tone="muted" className="h-auto py-2 leading-snug">
      {topic.required && "Обязательный блок: "}
      {getRecommendationLabel(topic.recommendation)}
    </MayakBadge>
  );
}

export function StrongTopicsList({ topics }: { topics: TopicScore[] }) {
  return (
    <TopicListCard
      title="Сильные зоны"
      tone="success"
      emptyText="Сильные зоны появятся после первых уверенных ответов."
      topics={topics}
    />
  );
}

export function WeakTopicsList({ topics }: { topics: TopicScore[] }) {
  return (
    <TopicListCard
      title="Зоны развития"
      tone="accent"
      emptyText="Пока нет выраженных зон развития."
      topics={topics}
    />
  );
}

export function RequiredTopicsList({ topics }: { topics: TopicScore[] }) {
  return (
    <TopicListCard
      title="Обязательные блоки"
      tone="primary"
      emptyText="В этом наборе нет обязательных тем."
      topics={topics}
    />
  );
}

function TopicListCard({
  title,
  tone,
  emptyText,
  topics,
}: {
  title: string;
  tone: "primary" | "accent" | "success";
  emptyText: string;
  topics: TopicScore[];
}) {
  return (
    <MayakPanel padding="md" className="shadow-none">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        <MayakBadge tone={tone}>{topics.length}</MayakBadge>
      </div>
      <TopicNameList emptyText={emptyText} topics={topics} />
    </MayakPanel>
  );
}

function TopicNameList({
  emptyText,
  topics,
}: {
  emptyText: string;
  topics: TopicScore[];
}) {
  if (topics.length === 0) {
    return <p className="text-sm leading-relaxed text-muted-foreground">{emptyText}</p>;
  }

  return (
    <ul className="space-y-2 text-sm leading-relaxed text-foreground/85">
      {topics.map((topic) => (
        <li className="flex gap-2" key={topic.topicId}>
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span>{topic.topicTitle}</span>
        </li>
      ))}
    </ul>
  );
}

function getStatusClassName(status: TopicScore["status"]) {
  return cn(
    "inline-flex min-h-7 items-center rounded-full px-3 text-xs font-medium leading-none",
    status === "strong" && "bg-[color-mix(in_oklch,oklch(0.7_0.12_160)_22%,transparent)] text-[oklch(0.45_0.1_160)]",
    status === "good" && "bg-primary/15 text-primary",
    status === "medium_gap" && "bg-accent text-accent-foreground",
    status === "critical_gap" && "bg-[color-mix(in_oklch,oklch(0.7_0.13_35)_22%,transparent)] text-[oklch(0.5_0.13_32)]",
  );
}
