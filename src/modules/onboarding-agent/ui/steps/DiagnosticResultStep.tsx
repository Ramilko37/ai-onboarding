import {
  ArrowRight,
  BookOpen,
  ListChecks,
  Minus,
  Sparkles,
  Users,
} from "lucide-react";
import type {
  DiagnosticResult,
  EmployeeProfile,
} from "../../model/types";
import {
  MayakActionBar,
  MayakBadge,
  MayakInsightCard,
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
                основа маршрута собрана
              </MayakBadge>
              <h1 className="mt-2 text-pretty text-xl font-semibold leading-tight tracking-tight text-deep-foreground">
                Маршрут Valle Sanchez собран для {employee.name.split(" ")[0]}
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-deep-muted">
                Начнём с тем, где пригодится поддержка, а знакомые блоки пройдём короче. Это не
                оценка — это ваш персональный план.
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
