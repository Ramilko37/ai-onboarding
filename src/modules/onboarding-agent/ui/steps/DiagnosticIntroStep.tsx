import { ArrowLeft, ArrowRight } from "lucide-react";
import type { EmployeeProfile } from "../../model/types";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";
import styles from "../OnboardingAgentPage.module.css";

export function DiagnosticIntroStep({
  employee,
  onBack,
  onStart
}: {
  employee: EmployeeProfile;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <section className={styles.diagnosticPanel}>
      <div className={styles.sectionHeader}>
        <p className={styles.kicker}>Шаг 3</p>
        <h1>Мягкое объяснение перед диагностикой</h1>
        <p>
          Сценарий для сотрудника: {employee.name}, роль —{" "}
          {getRoleLabel(employee.role).toLowerCase()}.
        </p>
      </div>

      <article className={styles.diagnosticCopy}>
        <h2>Сейчас будет короткая диагностика.</h2>
        <p>Это не экзамен и не проверка профпригодности.</p>
        <p>Она нужна, чтобы понять:</p>
        <ul>
          <li>какие темы ты уже знаешь;</li>
          <li>что можно сократить;</li>
          <li>на чём лучше сфокусироваться в первые дни.</li>
        </ul>
        <p>
          Так мы не будем тратить твоё время на лишнее обучение и соберём
          персональный маршрут именно под тебя.
        </p>
      </article>

      <div className={styles.actions}>
        <SecondaryButton icon={<ArrowLeft aria-hidden="true" />} onClick={onBack}>
          Вернуться к карте
        </SecondaryButton>
        <PrimaryButton icon={<ArrowRight aria-hidden="true" />} onClick={onStart}>
          Начать диагностику
        </PrimaryButton>
      </div>
    </section>
  );
}
