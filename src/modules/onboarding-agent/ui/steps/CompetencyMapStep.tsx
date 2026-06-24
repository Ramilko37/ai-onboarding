import { ArrowRight, MapPin, Sparkles, Stars } from "lucide-react";
import {
  MayakActionBar,
  MayakIconBadge,
  MayakInsightCard,
  MayakPanel,
  MayakScrollHint,
  MayakSectionHeader,
  MayakSectionTitle,
} from "@/shared/ui/mayak";
import type { CompetencyTopic } from "../../model/types";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getMilestonesByRole, getTopicsByRole } from "../../lib/getTopicsByRole";
import { getRoleLabel } from "../../lib/getRoleLabel";
import type { EmployeeProfile } from "../../model/types";
import {
  CompetencyMilestoneCard,
  CompetencyTopicCard,
  EmployeeSummaryCard,
  PrimaryButton,
  SecondaryButton,
  StatGrid,
} from "../components";

export function CompetencyMapStep({
  employee,
  onBack,
  onNext,
}: {
  employee: EmployeeProfile;
  onBack: () => void;
  onNext: () => void;
}) {
  const milestones = getMilestonesByRole(employee.role);
  const topics = getTopicsByRole(employee.role);
  const requiredCount = topics.filter((topic) => topic.required).length;
  const adaptiveCount = topics.length - requiredCount;

  const topicGroups: Array<{ title: string; hint: string; topics: CompetencyTopic[] }> = [
    {
      title: "Обязательные стандарты",
      hint: "пройдём всегда",
      topics: topics.filter((topic) => topic.required),
    },
    {
      title: "Высокое влияние на качество",
      hint: "усилим при необходимости",
      topics: topics.filter((topic) => !topic.required && topic.importance === "high"),
    },
    {
      title: "Можно сократить",
      hint: "если уже знакомо",
      topics: topics.filter((topic) => !topic.required && topic.importance !== "high"),
    },
  ];

  return (
    <MayakPanel padding="lg" className="grid h-full min-h-0 gap-4 lg:grid-cols-[0.95fr_1.35fr]">
      <div className="flex min-h-0 flex-col gap-3">
        <MayakSectionHeader
          className="mb-0"
          kicker="Шаг 2 · карта"
          title={`Карта роли «${getRoleLabel(employee.role)}»`}
          description={`Грейд: ${getGradeLabel(employee.grade)}. Видим весь маршрут сразу: контрольные точки, обязательные блоки и адаптивные темы.`}
        />

        <EmployeeSummaryCard employee={employee} />

        <StatGrid
          stats={[
            { value: milestones.length, label: "точки", description: "день 1, 7 и 14" },
            { value: requiredCount, label: "обязательные", description: "безопасность и качество" },
            { value: adaptiveCount, label: "адаптивные", description: "усилить или сократить" },
          ]}
        />

        <MayakInsightCard
          tone="primary"
          icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
          title="Зачем диагностика"
          description="Она настроит карту под вас: какие темы сократить, а какие усилить поддержкой."
        />

        <MayakActionBar className="mt-auto">
          <SecondaryButton onClick={onBack}>Назад</SecondaryButton>
          <PrimaryButton onClick={onNext}>
            К диагностике
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
        </MayakActionBar>
      </div>

      <div className="grid min-h-0 gap-3 lg:grid-rows-[0.76fr_1fr]">
        <MayakPanel padding="sm" className="min-h-0 shadow-none">
          <MayakSectionTitle
            icon={
              <MayakIconBadge>
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              </MayakIconBadge>
            }
            title="Контрольные точки"
            description="Короткая карта без перегруза"
          />
          <div className="grid h-[calc(100%-2.75rem)] min-h-0 gap-2 lg:grid-cols-3">
            {milestones.map((milestone) => (
              <CompetencyMilestoneCard
                key={`${milestone.role}-${milestone.day}`}
                milestone={milestone}
              />
            ))}
          </div>
        </MayakPanel>

        <MayakPanel padding="sm" className="flex min-h-0 flex-col shadow-none">
          <MayakSectionTitle
            icon={
              <MayakIconBadge>
                <Stars className="h-4 w-4 text-primary" aria-hidden="true" />
              </MayakIconBadge>
            }
            title="Темы диагностики"
            description="Сгруппированы по тому, как Маяк настроит маршрут"
          />
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="grid gap-3">
              {topicGroups.map((group) =>
                group.topics.length === 0 ? null : (
                  <div key={group.title}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                      <h4 className="text-xs font-semibold tracking-tight text-foreground">
                        {group.title}
                      </h4>
                      <span className="text-[11px] text-muted-foreground">{group.hint}</span>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {group.topics.map((topic) => (
                        <CompetencyTopicCard key={topic.id} topic={topic} />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
          {topics.length > 6 && <MayakScrollHint>прокрутите темы</MayakScrollHint>}
        </MayakPanel>
      </div>
    </MayakPanel>
  );
}
