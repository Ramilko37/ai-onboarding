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
  MayakStatCard,
  cn,
} from "@/shared/ui/mayak";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";

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

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="flex min-h-0 flex-col gap-2">
          <MayakStatCard value={employee.name} label="Сотрудник" />
          <MayakStatCard value={getRoleLabel(employee.role)} label="Роль" />
          <MayakStatCard value={getGradeLabel(employee.grade)} label="Грейд" />
          <MayakPanel variant="deep" padding="sm" className="mt-auto shadow-none">
            <MayakBadge tone="accent">спокойный режим</MayakBadge>
            <p className="mt-2 text-xs leading-relaxed text-deep-muted">
              Можно отвечать без давления: выбранный вариант нужен только для настройки маршрута.
            </p>
          </MayakPanel>
        </aside>

        <div className="flex min-h-0 flex-col">
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
        description="Один вопрос на экран. После ответа Маяк двигает вас дальше без перегруза."
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
    <MayakPanel padding="md" className="min-h-0 flex-1 shadow-none">
      <div className="mb-3 flex flex-wrap gap-2">
        <MayakBadge tone="primary">{getDifficultyLabel(question.difficulty)}</MayakBadge>
        {question.source && <MayakBadge tone="secondary">{question.source}</MayakBadge>}
      </div>
      <h2 className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
        {question.question}
      </h2>
      <div className="mt-4 grid gap-2 overflow-y-auto pr-1" role="list">
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
        "grid min-h-14 grid-cols-[34px_1fr] items-center gap-3 rounded-2xl border bg-card p-3 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45",
        selected
          ? "border-primary/60 bg-primary/5 shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--primary)_70%,transparent)]"
          : "border-border hover:border-primary/40 hover:bg-primary/5",
      )}
      onClick={onSelect}
      type="button"
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
        )}
      >
        {optionId.toUpperCase()}
      </span>
      <span className="text-sm leading-relaxed text-foreground/85">{text}</span>
    </button>
  );
}

export function DiagnosticNavigation({
  canGoBack,
  canContinue,
  isLastQuestion,
  onBack,
  onNext,
}: {
  canGoBack: boolean;
  canContinue: boolean;
  isLastQuestion: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <MayakActionBar className="mt-3 shrink-0 justify-between">
      <SecondaryButton onClick={onBack}>
        {canGoBack ? "Назад" : "К вводной"}
      </SecondaryButton>
      <PrimaryButton disabled={!canContinue} onClick={onNext}>
        {isLastQuestion ? "Завершить" : "Далее"}
      </PrimaryButton>
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
