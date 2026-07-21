"use client";

import { useEffect, useMemo, useState } from "react";
import { buildPersonalLearningRoute } from "../lib/buildPersonalLearningRoute";
import { calculateDiagnosticResult } from "../lib/calculateDiagnosticResult";
import { getDiagnosticQuestions } from "../lib/getDiagnosticQuestions";
import {
  buildLiveManagerRecord,
  saveLiveManagerRecord
} from "../../manager-dashboard/model/managerDashboardData";
import type { LearningTaskStatus } from "./learningRouteTypes";
import { competencyTopics } from "./mockData";
import type {
  DiagnosticAnswer,
  EmployeeGrade,
  EmployeeProfile,
  EmployeeRole,
  OnboardingState,
  OnboardingStep
} from "./types";

const initialState: OnboardingState = {
  employee: {
    id: "demo-sofia-kuznetsova",
    name: "София Кузнецова",
    role: "barista",
    grade: "horeca_experience",
    location: "Valle Sanchez · Арбат",
    startDate: "2026-07-21",
  },
  selectedRole: "barista",
  selectedGrade: "horeca_experience",
  currentStep: "welcome",
  diagnosticQuestions: [],
  diagnosticAnswers: [],
  diagnosticResult: null,
  learningRoute: null,
  currentQuestionIndex: 0,
  escalations: [],
};

const STORAGE_KEY = "valle-sanchez:barista-onboarding-state:v2";
const LEGACY_STORAGE_KEY = "valle-sanchez:barista-onboarding-state:v1";

const knownSteps = new Set<OnboardingStep>([
  "welcome",
  "employee_profile",
  "competency_map",
  "diagnostic_intro",
  "diagnostic",
  "diagnostic_result",
  "learning_route",
]);

export type EmployeeProfileInput = {
  name: string;
  role: EmployeeRole;
  grade: EmployeeGrade;
  location: string;
  startDate: string;
};

function readStoredState(): OnboardingState {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!rawState) {
      return initialState;
    }

    const parsedState = JSON.parse(rawState) as Partial<OnboardingState>;

    if (!parsedState.currentStep || !knownSteps.has(parsedState.currentStep)) {
      return initialState;
    }

    if (
      parsedState.currentStep !== "welcome" &&
      parsedState.currentStep !== "employee_profile" &&
      !parsedState.employee
    ) {
      return initialState;
    }

    return restoreOnboardingState(parsedState);
  } catch {
    return initialState;
  }
}

export function restoreOnboardingState(parsedState: Partial<OnboardingState>): OnboardingState {
  const restoredStep = getRestoredStep(parsedState);
  const employee =
    parsedState.employee ??
    (restoredStep === "welcome" || restoredStep === "employee_profile"
      ? initialState.employee
      : null);

  return {
    ...initialState,
    ...parsedState,
    employee,
    diagnosticQuestions: Array.isArray(parsedState.diagnosticQuestions)
      ? parsedState.diagnosticQuestions
      : [],
    diagnosticAnswers: Array.isArray(parsedState.diagnosticAnswers)
      ? parsedState.diagnosticAnswers
      : [],
    currentQuestionIndex:
      typeof parsedState.currentQuestionIndex === "number"
        ? parsedState.currentQuestionIndex
        : 0,
    escalations: Array.isArray(parsedState.escalations) ? parsedState.escalations : [],
    learningRoute: migrateRouteStatuses(parsedState.learningRoute ?? null),
    currentStep: restoredStep,
  };
}

function getRestoredStep(state: Partial<OnboardingState>): OnboardingStep {
  if (state.learningRoute) return "learning_route";
  if (state.diagnosticResult) return "diagnostic_result";
  if (state.currentStep === "diagnostic" && (state.diagnosticQuestions?.length ?? 0) > 0) {
    return "diagnostic";
  }
  return "welcome";
}

function migrateRouteStatuses(route: OnboardingState["learningRoute"]) {
  if (!route) return null;
  return {
    ...route,
    summary: "Маршрут собран на основе диагностики: знакомые темы сокращены, а важные темы добавлены в практику и повторение.",
    days: route.days.map((day) => ({
      ...day,
      tasks: day.tasks.map((task) => ({
        ...task,
        reason:
          task.id === "route-intro-diagnostic-summary"
            ? "Задача помогает разобраться в персональном маршруте: знакомые темы пройдём короче, а на важных темах сосредоточимся в первые дни."
            : task.reason,
        status: task.status === ("needs_mentor" as never) ? "blocked" : task.status,
      })),
    })),
  };
}

function persistState(state: OnboardingState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Persistence is a prototype convenience; the flow should still work without storage.
  }
}

