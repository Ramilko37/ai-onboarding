import { retrieveKnowledge } from "./retrieveKnowledge";
import type { EmployeeRole, LearningPathSource } from "../model/types";

export type KnowledgeAnswer = {
  text: string;
  answer: string;
  sources: LearningPathSource[];
};

export function answerKnowledgeQuestion(params: {
  question: string;
  role?: EmployeeRole;
  topicId?: string;
  limit?: number;
}): KnowledgeAnswer {
  if (isOutOfScopeQuestion(params.question)) {
    return buildFallbackAnswer();
  }

  const results = retrieveKnowledge({
    query: params.question,
    role: params.role,
    topicId: params.topicId,
    limit: params.limit ?? 3
  });

  if (results.length === 0) {
    return buildFallbackAnswer();
  }

  const primarySource = results[0];
  const answer = primarySource.summary;
  const sources = results.map((result) => ({
    documentId: result.documentId,
    title: result.title,
    sourceType: result.sourceType
  }));

  return {
    text: `Ответ: ${answer}\n\nИсточник: ${primarySource.title}`,
    answer,
    sources
  };
}

function buildFallbackAnswer(): KnowledgeAnswer {
  const fallback =
    "Я не нашёл точного ответа в базе знаний УК. Лучше уточнить у управляющего точки.";

  return {
    text: `Ответ: ${fallback}\n\nИсточник в базе знаний не найден. Рекомендуется уточнить у управляющего.`,
    answer: fallback,
    sources: []
  };
}

function isOutOfScopeQuestion(question: string) {
  return [
    "больнич",
    "зарплат",
    "оклад",
    "увольн",
    "штраф",
    "договор",
    "отпуск",
    "медиц",
    "юрид",
    "налог"
  ].some((marker) => question.toLocaleLowerCase("ru-RU").includes(marker));
}
