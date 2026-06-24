import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ListChecks,
  Minus,
  Sparkles,
  Users,
} from "lucide-react";
import type {
  DiagnosticResult,
  EmployeeProfile,
  TopicScore,
} from "../../model/types";
import {
  MayakActionBar,
  MayakBadge,
  MayakInsightCard,
  MayakLevelPill,
  MayakPanel,
  MayakProgressRing,
  MayakScrollHint,
  type MayakSupportLevel,
} from "@/shared/ui/mayak";
import { getRecommendationLabel } from "../../lib/getRecommendationLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";

function topicLevel(topic: TopicScore): MayakSupportLevel {
  if (topic.status === "strong") return "confident";
  if (topic.status === "good") return "shorter";
  if (topic.scorePercent === 0) return "start";
  return "support";
}

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

  const groups: Array<{ title: string; hint: string; topics: TopicScore[] }> = [
    { title: "В маршрут добавим", hint: "разберём подробно", topics: reinforcedTopics },
    { title: "Пройдём кратко", hint: "уже знакомо", topics: skippableTopics },
    { title: "Обязательные стандарты", hint: "пройдём всегда", topics: result.requiredTopics },
  ];

  return (
    <MayakPanel padding="lg" className="grid h-full min-h-0 gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="flex min-h-0 flex-col gap-3">
        <MayakPanel variant="deep" padding="md">
          <div className="grid gap-3 sm:grid-cols-[1fr_96px] sm:items-center">
            <div>
              <MayakBadge tone="accent">
                <Sparkles className="mr-1.5 h-3 w-3" aria-hidden="true" />
                основа маршрута собрана
              </MayakBadge>
              <h1 className="mt-2 text-pretty text-xl font-semibold leading-tight tracking-tight text-deep-foreground">
                Маяк собрал маршрут для {employee.name.split(" ")[0]}
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-deep-muted">
                Начнём с тем, где пригодится поддержка, а знакомые блоки пройдём короче. Это не
                оценка — это ваш персональный план.
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <MayakProgressRing
                value={result.totalScorePercent}
                label={getRoleLabel(result.role)}
                size={92}
              />
            </div>
          </div>
        </MayakPanel>

        <div className="grid min-h-0 flex-1 content-start gap-2 sm:grid-cols-2">
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
          <PrimaryButton onClick={onBuildRoute}>
            Собрать маршрут
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
        </MayakActionBar>
      </div>

      <MayakPanel padding="sm" className="flex min-h-0 flex-col shadow-none">
        <div className="mb-2 flex shrink-0 items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Как Маяк настроит маршрут
          </h2>
          <span className="text-xs text-muted-foreground">{result.topicScores.length} тем</span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-3">
            {groups.map((group) =>
              group.topics.length === 0 ? null : (
                <div key={group.title}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <h3 className="text-xs font-semibold tracking-tight text-foreground">
                      {group.title}
                    </h3>
                    <span className="text-[11px] text-muted-foreground">{group.hint}</span>
                  </div>
                  <ul className="grid gap-1.5">
                    {group.topics.map((topic) => (
                      <li
                        key={topic.topicId}
                        className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card px-3 py-2"
                      >
                        <span className="min-w-0 truncate text-xs font-medium text-foreground">
                          {topic.topicTitle}
                        </span>
                        <MayakLevelPill level={topicLevel(topic)} />
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}

            <details className="group rounded-2xl border border-border bg-card/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-xs font-semibold text-foreground transition hover:bg-primary/5">
                Подробности по темам
                <ChevronDown
                  className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="divide-y divide-border border-t border-border">
                {result.topicScores.map((topic) => (
                  <article
                    key={topic.topicId}
                    className="grid gap-1 px-3 py-2.5 sm:grid-cols-[1.4fr_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <strong className="block truncate text-xs font-medium text-foreground">
                        {topic.topicTitle}
                      </strong>
                      <small className="text-[11px] text-muted-foreground">
                        {topic.correctAnswers} из {topic.totalQuestions} · {getRecommendationLabel(topic.recommendation)}
                      </small>
                    </div>
                    <div className="flex sm:justify-end">
                      <MayakLevelPill level={topicLevel(topic)} />
                    </div>
                  </article>
                ))}
              </div>
            </details>
          </div>
        </div>
        {result.topicScores.length > 6 && <MayakScrollHint>прокрутите темы</MayakScrollHint>}
      </MayakPanel>
    </MayakPanel>
  );
}

function pluralTopics(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "тему";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "темы";
  return "тем";
}
