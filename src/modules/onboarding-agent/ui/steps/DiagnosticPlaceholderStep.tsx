import type { EmployeeProfile } from "../../model/types";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";
import styles from "../OnboardingAgentPage.module.css";

export function DiagnosticPlaceholderStep({
  employee,
  onBack,
  onReset
}: {
  employee: EmployeeProfile;
  onBack: () => void;
  onReset: () => void;
}) {
  return (
    <section className={styles.placeholderPanel}>
      <p className={styles.kicker}>Следующий этап</p>
      <h1>Персональная траектория обучения будет реализована на следующем этапе.</h1>
      <p>
        На основе диагностики агент соберёт план на 1, 7 и 14 дней для{" "}
        {employee.name}: {getRoleLabel(employee.role).toLowerCase()},{" "}
        {getGradeLabel(employee.grade).toLowerCase()}, точка {employee.location}.
      </p>
      <div className={styles.nextStageGrid}>
        <div>
          <span>1</span>
          <p>Сократит уже знакомые темы, чтобы не тратить время сотрудника.</p>
        </div>
        <div>
          <span>2</span>
          <p>Усилит зоны развития и обязательные блоки по безопасности и стандартам.</p>
        </div>
        <div>
          <span>3</span>
          <p>Добавит повторную проверку и рекомендации управляющему.</p>
        </div>
      </div>
      <div className={styles.actions}>
        <SecondaryButton onClick={onBack}>Вернуться к результатам</SecondaryButton>
        <PrimaryButton onClick={onReset}>Начать сценарий заново</PrimaryButton>
      </div>
    </section>
  );
}
