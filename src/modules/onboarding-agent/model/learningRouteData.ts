import type { EmployeeRole } from "./types";

export type LearningTopicMaterial = {
  shortTitle: string;
  role: EmployeeRole;
  source: string;
  day1Task: string;
  practiceTask: string;
  checkTask: string;
  summaryTask: string;
};

export const learningTopicMaterials: Record<string, LearningTopicMaterial> = {};

export function getLearningTopicMaterial(topicId: string) {
  return learningTopicMaterials[topicId];
}
