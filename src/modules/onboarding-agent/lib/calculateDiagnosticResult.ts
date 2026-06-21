import type {
  CompetencyTopic,
  DiagnosticAnswer,
  DiagnosticQuestion,
  DiagnosticResult,
  EmployeeProfile,
  TopicScore
} from "../model/types";
import { getTopicRecommendation } from "./getTopicRecommendation";
import { getTopicStatus } from "./getTopicStatus";

export function calculateDiagnosticResult(params: {
  employee: EmployeeProfile;
  questions: DiagnosticQuestion[];
  answers: DiagnosticAnswer[];
  topics: CompetencyTopic[];
}): DiagnosticResult {
  const answersByQuestionId = new Map(
    params.answers.map((answer) => [answer.questionId, answer])
  );
  const roleTopicsById = new Map(
    params.topics
      .filter((topic) => topic.role === params.employee.role)
      .map((topic) => [topic.id, topic])
  );
  const answeredQuestions = params.questions.filter((question) =>
    answersByQuestionId.has(question.id)
  );
  const topicScores = buildTopicScores({
    questions: answeredQuestions,
    answersByQuestionId,
    topicsById: roleTopicsById
  });
  const totalWeight = answeredQuestions.reduce(
    (sum, question) => sum + question.weight,
    0
  );
  const earnedWeight = answeredQuestions.reduce((sum, question) => {
    const answer = answersByQuestionId.get(question.id);

    return sum + (answer?.isCorrect ? question.weight : 0);
  }, 0);
  const totalScorePercent =
    totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100);

  return {
    employeeId: params.employee.id,
    role: params.employee.role,
    grade: params.employee.grade,
    totalScorePercent,
    topicScores,
    strongTopics: topicScores.filter((topic) => topic.status === "strong"),
    weakTopics: topicScores.filter(
      (topic) => topic.status === "medium_gap" || topic.status === "critical_gap"
    ),
    criticalTopics: topicScores.filter((topic) => topic.status === "critical_gap"),
    requiredTopics: topicScores.filter((topic) => topic.required),
    completedAt: new Date().toISOString()
  };
}

function buildTopicScores(params: {
  questions: DiagnosticQuestion[];
  answersByQuestionId: Map<string, DiagnosticAnswer>;
  topicsById: Map<string, CompetencyTopic>;
}): TopicScore[] {
  const questionsByTopic = new Map<string, DiagnosticQuestion[]>();

  for (const question of params.questions) {
    const questions = questionsByTopic.get(question.topicId) ?? [];
    questions.push(question);
    questionsByTopic.set(question.topicId, questions);
  }

  return Array.from(questionsByTopic.entries()).map(([topicId, questions]) => {
    const topic = params.topicsById.get(topicId);
    const totalWeight = questions.reduce(
      (sum, question) => sum + question.weight,
      0
    );
    const earnedWeight = questions.reduce((sum, question) => {
      const answer = params.answersByQuestionId.get(question.id);

      return sum + (answer?.isCorrect ? question.weight : 0);
    }, 0);
    const correctAnswers = questions.filter(
      (question) => params.answersByQuestionId.get(question.id)?.isCorrect
    ).length;
    const scorePercent =
      totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100);
    const required = topic?.required ?? false;
    const skippable = topic?.skippable ?? false;
    const status = getTopicStatus(scorePercent);

    return {
      topicId,
      topicTitle: topic?.title ?? topicId,
      role: topic?.role ?? questions[0].role,
      scorePercent,
      correctAnswers,
      totalQuestions: questions.length,
      totalWeight,
      earnedWeight,
      importance: topic?.importance ?? "medium",
      required,
      skippable,
      status,
      recommendation: getTopicRecommendation({
        scorePercent,
        required,
        skippable
      })
    };
  });
}
