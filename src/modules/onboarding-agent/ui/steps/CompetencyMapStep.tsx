import { MapPin, Stars } from "lucide-react";
import {
  MayakActionBar,
  MayakIconBadge,
  MayakPanel,
  MayakSectionHeader,
  MayakSectionTitle,
} from "@/shared/ui/mayak";
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

        <MayakActionBar className="mt-auto">
          <SecondaryButton onClick={onBack}>Назад</SecondaryButton>
          <PrimaryButton onClick={onNext}>К диагностике</PrimaryButton>
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

        <MayakPanel padding="sm" className="min-h-0 shadow-none">
          <MayakSectionTitle
            icon={
              <MayakIconBadge>
                <Stars className="h-4 w-4 text-primary" aria-hidden="true" />
              </MayakIconBadge>
            }
            title="Темы диагностики"
            description="Если тем много, скроллится только эта карточка"
          />
          <div className="grid max-h-[calc(100%-2.75rem)] min-h-0 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
            {topics.map((topic) => (
              <CompetencyTopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </MayakPanel>
      </div>
    </MayakPanel>
  );
}
