import type { EmployeeRole } from "../../onboarding-agent/model/types";

export type KnowledgeDocument = {
  id: string;
  title: string;
  source: string;
  roles: EmployeeRole[];
  topicIds: string[];
  required: boolean;
  isDemoContent: true;
  sections: KnowledgeSection[];
};

export type KnowledgeSection = {
  id: string;
  title: string;
  content: string;
};

export type KnowledgeChunk = {
  id: string;
  documentId: string;
  sectionId: string;
  title: string;
  source: string;
  roles: EmployeeRole[];
  topicIds: string[];
  required: boolean;
  content: string;
};

export type KnowledgeMatch = {
  chunk: KnowledgeChunk;
  document: KnowledgeDocument;
  score: number;
  vectorScore: number;
  matchedTerms: string[];
};

export type RetrieveKnowledgeParams = {
  question: string;
  role: EmployeeRole;
  topicIds?: string[];
  limit?: number;
};

export type RetrieveKnowledgeResult = {
  queryTerms: string[];
  matches: KnowledgeMatch[];
};

export type MentorSource = {
  documentId: string;
  title: string;
  source: string;
  sectionTitle: string;
  excerpt: string;
};

export type MentorAnswer = {
  answer: string;
  isGrounded: boolean;
  needsManagerReview: boolean;
  sources: MentorSource[];
};

export type MentorQuestionParams = {
  question: string;
  role: EmployeeRole;
  topicIds?: string[];
  employeeName?: string;
  routeSummary?: string;
  activeTaskTitles?: string[];
};
