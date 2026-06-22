import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import type {
  DiagnosticAnswer,
  DiagnosticQuestion,
  EmployeeProfile
} from "../../model/types";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";
import styles from "../OnboardingAgentPage.module.css";

export function DiagnosticStep({
  employee,
  questions,
  answers,
  currentQuestionIndex,
  onSelectAnswer,
  onPrevious,
  onNext,
  onBackToIntro,
  onComplete
}: {
  employee: EmployeeProfile;
  questions: DiagnosticQuestion[];
  answers: DiagnosticAnswer[];
  currentQuestionIndex: number;
  onSelectAnswer: (questionId: string, optionId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onBackToIntro: () => void;
  onComplete: () => void;
}) {
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (answer) => answer.questionId === currentQuestion?.id
  );
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (!currentQuestion) {
    return (
      <section className={styles.diagnosticPanel}>
        <div className={styles.sectionHeader}>
          <h1>Не удалось собрать вопросы диагностики</h1>
          <p>Вернитесь к объяснению диагностики и запустите её ещё раз.</p>
        </div>
        <SecondaryButton
          icon={<ArrowLeft aria-hidden="true" />}
          onClick={onBackToIntro}
        >
          Вернуться назад
        </SecondaryButton>
      </section>
    );
  }

  return (
    <section className={styles.diagnosticRunPanel}>
      <DiagnosticProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />

      <div className={styles.diagnosticMetaGrid}>
        <div>
          <span>Сотрудник</span>
          <strong>{employee.name}</strong>
        </div>
        <div>
          <span>Роль</span>
          <strong>{getRoleLabel(employee.role)}</strong>
        </div>
        <div>
          <span>Грейд</span>
          <strong>{getGradeLabel(employee.grade)}</strong>
        </div>
      </div>

      <DiagnosticQuestionCard
        question={currentQuestion}
        selectedOptionId={currentAnswer?.selectedOptionId}
        onSelectAnswer={onSelectAnswer}
      />

      <DiagnosticNavigation
        canGoBack={currentQuestionIndex > 0}
        canContinue={Boolean(currentAnswer)}
        isLastQuestion={isLastQuestion}
        onBack={currentQuestionIndex > 0 ? onPrevious : onBackToIntro}
        onNext={isLastQuestion ? onComplete : onNext}
      />
    </section>
  );
}

export function DiagnosticProgress({
  currentQuestionIndex,
  totalQuestions
}: {
  currentQuestionIndex: number;
  totalQuestions: number;
}) {
  const currentNumber = currentQuestionIndex + 1;
  const progressPercent = Math.round((currentNumber / totalQuestions) * 100);

  return (
    <header className={styles.diagnosticHeader}>
      <div>
        <p className={styles.kicker}>Диагностика знаний</p>
        <h1>Вопрос {currentNumber} из {totalQuestions}</h1>
        <p>
          Диагностика помогает собрать персональный маршрут обучения. Это не
          экзамен: цель — понять, какие темы уже знакомы, а где лучше дать больше
          поддержки.
        </p>
      </div>
      <div className={styles.progressMeter} aria-label={`Прогресс ${progressPercent}%`}>
        <span style={{ width: `${progressPercent}%` }} />
      </div>
    </header>
  );
}

export function DiagnosticQuestionCard({
  question,
  selectedOptionId,
  onSelectAnswer
}: {
  question: DiagnosticQuestion;
  selectedOptionId?: string;
  onSelectAnswer: (questionId: string, optionId: string) => void;
}) {
  return (
    <article className={styles.questionCard}>
      <div className={styles.questionSource}>
        <span>{getDifficultyLabel(question.difficulty)}</span>
        {question.source && <span>{question.source}</span>}
      </div>
      <h2>{question.question}</h2>
      <div className={styles.optionList} role="list">
        {question.options.map((option) => (
          <DiagnosticOption
            key={option.id}
            optionId={option.id}
            text={option.text}
            selected={selectedOptionId === option.id}
            onSelect={() => onSelectAnswer(question.id, option.id)}
          />
        ))}
      </div>
    </article>
  );
}

export function DiagnosticOption({
  optionId,
  text,
  selected,
  onSelect
}: {
  optionId: string;
  text: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-pressed={selected}
      className={selected ? styles.answerOptionSelected : styles.answerOption}
      onClick={onSelect}
      type="button"
    >
      <span>
        {selected ? (
          <CheckCircle2 aria-hidden="true" />
        ) : (
          <HelpCircle aria-hidden="true" />
        )}
      </span>
      <p>{text}</p>
    </button>
  );
}

export function DiagnosticNavigation({
  canGoBack,
  canContinue,
  isLastQuestion,
  onBack,
  onNext
}: {
  canGoBack: boolean;
  canContinue: boolean;
  isLastQuestion: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className={styles.actions}>
      <SecondaryButton icon={<ArrowLeft aria-hidden="true" />} onClick={onBack}>
        {canGoBack ? "Назад к вопросу" : "Назад к объяснению"}
      </SecondaryButton>
      <PrimaryButton
        disabled={!canContinue}
        icon={<ArrowRight aria-hidden="true" />}
        onClick={onNext}
      >
        {isLastQuestion ? "Завершить диагностику" : "Далее"}
      </PrimaryButton>
    </div>
  );
}

function getDifficultyLabel(difficulty: DiagnosticQuestion["difficulty"]) {
  if (difficulty === "basic") {
    return "Базовый вопрос";
  }

  if (difficulty === "intermediate") {
    return "Ситуационный вопрос";
  }

  return "Сетевой стандарт";
}
