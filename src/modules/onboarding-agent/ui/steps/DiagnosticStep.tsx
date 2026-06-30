import { Check } from "lucide-react";
import type {
  DiagnosticAnswer,
  DiagnosticQuestion,
  EmployeeProfile,
} from "../../model/types";
import {
  MayakActionBar,
  MayakBadge,
  MayakPanel,
  MayakProgressBar,
  MayakSectionHeader,
  cn,
} from "@/shared/ui/mayak";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
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

    window.setTimeout(() => {
      if (isLastQuestion) {
        onComplete();
        return;
      }

      onNext();
    }, 160);
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

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[0.66fr_1.34fr]">
        <aside className="flex min-h-0 flex-col gap-3">
          <MayakPanel padding="sm" className="shrink-0 shadow-none">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
                aria-hidden="true"
              >
                {employee.name.trim().charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{employee.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {getRoleLabel(employee.role)} · {getGradeLabel(employee.grade)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
              <span className="text-xs text-muted-foreground">Вопрос</span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
          </MayakPanel>

          <MayakPanel variant="deep" padding="sm" className="mt-auto shadow-none">
            <MayakBadge tone="accent">подсказка</MayakBadge>
            <p className="mt-2 text-xs leading-relaxed text-deep-muted">
              Выбирайте вариант, ближайший к реальности. Правильность нужна только для настройки
              маршрута — не для оценки.
            </p>
          </MayakPanel>
        </aside>

        <div className="flex min-h-0 flex-col">
          <DiagnosticQuestionCard
            question={currentQuestion}
            selectedOptionId={currentAnswer?.selectedOptionId}
            onSelectAnswer={handleSelectAnswer}
          />

          <DiagnosticNavigation
            canGoBack={currentQuestionIndex > 0}
            onBack={currentQuestionIndex > 0 ? onPrevious : onBackToIntro}
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
  const progressPercent = Math.round((currentNumber / totalQuestions) * 100);

  return (
    <header className="grid shrink-0 gap-3 lg:grid-cols-[1fr_240px] lg:items-end">
      <MayakSectionHeader
        className="mb-0"
        kicker="Диагностика знаний"
        title={`Вопрос ${currentNumber} из ${totalQuestions}`}
        description="Один вопрос на экран. После ответа система двигает вас дальше без перегруза."
      />
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Прогресс</span>
          <span>{progressPercent}%</span>
        </div>
        <MayakProgressBar value={progressPercent} />
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
    <MayakPanel padding="md" className="flex min-h-0 flex-1 flex-col shadow-none">
      <div className="mb-3 flex shrink-0 flex-wrap gap-2">
        <MayakBadge tone="primary">{getDifficultyLabel(question.difficulty)}</MayakBadge>
        {question.source && <MayakBadge tone="secondary">{question.source}</MayakBadge>}
      </div>
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
        "grid min-h-14 cursor-pointer grid-cols-[36px_1fr_auto] items-center gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45",
        selected
          ? "border-primary bg-primary/8 ring-1 ring-primary/40 shadow-[var(--shadow-card)]"
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
          selected ? "font-medium text-foreground" : "text-foreground/85",
        )}
      >
        {text}
      </span>
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full transition",
          selected ? "bg-primary text-primary-foreground" : "border border-border bg-card",
        )}
        aria-hidden="true"
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}

export function DiagnosticNavigation({
  canGoBack,
  onBack,
}: {
  canGoBack: boolean;
  onBack: () => void;
}) {
  return (
    <MayakActionBar className="mt-3 shrink-0">
      <SecondaryButton onClick={onBack}>
        {canGoBack ? "Назад" : "К вводной"}
      </SecondaryButton>
    </MayakActionBar>
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
