import type { DiagnosticResult, EmployeeProfile, TopicScore } from "../../model/types";
import {
  MayakActionBar,
  MayakBadge,
  MayakPanel,
  MayakProgressRing,
  MayakSectionHeader,
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
    <MayakPanel padding="lg" className="grid h-full min-h-0 gap-4 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="flex min-h-0 flex-col gap-3">
        <DiagnosticSummaryCard
          employee={employee}
          result={result}
          skippableCount={skippableTopics.length}
          reinforcedCount={reinforcedTopics.length}
        />

        <div className="grid min-h-0 flex-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
          <StrongTopicsList topics={result.strongTopics} />
          <WeakTopicsList topics={result.weakTopics} />
          <RequiredTopicsList topics={result.requiredTopics} />
        </div>

        <MayakActionBar className="mt-auto">
          <SecondaryButton onClick={onBackToDiagnostic}>К вопросам</SecondaryButton>
          <PrimaryButton onClick={onBuildRoute}>Собрать маршрут</PrimaryButton>
        </MayakActionBar>
      </div>

      <div className="grid min-h-0 gap-3 lg:grid-rows-[0.34fr_1fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          <MayakPanel padding="sm" className="shadow-none">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Можно сократить</h2>
            <TopicNameList
              compact
              emptyText="Пока нет тем для сокращения."
              topics={skippableTopics}
            />
          </MayakPanel>
          <MayakPanel padding="sm" className="shadow-none">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Нужно усилить</h2>
            <TopicNameList
              compact
              emptyText="Критичных усилений нет."
              topics={reinforcedTopics}
            />
          </MayakPanel>
        </div>

        <section className="min-h-0 overflow-hidden rounded-3xl border border-border bg-card/80" aria-label="Результаты по темам">
          <div className="hidden grid-cols-[1.2fr_0.35fr_0.55fr_0.9fr] gap-3 bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground lg:grid">
            <span>Тема</span>
            <span>%</span>
            <span>Статус</span>
            <span>Решение</span>
          </div>
          <div className="h-full divide-y divide-border overflow-y-auto lg:h-[calc(100%-2.25rem)]">
            {result.topicScores.map((topic) => (
              <TopicScoreCard key={topic.topicId} topic={topic} />
            ))}
          </div>
        </section>
      </div>
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
    <MayakPanel variant="deep" padding="md">
      <div className="grid gap-3 sm:grid-cols-[1fr_112px] sm:items-center">
        <MayakSectionHeader
          className="mb-0"
          titleClassName="text-deep-foreground"
          kicker="Диагностика завершена"
          title="Профиль знаний собран"
          description={
            <span className="text-deep-muted">
              Для {employee.name}: что знаем — сокращаем, где пробел — поддерживаем.
            </span>
          }
        />
        <div className="flex justify-center sm:justify-end">
          <MayakProgressRing value={result.totalScorePercent} label={getRoleLabel(result.role)} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        <ResultFact label="сильные" value={result.strongTopics.length} />
        <ResultFact label="развитие" value={result.weakTopics.length} />
        <ResultFact label="обяз." value={result.requiredTopics.length} />
        <ResultFact label="сокр." value={skippableCount} />
        <ResultFact label="усил." value={reinforcedCount} />
      </div>
    </MayakPanel>
  );
}

function ResultFact({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-deep-border bg-white/5 p-2 text-center">
      <p className="text-lg font-semibold text-deep-foreground">{value}</p>
      <p className="text-[10px] text-deep-muted">{label}</p>
    </div>
  );
}

export function TopicScoreCard({ topic }: { topic: TopicScore }) {
  return (
    <article className="grid gap-2 px-4 py-3 lg:grid-cols-[1.2fr_0.35fr_0.55fr_0.9fr] lg:items-center">
      <div>
        <strong className="block text-sm text-foreground">{topic.topicTitle}</strong>
        <small className="mt-0.5 block text-xs text-muted-foreground">
          {topic.correctAnswers} из {topic.totalQuestions} ответов
        </small>
      </div>
      <div className="text-xl font-semibold tracking-tight text-primary">{topic.scorePercent}%</div>
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
    <MayakBadge tone="muted" className="h-auto py-1.5 leading-snug">
      {topic.required && "Обязательный: "}
      {getRecommendationLabel(topic.recommendation)}
    </MayakBadge>
  );
}

export function StrongTopicsList({ topics }: { topics: TopicScore[] }) {
  return (
    <TopicListCard
      title="Сильные зоны"
      tone="success"
      emptyText="Появятся после уверенных ответов."
      topics={topics}
    />
  );
}

export function WeakTopicsList({ topics }: { topics: TopicScore[] }) {
  return (
    <TopicListCard
      title="Зоны развития"
      tone="accent"
      emptyText="Выраженных зон пока нет."
      topics={topics}
    />
  );
}

export function RequiredTopicsList({ topics }: { topics: TopicScore[] }) {
  return (
    <TopicListCard
      title="Обязательные"
      tone="primary"
      emptyText="Нет обязательных тем."
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
    <MayakPanel padding="sm" className="min-h-0 shadow-none">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
        <MayakBadge tone={tone}>{topics.length}</MayakBadge>
      </div>
      <TopicNameList compact emptyText={emptyText} topics={topics} />
    </MayakPanel>
  );
}

function TopicNameList({
  compact = false,
  emptyText,
  topics,
}: {
  compact?: boolean;
  emptyText: string;
  topics: TopicScore[];
}) {
  if (topics.length === 0) {
    return <p className="text-xs leading-relaxed text-muted-foreground">{emptyText}</p>;
  }

  return (
    <ul className={cn("space-y-1.5 text-xs leading-relaxed text-foreground/85", compact && "max-h-20 overflow-y-auto pr-1")}>
      {topics.map((topic) => (
        <li className="flex gap-2" key={topic.topicId}>
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span className="line-clamp-1">{topic.topicTitle}</span>
        </li>
      ))}
    </ul>
  );
}

function getStatusClassName(status: TopicScore["status"]) {
  return cn(
    "inline-flex min-h-6 items-center rounded-full px-2.5 text-[11px] font-medium leading-none",
    status === "strong" && "bg-[color-mix(in_oklch,oklch(0.7_0.12_160)_22%,transparent)] text-[oklch(0.45_0.1_160)]",
    status === "good" && "bg-primary/15 text-primary",
    status === "medium_gap" && "bg-accent text-accent-foreground",
    status === "critical_gap" && "bg-[color-mix(in_oklch,oklch(0.7_0.13_35)_22%,transparent)] text-[oklch(0.5_0.13_32)]",
  );
}
