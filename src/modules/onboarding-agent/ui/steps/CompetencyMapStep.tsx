import { MapPin, Stars } from "lucide-react";
import { MayakActionBar, MayakIconBadge, MayakPanel, MayakSectionHeader, MayakSectionTitle } from "@/shared/ui/mayak";
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
    <MayakPanel padding="lg" className="space-y-6">
      <MayakSectionHeader
        kicker="Шаг 2 · карта пути"
        title={`Карта компетенций для роли «${getRoleLabel(employee.role)}»`}
        description={`Грейд: ${getGradeLabel(employee.grade)}. Маяк покажет обязательные стандарты и темы, которые можно сократить после диагностики.`}
      />

      <EmployeeSummaryCard employee={employee} />

      <StatGrid
        stats={[
          { value: milestones.length, label: "контрольные точки", description: "день 1, 7 и 14" },
          { value: requiredCount, label: "обязательных блоков", description: "стандарты качества и безопасности" },
          { value: adaptiveCount, label: "адаптивных тем", description: "можно усилить или сократить" },
        ]}
      />

      <section>
        <MayakSectionTitle
          icon={
            <MayakIconBadge>
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            </MayakIconBadge>
          }
          title="Контрольные точки"
          description="Путь сотрудника выглядит как спокойная карта, а не список требований"
        />
        <div className="grid gap-3 lg:grid-cols-3">
          {milestones.map((milestone) => (
            <CompetencyMilestoneCard
              key={`${milestone.role}-${milestone.day}`}
              milestone={milestone}
            />
          ))}
        </div>
      </section>

      <section>
        <MayakSectionTitle
          icon={
            <MayakIconBadge>
              <Stars className="h-4 w-4 text-primary" aria-hidden="true" />
            </MayakIconBadge>
          }
          title="Темы диагностики"
          description="Обязательные блоки остаются в маршруте, а адаптивные темы Маяк настроит по результатам."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {topics.map((topic) => (
            <CompetencyTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <MayakActionBar>
        <SecondaryButton onClick={onBack}>Назад к профилю</SecondaryButton>
        <PrimaryButton onClick={onNext}>Перейти к объяснению диагностики</PrimaryButton>
      </MayakActionBar>
    </MayakPanel>
  );
}
