import { competencyMilestones, competencyTopics } from "../model/mockData";
import type { EmployeeRole } from "../model/types";

export function getTopicsByRole(role: EmployeeRole) {
  return competencyTopics.filter((topic) => topic.role === role);
}

export function getMilestonesByRole(role: EmployeeRole) {
  return competencyMilestones.filter((milestone) => milestone.role === role);
}
