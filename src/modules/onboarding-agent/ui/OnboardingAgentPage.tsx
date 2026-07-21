"use client";

import { useState } from "react";
import { ChevronDown, Coffee } from "lucide-react";
import { MayakShell, MayakTopBar, cn } from "@/shared/ui/mayak";
import { getWelcomeDiagnosticAction } from "../lib/getWelcomeDiagnosticAction";
import { useOnboardingAgentState } from "../model/useOnboardingAgentState";
import { DiagnosticStep } from "./steps/DiagnosticStep";
import { LearningRouteStep } from "./steps/LearningRouteStep";
import { WelcomeStep } from "./steps/WelcomeStep";

export function OnboardingAgentPage() {
  const { state, actions } = useOnboardingAgentState();
  const isLearningRouteStep = state.currentStep === "learning_route";
  const showDevReset = process.env.NODE_ENV === "development";
  const welcomeAction = getWelcomeDiagnosticAction({
    currentQuestionIndex: state.currentQuestionIndex,
    hasDiagnosticResult: Boolean(state.diagnosticResult),
    questionsCount: state.diagnosticQuestions.length,
  });

  return (
    <MayakShell
      scrollable={isLearningRouteStep}
      contentClassName={isLearningRouteStep ? "gap-3 pb-6" : "gap-3"}
      topBar={
        <MayakTopBar
          brand="Valle Sanchez"
          subtitle="входное тестирование бариста"
          icon={<Coffee className="h-5 w-5" aria-hidden="true" />}
          meta={
            showDevReset ? (
              <button
                className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
                onClick={actions.reset}
                type="button"
              >
                Reset
              </button>
            ) : undefined
          }
          userControl={
            <ProfileMenu
              userName={state.employee?.name ?? "Новый бариста"}
            />
          }
          userName={state.employee?.name ?? "Новый бариста"}
        />
      }
    >
      <section
        className={
          isLearningRouteStep
            ? "min-w-0 flex-1 overflow-visible"
            : "min-w-0 flex-1 overflow-visible lg:min-h-0 lg:overflow-hidden"
        }
      >
        {state.currentStep === "welcome" && (
          <WelcomeStep
            employee={state.employee}
            action={welcomeAction}
            onStart={actions.startDiagnostic}
            onContinue={
              welcomeAction.mode === "continue"
                ? () => actions.goToStep("diagnostic")
                : undefined
            }
          />
        )}

        {state.currentStep === "diagnostic" && state.employee && (
          <DiagnosticStep
            employee={state.employee}
            questions={state.diagnosticQuestions}
            answers={state.diagnosticAnswers}
            currentQuestionIndex={state.currentQuestionIndex}
            onSelectAnswer={actions.selectAnswer}
            onPrevious={actions.goToPreviousQuestion}
            onNext={actions.goToNextQuestion}
            onBackToIntro={actions.reset}
            onComplete={actions.completeDiagnostic}
          />
        )}

        {state.currentStep === "learning_route" && state.employee && state.learningRoute && (
          <LearningRouteStep
            employee={state.employee}
            route={state.learningRoute}
            onBack={() => actions.goToStep("diagnostic")}
            onUpdateTaskStatus={actions.updateLearningTaskStatus}
            onCreateEscalation={actions.createEscalation}
          />
        )}
      </section>
    </MayakShell>
  );
}

function ProfileMenu({
  userName,
}: {
  userName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const initials = userName.trim().charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card/80 p-1 transition hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45",
          "sm:h-auto sm:w-auto sm:justify-start sm:gap-2.5 sm:py-1 sm:pr-3 sm:pl-1",
        )}
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
          aria-hidden="true"
        >
          {initials}
        </span>
        <span className="hidden text-sm font-medium text-foreground sm:inline">{userName}</span>
        <ChevronDown
          className={cn("hidden h-3.5 w-3.5 text-muted-foreground transition sm:block", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-56 rounded-2xl border border-border bg-card p-2 text-sm shadow-[var(--shadow-card)]"
          role="menu"
        >
          <div className="px-3 py-2">
            <p className="font-medium text-foreground">{userName}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Бариста · входное тестирование</p>
          </div>
        </div>
      )}
    </div>
  );
}
