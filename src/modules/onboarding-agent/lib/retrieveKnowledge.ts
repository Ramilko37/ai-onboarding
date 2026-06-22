import {
  knowledgeDocuments,
  type KnowledgeDocument,
  type KnowledgeSourceType
} from "../model/knowledgeBase.mock";
import type { EmployeeRole } from "../model/types";

export type KnowledgeSearchResult = {
  documentId: string;
  title: string;
  role: KnowledgeDocument["role"];
  topicIds: string[];
  sourceType: KnowledgeSourceType;
  summary: string;
  score: number;
};

export function retrieveKnowledge(params: {
  query?: string;
  role?: EmployeeRole;
  topicId?: string;
  limit?: number;
}): KnowledgeSearchResult[] {
  const limit = params.limit ?? 3;
  const queryTokens = tokenize(params.query ?? "");

  return knowledgeDocuments
    .map((document) => ({
      document,
      score: scoreDocument({
        document,
        role: params.role,
        topicId: params.topicId,
        queryTokens
      })
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.document.title.localeCompare(right.document.title, "ru");
    })
    .slice(0, limit)
    .map(({ document, score }) => ({
      documentId: document.id,
      title: document.title,
      role: document.role,
      topicIds: document.topicIds,
      sourceType: document.sourceType,
      summary: document.summary,
      score
    }));
}

function scoreDocument(params: {
  document: KnowledgeDocument;
  role?: EmployeeRole;
  topicId?: string;
  queryTokens: string[];
}) {
  const { document, role, topicId, queryTokens } = params;
  const topicMatch = topicId ? document.topicIds.includes(topicId) : false;
  const roleMatch = role ? document.role === role : false;
  const generalMatch = document.role === "general";
  const tokenScore =
    queryTokens.length > 0 ? getQueryTokenScore(document, queryTokens) : 0;

  if (role && !roleMatch && !generalMatch && !topicMatch) {
    return 0;
  }

  if (!topicMatch && queryTokens.length === 0) {
    return 0;
  }

  if (!topicMatch && queryTokens.length > 0 && tokenScore === 0) {
    return 0;
  }

  let score = 0;

  if (topicMatch) {
    score += 80;
  }

  if (topicId && document.id === `kb-${topicId}`) {
    score += queryTokens.length === 0 ? 40 : 10;
  }

  if (roleMatch) {
    score += 20;
  }

  if (generalMatch) {
    score += 8;
  }

  score += tokenScore;

  return score;
}

function getQueryTokenScore(document: KnowledgeDocument, queryTokens: string[]) {
  const weightedFields = [
    { value: document.title, weight: 10 },
    { value: document.tags.join(" "), weight: 8 },
    { value: document.relatedQuestions.join(" "), weight: 6 },
    { value: document.summary, weight: 4 },
    { value: document.content, weight: 2 }
  ];

  return queryTokens.reduce((score, token) => {
    const tokenScore = weightedFields.reduce((fieldScore, field) => {
      return normalize(field.value).includes(token)
        ? fieldScore + field.weight
        : fieldScore;
    }, 0);

    return score + tokenScore;
  }, 0);
}

function tokenize(value: string) {
  return normalize(value)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2)
    .filter((token) => !queryStopWords.has(token));
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ru-RU").replace(/ё/g, "е");
}

const queryStopWords = new Set([
  "без",
  "где",
  "для",
  "делать",
  "если",
  "как",
  "или",
  "можно",
  "при",
  "что"
]);
