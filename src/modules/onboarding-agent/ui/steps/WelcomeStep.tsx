import { PrimaryButton } from "../components";
import styles from "../OnboardingAgentPage.module.css";

export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.kicker}>HORECA franchise onboarding</p>
        <h1>AI-агент адаптации сотрудников</h1>
        <p className={styles.lead}>
          Помогает франчайзинговой сети быстрее и точнее обучать новых
          сотрудников.
        </p>
        <p>
          В первый день агент проводит мягкую диагностику знаний, определяет
          сильные и слабые зоны и собирает персональный маршрут обучения на 1, 7
          и 14 дней.
        </p>
        <PrimaryButton onClick={onStart}>
          Начать адаптацию сотрудника
        </PrimaryButton>
      </div>

      <aside className={styles.heroPanel} aria-label="Ценность прототипа">
        <div>
          <span>01</span>
          <p>Не обучаем всех одинаково.</p>
        </div>
        <div>
          <span>02</span>
          <p>Сначала понимаем, что сотрудник уже знает.</p>
        </div>
        <div>
          <span>03</span>
          <p>Затем собираем маршрут под реальные зоны развития.</p>
        </div>
      </aside>
    </section>
  );
}
