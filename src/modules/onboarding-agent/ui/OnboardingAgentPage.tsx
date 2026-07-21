"use client";

import { Coffee } from "lucide-react";
import { MayakShell, MayakTopBar } from "@/shared/ui/mayak";
import { useOnboardingAgentState } from "../model/useOnboardingAgentState";
import { DiagnosticStep } from "./steps/DiagnosticStep";
import { LearningRouteStep } from "./steps/LearningRouteStep";
import { WelcomeStep } from "./steps/WelcomeStep";

export function OnboardingAgentPage() {
  const { state, actions } = useOnboardingAgentState();
  const isLearningRouteStep = state.currentStep === "learning_route";
  const showDevReset = process.env.NODE_ENV === "development";

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
            onStart={actions.startDiagnostic}
            onContinue={
              state.diagnosticQuestions.length > 0 && !state.diagnosticResult
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
