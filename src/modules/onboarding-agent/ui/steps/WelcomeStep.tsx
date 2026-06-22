import { ArrowRight, Compass, Map, MessageCircle, Route } from "lucide-react";
import { PrimaryButton } from "../components";
import styles from "../OnboardingAgentPage.module.css";

export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.kicker}>Маяк · адаптация без давления</p>
        <h1>Спокойный путь первого дня</h1>
        <p className={styles.lead}>
          Маяк помогает новичку понять, где он сейчас, что делать дальше и где
          получить поддержку.
        </p>
        <p>
          Сначала собираем профиль роли и грейда, затем проводим мягкую
          диагностику знаний и формируем персональный маршрут на 1, 7 и 14 дней.
        </p>
        <PrimaryButton icon={<ArrowRight aria-hidden="true" />} onClick={onStart}>
          Начать адаптацию сотрудника
        </PrimaryButton>
      </div>

      <aside className={styles.heroPanel} aria-label="Ценность прототипа">
        <div>
          <span><Compass aria-hidden="true" />Сейчас</span>
          <p>Собираем профиль и роль без ощущения экзамена.</p>
        </div>
        <div>
          <span><Map aria-hidden="true" />Дальше</span>
          <p>Показываем карту компетенций и короткую диагностику.</p>
        </div>
        <div>
          <span><Route aria-hidden="true" />Маршрут</span>
          <p>Собираем обучение под реальные зоны поддержки.</p>
        </div>
        <div>
          <span><MessageCircle aria-hidden="true" />Помощь</span>
          <p>Обязательные темы остаются, но тон всегда поддерживающий.</p>
        </div>
      </aside>
    </section>
  );
}
