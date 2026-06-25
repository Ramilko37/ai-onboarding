import { ArrowRight, Sparkles } from "lucide-react";
import {
  MayakActionBar,
  MayakInsightCard,
  MayakPanel,
  MayakSectionHeader,
} from "@/shared/ui/mayak";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getMilestonesByRole, getTopicsByRole } from "../../lib/getTopicsByRole";
import { getRoleLabel } from "../../lib/getRoleLabel";
import type { EmployeeProfile } from "../../model/types";
import {
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
    <MayakPanel padding="lg" className="grid h-full min-h-0 gap-4">
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
    </MayakPanel>
  );
}
