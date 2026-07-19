import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ListChecks,
  Minus,
  Sparkles,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type {
  DiagnosticResult,
  EmployeeProfile,
} from "../../model/types";
import {
  MayakActionBar,
  MayakBadge,
  MayakInsightCard,
  MayakLinkButton,
  MayakPanel,
  MayakProgressRing,
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
  const mentorTopics = result.topicScores.filter(
    (topic) => topic.recommendation === "full_module_with_mentor",
  );
  const readiness = getReadiness(result);
  const topStrongTopics = result.strongTopics.slice(0, 3);
  const topWeakTopics = result.weakTopics.slice(0, 3);

  const supportCards = [
    {
      icon: BookOpen,
      tone: "primary" as const,
      title: "Начнём с поддержки",
      description: `${reinforcedTopics.length} ${pluralTopics(reinforcedTopics.length)} разберём подробно и спокойно.`,
    },
    {
      icon: Users,
      tone: "accent" as const,
      title: "Подключим наставника",
      description:
        mentorTopics.length > 0
          ? `Там, где нужно — рядом будет наставник (${mentorTopics.length}).`
          : "Наставник на связи, если появятся вопросы.",
    },
    {
      icon: Minus,
      tone: "neutral" as const,
      title: "Сократим знакомое",
      description: `${skippableTopics.length} ${pluralTopics(skippableTopics.length)} пройдём короче.`,
    },
    {
      icon: ListChecks,
      tone: "neutral" as const,
      title: "Соберём сегодняшние шаги",
      description: "3 понятные задачи появятся в вашем маршруте.",
    },
  ];

  return (
    <MayakPanel padding="lg" className="grid h-full min-h-0 gap-4">
      <div className="flex min-h-0 flex-col gap-3">
        <MayakPanel variant="deep" padding="md">
          <div className="grid gap-4 md:grid-cols-[1fr_112px] md:items-center">
            <div>
              <MayakBadge tone="accent">
                <Sparkles className="mr-1.5 h-3 w-3" aria-hidden="true" />
                результат диагностики
              </MayakBadge>
              <h1 className="mt-2 font-brand text-pretty text-3xl font-normal leading-[1.08] tracking-tight text-deep-foreground sm:text-4xl">
                {readiness.title}
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-deep-muted">
                {readiness.description}
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <MayakProgressRing
                value={result.totalScorePercent}
                label="итог"
                size={112}
                className="text-deep-foreground"
                textClassName="text-deep-foreground"
              />
            </div>
          </div>
        </MayakPanel>

        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.9fr]">
          <ResultTopicPanel
            icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            title="Сильные темы"
            topics={topStrongTopics.map((topic) => topic.topicTitle)}
            empty="Сильные темы появятся после повторной практики"
          />
          <ResultTopicPanel
            icon={<BookOpen className="h-4 w-4" aria-hidden="true" />}
            title="Зоны развития"
            topics={topWeakTopics.map((topic) => topic.topicTitle)}
            empty="Только контрольные повторы"
          />
          <ResultTopicPanel
            icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
            title="Критично проверить"
            topics={result.criticalTopics.map((topic) => topic.topicTitle).slice(0, 3)}
            empty="Критичных тем нет"
          />
        </div>

        <div className="grid min-h-0 flex-1 content-start gap-2 sm:grid-cols-2" id="result-details">
          {supportCards.map((card) => (
            <MayakInsightCard
              key={card.title}
              tone={card.tone}
              icon={<card.icon className="h-4 w-4" aria-hidden="true" />}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        <MayakActionBar className="mt-auto justify-between border-t border-border pt-4">
          <SecondaryButton onClick={onBackToDiagnostic}>К вопросам</SecondaryButton>
          <div className="flex flex-wrap gap-2">
            <MayakLinkButton href="#result-details" variant="secondary">
              Показать подробности
            </MayakLinkButton>
            <PrimaryButton onClick={onBuildRoute}>
              Собрать план развития
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </PrimaryButton>
          </div>
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

function getReadiness(result: DiagnosticResult) {
  if (result.totalScorePercent < 65 || result.criticalTopics.length >= 2) {
    return {
      title: "Нужна поддержка перед самостоятельной сменой",
      description:
        "Сначала усилим критичные темы с наставником: так бариста быстрее выйдет на стандарт без лишнего давления.",
    };
  }

  if (result.totalScorePercent < 80 || result.criticalTopics.length > 0) {
    return {
      title: "Можно выходить в смену с точечным контролем",
      description:
        "База уже есть, но отдельные темы лучше закрепить на практике и повторно проверить на День 7.",
    };
  }

  return {
    title: "Готовность высокая, оставляем контроль стандартов",
    description:
      "Сильные темы пройдём короче, обязательные стандарты всё равно останутся в плане развития.",
  };
}

function pluralTopics(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "тему";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "темы";
  return "тем";
}
