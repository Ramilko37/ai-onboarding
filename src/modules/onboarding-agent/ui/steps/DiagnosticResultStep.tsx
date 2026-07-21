import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type {
  DiagnosticResult,
  EmployeeProfile,
} from "../../model/types";
import {
  MayakActionBar,
  MayakBadge,
  MayakPanel,
} from "@/shared/ui/mayak";
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
  const topStrongTopics = result.strongTopics.slice(0, 3);
  const focusTopics = [...result.criticalTopics, ...result.weakTopics]
    .filter((topic, index, topics) => topics.findIndex((item) => item.topicId === topic.topicId) === index)
    .slice(0, 3);

  return (
    <MayakPanel padding="lg" className="grid h-full min-h-0 gap-4">
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-col gap-3">
        <MayakPanel variant="deep" padding="md">
          <MayakBadge tone="accent"><Sparkles className="mr-1.5 h-3 w-3" aria-hidden="true" />Диагностика завершена</MayakBadge>
          <h1 className="mt-2 font-brand text-pretty text-3xl font-normal leading-[1.08] tracking-tight text-deep-foreground sm:text-4xl">Персональный фокус готов</h1>
          <p className="mt-2 text-sm leading-relaxed text-deep-muted">Мы добавили эти темы в первые задачи вашего маршрута.</p>
        </MayakPanel>

        <div className="grid gap-3 sm:grid-cols-2">
          <ResultTopicPanel
            icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            title="Уже знакомо"
            topics={topStrongTopics.map((topic) => topic.topicTitle)}
            empty="Продолжим опираться на ваши ответы в маршруте"
          />
          <ResultTopicPanel
            icon={<BookOpen className="h-4 w-4" aria-hidden="true" />}
            title="На этом сфокусируемся"
            topics={focusTopics.map((topic) => topic.topicTitle)}
            empty="Начнём с обязательных стандартов точки"
          />
        </div>

        <MayakActionBar className="mt-auto justify-between border-t border-border pt-4">
          <SecondaryButton onClick={onBackToDiagnostic}>К вопросам</SecondaryButton>
          <PrimaryButton onClick={onBuildRoute}>Перейти к задачам <ArrowRight className="h-4 w-4" aria-hidden="true" /></PrimaryButton>
        </MayakActionBar>
      </div>
    </MayakPanel>
  );
}

function ResultTopicPanel({
  icon,
  title,
  topics,
  empty,
}: {
  icon: ReactNode;
  title: string;
  topics: string[];
  empty: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(topics.length > 0 ? topics : [empty]).map((topic) => (
          <span
            className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] text-foreground"
            key={topic}
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
