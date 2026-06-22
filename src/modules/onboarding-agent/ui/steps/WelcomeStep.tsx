import { PrimaryButton } from "../components";
import styles from "../OnboardingAgentPage.module.css";

const heroMetrics = [
  { value: "3", label: "этапа маршрута" },
  { value: "14", label: "дней адаптации" },
  { value: "0", label: "лишних модулей" }
];

export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.kicker}>AI onboarding journey</p>
        <h1>Онбординг, который подстраивается под новичка</h1>
        <p className={styles.lead}>
          Не универсальный курс для всех, а персональная траектория по роли,
          опыту и реальным пробелам после диагностики.
        </p>
        <p>
          Агент мягко проверяет стартовые знания, сокращает уже знакомые темы и
          усиливает зоны, где сотруднику нужна поддержка в первые смены.
        </p>

        <div className={styles.heroActionRow}>
          <PrimaryButton onClick={onStart}>Запустить сценарий адаптации</PrimaryButton>
          <span>Демо без backend, RAG и внешних интеграций</span>
        </div>

        <div className={styles.heroMetrics} aria-label="Ключевые параметры маршрута">
          {heroMetrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      <aside className={styles.heroPanel} aria-label="Превью персонального маршрута">
        <div className={styles.agentCard}>
          <div className={styles.agentCardHeader}>
            <span>Live route preview</span>
            <strong>Мария · Администратор</strong>
          </div>
          <div className={styles.routePreviewList}>
            <article>
              <span>День 1</span>
              <strong>Путь заказа и общение с гостем</strong>
              <p>Обязательные блоки остаются, знакомые темы сокращаются.</p>
            </article>
            <article>
              <span>День 7</span>
              <strong>Практика типовых ситуаций</strong>
              <p>Зоны развития получают короткие сценарии и проверку.</p>
            </article>
            <article>
              <span>День 14</span>
              <strong>Итоговая самостоятельность</strong>
              <p>Финальная проверка и закрепление оставшихся тем.</p>
            </article>
          </div>
        </div>
      </aside>
    </section>
  );
}
