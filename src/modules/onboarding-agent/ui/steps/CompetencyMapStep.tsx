import { ArrowLeft, ArrowRight } from "lucide-react";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getMilestonesByRole, getTopicsByRole } from "../../lib/getTopicsByRole";
import { getRoleLabel } from "../../lib/getRoleLabel";
import type { EmployeeProfile } from "../../model/types";
import {
  CompetencyMilestoneCard,
  CompetencyTopicCard,
  EmployeeSummaryCard,
  PrimaryButton,
  SecondaryButton
} from "../components";
import styles from "../OnboardingAgentPage.module.css";

export function CompetencyMapStep({
  employee,
  onBack,
  onNext
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
    <section className={styles.stepPanel}>
      <div className={styles.sectionHeader}>
        <p className={styles.kicker}>Шаг 2</p>
        <h1>Карта компетенций для роли «{getRoleLabel(employee.role)}»</h1>
        <p>
          Грейд: {getGradeLabel(employee.grade)}. Агент покажет обязательные
          стандарты и темы, которые можно сократить после диагностики.
        </p>
      </div>

      <EmployeeSummaryCard employee={employee} />

      <div className={styles.statsRow} aria-label="Сводка тем">
        <div>
          <span>{milestones.length}</span>
          <p>контрольные точки</p>
        </div>
        <div>
          <span>{requiredCount}</span>
          <p>обязательных блоков</p>
        </div>
        <div>
          <span>{adaptiveCount}</span>
          <p>адаптивных тем</p>
        </div>
      </div>

      <div className={styles.milestoneGrid}>
        {milestones.map((milestone) => (
          <CompetencyMilestoneCard
            key={`${milestone.role}-${milestone.day}`}
            milestone={milestone}
          />
        ))}
      </div>

      <section className={styles.topicSection}>
        <div className={styles.sectionHeaderCompact}>
          <h2>Темы диагностики</h2>
          <p>
            Обязательные блоки остаются в маршруте как стандарты безопасности и
            качества. Адаптивные темы можно сократить или усилить по результатам.
          </p>
        </div>

        <div className={styles.topicGrid}>
          {topics.map((topic) => (
            <CompetencyTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <div className={styles.actions}>
        <SecondaryButton icon={<ArrowLeft aria-hidden="true" />} onClick={onBack}>
          Назад к профилю
        </SecondaryButton>
        <PrimaryButton icon={<ArrowRight aria-hidden="true" />} onClick={onNext}>
          Перейти к объяснению диагностики
        </PrimaryButton>
      </div>
    </section>
  );
}
