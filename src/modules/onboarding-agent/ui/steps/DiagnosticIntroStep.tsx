import type { EmployeeProfile } from "../../model/types";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";
import styles from "../OnboardingAgentPage.module.css";

const diagnosticPromises = [
  "Это не экзамен и не HR-решение",
  "Сильные темы будут сокращены",
  "Зоны развития получат больше практики"
];

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
        <p className={styles.kicker}>Перед диагностикой</p>
        <h1>Короткая проверка, чтобы не учить лишнему</h1>
        <p>
          Сценарий для сотрудника: {employee.name}, роль —{" "}
          {getRoleLabel(employee.role).toLowerCase()}.
        </p>
      </div>

      <article className={styles.diagnosticCopy}>
        <div>
          <h2>Диагностика нужна, чтобы собрать маршрут под человека.</h2>
          <p>
            Вопросы помогут понять, какие стандарты уже знакомы, какие темы можно
            пройти быстрее, а где лучше добавить практику или поддержку в смене.
          </p>
        </div>
        <div className={styles.diagnosticPromiseGrid}>
          {diagnosticPromises.map((promise, index) => (
            <div key={promise}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{promise}</p>
            </div>
          ))}
        </div>
      </article>

      <div className={styles.actions}>
        <SecondaryButton onClick={onBack}>Вернуться к карте</SecondaryButton>
        <PrimaryButton onClick={onStart}>Начать диагностику</PrimaryButton>
      </div>
    </section>
  );
}
