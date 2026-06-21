import type { TopicScore } from "../model/types";

export function getTopicStatus(scorePercent: number): TopicScore["status"] {
  if (scorePercent >= 80) {
    return "strong";
  }

  if (scorePercent >= 60) {
    return "good";
  }

  if (scorePercent >= 40) {
    return "medium_gap";
  }

  return "critical_gap";
}
