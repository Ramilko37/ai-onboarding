import type {
  DiagnosticAnswer,
  DiagnosticQuestion,
  EmployeeProfile,
} from "../../model/types";
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
    <MayakPanel padding="lg" className="flex h-full min-h-0 flex-col gap-3">
      <DiagnosticProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />

      <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-3">
        <div className="flex min-h-0 flex-1 flex-col">
          <DiagnosticQuestionCard
            question={currentQuestion}
            selectedOptionId={currentAnswer?.selectedOptionId}
            onSelectAnswer={handleSelectAnswer}
          />

          <DiagnosticNavigation
            canGoBack={currentQuestionIndex > 0}
            onBack={currentQuestionIndex > 0 ? onPrevious : onBackToIntro}
            onNext={isLastQuestion ? onComplete : onNext}
            canGoNext={Boolean(currentAnswer)}
            isLastQuestion={isLastQuestion}
          />
        </div>
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

  return (
    <header className="shrink-0">
      <MayakSectionHeader
        className="mb-0"
        kicker="Диагностика знаний"
        title={`Вопрос ${currentNumber} из ${totalQuestions}`}
      />
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
    <MayakPanel padding="md" className="flex min-h-0 flex-1 flex-col shadow-none">
      <h2 className="shrink-0 text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
        {question.question}
      </h2>
      <div className="mt-4 grid min-h-0 flex-1 gap-2 overflow-y-auto pr-1" role="list">
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
    </MayakPanel>
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
        "grid min-h-14 cursor-pointer grid-cols-[36px_1fr] items-center gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45 sm:grid-cols-[36px_1fr_auto]",
        selected
          ? "border-primary bg-primary/8 ring-1 ring-primary/40"
          : "border-border bg-card hover:border-primary/40 hover:bg-primary/5",
      )}
      onClick={onSelect}
      type="button"
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition",
          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
        )}
      >
        {optionId.toUpperCase()}
      </span>
      <span
        className={cn(
          "text-sm leading-relaxed transition",
          selected ? "font-medium text-foreground" : "text-foreground",
        )}
      >
        {text}
      </span>
      <span
        className={cn(
          "hidden h-5 w-5 items-center justify-center rounded-full transition sm:flex",
          selected ? "bg-primary text-primary-foreground" : "border border-border bg-card",
        )}
        aria-hidden="true"
      >
        {selected && <span className="h-2 w-2 rounded-full bg-current" />}
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
      <SecondaryButton onClick={onBack}>
        {canGoBack ? "Назад" : "К началу"}
      </SecondaryButton>
      <button
        className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
        disabled={!canGoNext}
        onClick={onNext}
        type="button"
      >
        {isLastQuestion ? "Завершить" : "Далее"}
      </button>
    </MayakActionBar>
  );
}
