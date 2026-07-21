"use client";

import { Coffee } from "lucide-react";
import { MayakShell, MayakTopBar } from "@/shared/ui/mayak";
import { useOnboardingAgentState } from "../model/useOnboardingAgentState";
import { DiagnosticResultStep } from "./steps/DiagnosticResultStep";
import { DiagnosticStep } from "./steps/DiagnosticStep";
import { LearningRouteStep } from "./steps/LearningRouteStep";
import { WelcomeStep } from "./steps/WelcomeStep";

export function OnboardingAgentPage() {
  const { state, actions } = useOnboardingAgentState();
  const isLearningRouteStep = state.currentStep === "learning_route";

  return (
    <MayakShell
      scrollable={isLearningRouteStep}
      contentClassName={isLearningRouteStep ? "gap-3 pb-6" : "gap-3"}
      topBar={
        <MayakTopBar
          brand="Valle Sanchez"
          subtitle="входное тестирование бариста"
          icon={<Coffee className="h-5 w-5" aria-hidden="true" />}
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
            onBackToIntro={() => actions.goToStep("welcome")}
            onComplete={actions.completeDiagnostic}
          />
        )}

        {state.currentStep === "diagnostic_result" &&
          state.employee &&
          state.diagnosticResult && (
            <DiagnosticResultStep
              employee={state.employee}
              result={state.diagnosticResult}
              onBackToDiagnostic={() => actions.goToStep("diagnostic")}
              onBuildRoute={actions.buildLearningRoute}
            />
          )}

        {state.currentStep === "learning_route" && state.employee && state.learningRoute && (
          <LearningRouteStep
            employee={state.employee}
            route={state.learningRoute}
            onBack={() => actions.goToStep("diagnostic_result")}
            onUpdateTaskStatus={actions.updateLearningTaskStatus}
            onCreateEscalation={actions.createEscalation}
          />
        )}
      </section>
    </MayakShell>
  );
}
