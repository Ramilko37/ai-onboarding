import type {
  DiagnosticAnswer,
  DiagnosticQuestion,
  EmployeeProfile,
} from "../../model/types";
import { useEffect, useRef, useState } from "react";
import {
  MayakActionBar,
  MayakPanel,
  MayakSectionHeader,
  cn,
} from "@/shared/ui/mayak";
import { SecondaryButton } from "../components";

export function DiagnosticStep({
  employee,
  questions,
  answers,
  currentQuestionIndex,
  onSelectAnswer,
  onPrevious,
  onNext,
  onBackToIntro,
  onComplete,
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
    (answer) => answer.questionId === currentQuestion?.id,
  );
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const previousQuestionIndex = useRef(currentQuestionIndex);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    setDirection(currentQuestionIndex >= previousQuestionIndex.current ? "forward" : "backward");
    previousQuestionIndex.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  function handleSelectAnswer(questionId: string, optionId: string) {
    onSelectAnswer(questionId, optionId);
  }

  if (!currentQuestion) {
    return (
      <MayakPanel padding="lg" className="h-full">
        <MayakSectionHeader
          title="Не удалось собрать вопросы диагностики"
          description="Вернитесь к объяснению диагностики и запустите её ещё раз."
        />
        <SecondaryButton onClick={onBackToIntro}>Вернуться назад</SecondaryButton>
      </MayakPanel>
    );
  }

  return (
    <MayakPanel
      padding="lg"
      className="mx-auto flex w-full max-w-[960px] flex-col gap-6 rounded-[20px] shadow-none"
    >
      <DiagnosticProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />

      <div className="mx-auto w-full max-w-[880px]">
        <div
          className={direction === "forward" ? "motion-question-forward" : "motion-question-backward"}
          data-motion
          key={currentQuestion.id}
        >
          <DiagnosticQuestionCard
            question={currentQuestion}
            selectedOptionId={currentAnswer?.selectedOptionId}
            onSelectAnswer={handleSelectAnswer}
          />
        </div>

        <DiagnosticNavigation
          canGoBack={currentQuestionIndex > 0}
          onBack={currentQuestionIndex > 0 ? onPrevious : onBackToIntro}
          onNext={isLastQuestion ? onComplete : onNext}
          canGoNext={Boolean(currentAnswer)}
          isLastQuestion={isLastQuestion}
        />
      </div>
    </MayakPanel>
  );
}

export function DiagnosticProgress({
  currentQuestionIndex,
  totalQuestions,
}: {
  currentQuestionIndex: number;
  totalQuestions: number;
}) {
  const currentNumber = currentQuestionIndex + 1;
  const progress = Math.round((currentNumber / totalQuestions) * 100);

  return (
    <header className="shrink-0 space-y-4">
      <MayakSectionHeader
        className="mb-0"
        kicker="Диагностика знаний"
        title={`Вопрос ${currentNumber} из ${totalQuestions}`}
      />
      <div
        aria-label={`Прогресс диагностики ${progress} процентов`}
        className="h-1.5 overflow-hidden rounded-full bg-border/60"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-[var(--motion-control)] ease-[var(--motion-ease-premium)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}

export function DiagnosticQuestionCard({
  question,
  selectedOptionId,
  onSelectAnswer,
}: {
  question: DiagnosticQuestion;
  selectedOptionId?: string;
  onSelectAnswer: (questionId: string, optionId: string) => void;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
        {question.question}
      </h2>
      <div className="mt-5 grid gap-3" role="list">
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
    </section>
  );
}

export function DiagnosticOption({
  optionId,
  text,
  selected,
  onSelect,
}: {
  optionId: string;
  text: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "grid min-h-[72px] cursor-pointer grid-cols-[22px_36px_1fr] items-center gap-3 rounded-[14px] border px-4 py-3 text-left transition-[background-color,border-color,box-shadow] duration-[var(--motion-fast)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45 sm:min-h-[84px] sm:grid-cols-[24px_40px_1fr] sm:px-5",
        selected
          ? "border-primary bg-primary/10 ring-2 ring-primary/25"
          : "border-border bg-card hover:border-primary/45 hover:bg-primary/5",
      )}
      onClick={onSelect}
      type="button"
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-[160ms]",
          selected ? "border-primary bg-card text-primary" : "border-border bg-card",
        )}
        aria-hidden="true"
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary motion-safe:animate-[motion-indicator_160ms_var(--motion-ease-premium)_both]" />}
      </span>
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition sm:h-10 sm:w-10",
          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
        )}
      >
        {optionId.toUpperCase()}
      </span>
      <span
        className={cn(
          "text-base leading-snug transition sm:text-lg",
          selected ? "font-medium text-foreground" : "text-foreground",
        )}
      >
        {text}
      </span>
      {selected && (
        <span className="sr-only">Выбранный ответ</span>
      )}
    </button>
  );
}

export function DiagnosticNavigation({
  canGoBack,
  onBack,
  onNext,
  canGoNext,
  isLastQuestion,
}: {
  canGoBack: boolean;
  onBack: () => void;
  onNext: () => void;
  canGoNext: boolean;
  isLastQuestion: boolean;
}) {
  return (
    <MayakActionBar className="mt-3 shrink-0 justify-between">
      {canGoBack ? (
        <SecondaryButton onClick={onBack}>Назад</SecondaryButton>
      ) : (
        <button
          className="min-h-11 cursor-pointer rounded-[10px] px-2 text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
          onClick={() => {
            if (window.confirm("Выйти из диагностики? Ответы будут сброшены.")) {
              onBack();
            }
          }}
          type="button"
        >
          Выйти из диагностики
        </button>
      )}
      <button
        className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[10px] bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-[background-color,border-color,opacity] duration-[var(--motion-fast)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
        disabled={!canGoNext}
        onClick={onNext}
        type="button"
      >
        {isLastQuestion ? "Завершить" : "Далее"}
      </button>
    </MayakActionBar>
  );
}
