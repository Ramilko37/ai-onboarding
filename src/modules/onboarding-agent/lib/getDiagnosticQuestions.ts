import { diagnosticQuestions } from "../model/diagnosticQuestions";
import type {
  DiagnosticQuestion,
  EmployeeGrade,
  EmployeeRole,
  QuestionDifficulty
} from "../model/types";

const difficultiesByGrade: Record<EmployeeGrade, QuestionDifficulty[]> = {
  no_experience: ["basic", "intermediate"],
  horeca_experience: ["basic", "intermediate", "advanced"],
  network_experience: ["intermediate", "advanced"]
};

const limitsByGrade: Record<EmployeeGrade, number> = {
  no_experience: 12,
  horeca_experience: 14,
  network_experience: 12
};

export function getDiagnosticQuestions(params: {
  role: EmployeeRole;
  grade: EmployeeGrade;
}): DiagnosticQuestion[] {
  const allowedDifficulties = difficultiesByGrade[params.grade];
  const limit = limitsByGrade[params.grade];

  return diagnosticQuestions
    .filter(
      (question) =>
        question.role === params.role &&
        allowedDifficulties.includes(question.difficulty)
    )
    .sort((first, second) => first.id.localeCompare(second.id))
    .slice(0, limit);
}
