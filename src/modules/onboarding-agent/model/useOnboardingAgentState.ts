"use client";

import { useMemo, useState } from "react";
import { buildPersonalLearningRoute } from "../lib/buildPersonalLearningRoute";
import { calculateDiagnosticResult } from "../lib/calculateDiagnosticResult";
import { getDiagnosticQuestions } from "../lib/getDiagnosticQuestions";
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
  employee: null,
  selectedRole: null,
  selectedGrade: null,
  currentStep: "welcome",
  diagnosticQuestions: [],
  diagnosticAnswers: [],
  diagnosticResult: null,
  learningRoute: null,
  currentQuestionIndex: 0
};

export type EmployeeProfileInput = {
  name: string;
  role: EmployeeRole;
  grade: EmployeeGrade;
  location: string;
  startDate: string;
};

export function useOnboardingAgentState() {
  const [state, setState] = useState<OnboardingState>(initialState);

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
          currentQuestionIndex: 0
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
            currentQuestionIndex: 0
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

          return {
            ...previous,
            currentStep: "learning_route",
            learningRoute: buildPersonalLearningRoute({
              employee: previous.employee,
              result: previous.diagnosticResult
            })
          };
        });
      },
      updateLearningTaskStatus(taskId: string, status: LearningTaskStatus) {
        setState((previous) => {
          if (!previous.learningRoute) {
            return previous;
          }

          return {
            ...previous,
            learningRoute: {
              ...previous.learningRoute,
              days: previous.learningRoute.days.map((day) => ({
                ...day,
                tasks: day.tasks.map((task) =>
                  task.id === taskId ? { ...task, status } : task
                )
              }))
            }
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
        setState(initialState);
      }
    }),
    []
  );

  return { state, actions };
}