export function useOnboardingAgentState() {
  const [state, setState] = useState<OnboardingState>(initialState);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    setState(readStoredState());
    setIsRestored(true);
  }, []);

  useEffect(() => {
    if (!isRestored) {
      return;
    }

    persistState(state);
  }, [isRestored, state]);

  const actions = useMemo(
    () => ({
      goToStep(currentStep: OnboardingStep) {
        setState((previous) => ({ ...previous, currentStep }));
      },
      saveEmployee(input: EmployeeProfileInput) {
        const employee: EmployeeProfile = {
          id: crypto.randomUUID(),
          ...input
        };

        setState({
          employee,
          selectedRole: input.role,
          selectedGrade: input.grade,
          currentStep: "competency_map",
          diagnosticQuestions: [],
          diagnosticAnswers: [],
          diagnosticResult: null,
          learningRoute: null,
          currentQuestionIndex: 0,
          escalations: []
        });
      },
      startDiagnostic() {
        setState((previous) => {
          if (!previous.employee) {
            return previous;
          }

          return {
            ...previous,
            currentStep: "diagnostic",
            diagnosticQuestions: getDiagnosticQuestions({
              role: previous.employee.role,
              grade: previous.employee.grade
            }),
            diagnosticAnswers: [],
            diagnosticResult: null,
            learningRoute: null,
            currentQuestionIndex: 0,
          };
        });
      },
      selectAnswer(questionId: string, optionId: string) {
        setState((previous) => {
          const question = previous.diagnosticQuestions.find(
            (item) => item.id === questionId
          );
          const option = question?.options.find((item) => item.id === optionId);

          if (!question || !option) {
            return previous;
          }

          const nextAnswer: DiagnosticAnswer = {
            questionId,
            selectedOptionId: optionId,
            isCorrect: option.isCorrect,
            topicId: question.topicId,
            weight: question.weight
          };

          return {
            ...previous,
            diagnosticAnswers: [
              ...previous.diagnosticAnswers.filter(
                (answer) => answer.questionId !== questionId
              ),
              nextAnswer
            ],
            learningRoute: null
          };
        });
      },
      goToNextQuestion() {
        setState((previous) => ({
          ...previous,
          currentQuestionIndex: Math.min(
            previous.currentQuestionIndex + 1,
            Math.max(previous.diagnosticQuestions.length - 1, 0)
          )
        }));
      },
      goToPreviousQuestion() {
        setState((previous) => ({
          ...previous,
          currentQuestionIndex: Math.max(previous.currentQuestionIndex - 1, 0)
        }));
      },
      completeDiagnostic() {
        setState((previous) => {
          if (!previous.employee) {
            return previous;
          }

          return {
            ...previous,
            currentStep: "diagnostic_result",
            diagnosticResult: calculateDiagnosticResult({
              employee: previous.employee,
              questions: previous.diagnosticQuestions,
              answers: previous.diagnosticAnswers,
              topics: competencyTopics
            }),
            learningRoute: null
          };
        });
      },
      buildLearningRoute() {
        setState((previous) => {
          if (!previous.employee || !previous.diagnosticResult) {
            return previous;
          }
          const learningRoute = buildPersonalLearningRoute({
            employee: previous.employee,
            result: previous.diagnosticResult
          });

          if (previous.employee.role === "barista") {
            saveLiveManagerRecord(
              buildLiveManagerRecord({
                employee: previous.employee,
                result: previous.diagnosticResult,
                route: learningRoute,
                escalations: previous.escalations,
              })
            );
          }

          return {
            ...previous,
            currentStep: "learning_route",
            learningRoute
          };
        });
      },
      updateLearningTaskStatus(taskId: string, status: LearningTaskStatus) {
        setState((previous) => {
          if (!previous.employee || !previous.diagnosticResult || !previous.learningRoute) {
            return previous;
          }

          const learningRoute = {
            ...previous.learningRoute,
            days: previous.learningRoute.days.map((day) => ({
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      status,
                      blockedReason:
                        status === "blocked" ? "Нужна помощь наставника, чтобы продолжить." : undefined,
                    }
                  : task
              )
            }))
          };

          if (previous.employee.role === "barista") {
            saveLiveManagerRecord(
              buildLiveManagerRecord({
                employee: previous.employee,
                result: previous.diagnosticResult,
                route: learningRoute,
                escalations: previous.escalations,
              })
            );
          }

          return {
            ...previous,
            learningRoute
          };
        });
      },
      resetDiagnostic() {
        setState((previous) => ({
          ...previous,
          currentStep: "diagnostic_intro",
          diagnosticQuestions: [],
          diagnosticAnswers: [],
          diagnosticResult: null,
          learningRoute: null,
          currentQuestionIndex: 0
        }));
      },
      reset() {
        setState({ ...initialState, employee: initialState.employee ? { ...initialState.employee } : null });
      },
      createEscalation(question: string) {
        setState((previous) => {
          if (!previous.employee) return previous;
          const escalations = [
            ...previous.escalations,
            {
              id: crypto.randomUUID(),
              employeeId: previous.employee.id,
              question,
              status: "open" as const,
              createdAt: new Date().toISOString(),
            },
          ];
          if (previous.diagnosticResult && previous.learningRoute) {
            saveLiveManagerRecord(buildLiveManagerRecord({
              employee: previous.employee,
              result: previous.diagnosticResult,
              route: previous.learningRoute,
              escalations,
            }));
          }
          return {
            ...previous,
            escalations,
          };
        });
      }
    }),
    []
  );

  return { state, actions };
}
