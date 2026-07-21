import { diagnosticQuestions } from "../model/diagnosticQuestions";
import { competencyTopics } from "../model/mockData";
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

const DEMO_QUESTION_LIMIT = 8;

export function getDiagnosticQuestions(params: {
  role: EmployeeRole;
  grade: EmployeeGrade;
}): DiagnosticQuestion[] {
  const allowedDifficulties = difficultiesByGrade[params.grade];
  const limit = DEMO_QUESTION_LIMIT;
  const roleQuestions = diagnosticQuestions
    .filter((question) => question.role === params.role)
    .sort(compareQuestions);
  const roleTopics = competencyTopics.filter((topic) => topic.role === params.role);
  const roleTopicIds = [
    ...roleTopics.filter((topic) => topic.required).map((topic) => topic.id),
    ...roleTopics.filter((topic) => !topic.required).map((topic) => topic.id),
  ];
  const selectedQuestions: DiagnosticQuestion[] = [];
  const selectedQuestionIds = new Set<string>();

  for (const topicId of roleTopicIds) {
    const topicQuestions = roleQuestions.filter((question) => question.topicId === topicId);
    const preferredQuestion =
      topicQuestions.find((question) => allowedDifficulties.includes(question.difficulty)) ??
      topicQuestions[0];

    if (preferredQuestion) {
      selectedQuestions.push(preferredQuestion);
      selectedQuestionIds.add(preferredQuestion.id);
    }
  }

  for (const question of roleQuestions) {
    if (selectedQuestions.length >= limit) {
      break;
    }

    if (
      allowedDifficulties.includes(question.difficulty) &&
      !selectedQuestionIds.has(question.id)
    ) {
      selectedQuestions.push(question);
      selectedQuestionIds.add(question.id);
    }
  }

  return selectedQuestions.slice(0, limit);
}

function compareQuestions(first: DiagnosticQuestion, second: DiagnosticQuestion) {
  return first.id.localeCompare(second.id);
}
