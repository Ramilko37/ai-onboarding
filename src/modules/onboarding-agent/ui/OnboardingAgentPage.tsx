"use client";

import { Compass, Sparkles } from "lucide-react";
import { MayakShell, MayakTopBar } from "@/shared/ui/mayak";
import { useOnboardingAgentState } from "../model/useOnboardingAgentState";
import { CompetencyMapStep } from "./steps/CompetencyMapStep";
import { DiagnosticIntroStep } from "./steps/DiagnosticIntroStep";
import { DiagnosticResultStep } from "./steps/DiagnosticResultStep";
import { DiagnosticStep } from "./steps/DiagnosticStep";
import { EmployeeProfileStep } from "./steps/EmployeeProfileStep";
import { LearningRouteStep } from "./steps/LearningRouteStep";
import { WelcomeStep } from "./steps/WelcomeStep";
import { StepProgress, onboardingSteps } from "./components";

export function OnboardingAgentPage() {
  const { state, actions } = useOnboardingAgentState();
  const currentStepIndex = onboardingSteps.findIndex((step) => step.id === state.currentStep) + 1;
  const isLearningRouteStep = state.currentStep === "learning_route";

  return (
    <MayakShell
      scrollable={isLearningRouteStep}
      contentClassName={isLearningRouteStep ? "gap-3 pb-6" : "gap-3"}
      topBar={
        <MayakTopBar
          brand="Маяк"
          subtitle="единый путь адаптации"
          icon={<Compass className="h-5 w-5" aria-hidden="true" />}
          meta={
            <>
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Шаг {currentStepIndex} из {onboardingSteps.length}
            </>
          }
          userName={state.employee?.name ?? "Новый сотрудник"}
        />
      }
    >
      <StepProgress currentStep={state.currentStep} />

      <section
        className={
          isLearningRouteStep
            ? "flex-1 overflow-visible"
            : "flex-1 overflow-visible lg:min-h-0 lg:overflow-hidden"
        }
      >
        {state.currentStep === "welcome" && (
          <WelcomeStep onStart={() => actions.goToStep("employee_profile")} />
        )}

        {state.currentStep === "employee_profile" && (
          <EmployeeProfileStep onSubmit={actions.saveEmployee} />
        )}

        {state.currentStep === "competency_map" && state.employee && (
          <CompetencyMapStep
            employee={state.employee}
            onBack={() => actions.goToStep("employee_profile")}
            onNext={() => actions.goToStep("diagnostic_intro")}
          />
        )}

        {state.currentStep === "diagnostic_intro" && state.employee && (
          <DiagnosticIntroStep
            employee={state.employee}
            onBack={() => actions.goToStep("competency_map")}
            onStart={actions.startDiagnostic}
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
            onBackToIntro={actions.resetDiagnostic}
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
            onReset={actions.reset}
            onUpdateTaskStatus={actions.updateLearningTaskStatus}
          />
        )}
      </section>
    </MayakShell>
  );
}
