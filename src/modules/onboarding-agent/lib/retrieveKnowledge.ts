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

  if (role && !roleMatch && !generalMatch && !topicMatch) {
    return 0;
  }

  let score = 0;

  if (topicMatch) {
    score += 80;
  }

  if (roleMatch) {
    score += 20;
  }

  if (generalMatch) {
    score += 8;
  }

  if (queryTokens.length > 0) {
    const haystack = normalize(
      [
        document.title,
        document.summary,
        document.tags.join(" "),
        document.relatedQuestions.join(" ")
      ].join(" ")
    );
    score += queryTokens.filter((token) => haystack.includes(token)).length * 5;
  }

  return score;
}

function tokenize(value: string) {
  return normalize(value)
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ru-RU");
}
