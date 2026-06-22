"use client";

import { useEffect } from "react";
import { useOnboardingAgentState } from "../model/useOnboardingAgentState";
import { CompetencyMapStep } from "./steps/CompetencyMapStep";
import { DiagnosticIntroStep } from "./steps/DiagnosticIntroStep";
import { DiagnosticResultStep } from "./steps/DiagnosticResultStep";
import { DiagnosticStep } from "./steps/DiagnosticStep";
import { EmployeeProfileStep } from "./steps/EmployeeProfileStep";
import { LearningRouteStep } from "./steps/LearningRouteStep";
import { WelcomeStep } from "./steps/WelcomeStep";
import { StepProgress } from "./components";
import styles from "./OnboardingAgentPage.module.css";

export function OnboardingAgentPage() {
  const { state, actions } = useOnboardingAgentState();
  const headerMeta = state.employee
    ? `${state.employee.name} · ${state.employee.location}`
    : "Демо без backend, RAG и внешних интеграций";
  const locationLabel = state.employee?.location ?? "Точка не выбрана";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [state.currentStep]);

  return (
    <main className={styles.page}>
      <header className={styles.appHeader}>
        <div className={styles.brand} aria-label="Onboard Horeca">
          <span className={styles.brandMark}>OH</span>
          <div>
            <strong className={styles.brandName}>Onboard</strong>
            <span className={styles.brandMeta}>HORECA</span>
          </div>
        </div>
        <div>
          <p className={styles.headerTitle}>Маршрут адаптации</p>
          <span className={styles.headerMeta}>{headerMeta}</span>
        </div>
        <span className={styles.locationPill}>{locationLabel}</span>
      </header>

      <div className={styles.shell}>
        <StepProgress currentStep={state.currentStep} />

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
      </div>
    </main>
  );
}
