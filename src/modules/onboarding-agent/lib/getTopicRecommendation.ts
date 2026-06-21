import type { TopicScore } from "../model/types";

export function getTopicRecommendation(params: {
  scorePercent: number;
  required: boolean;
  skippable: TopicScore["skippable"];
}): TopicScore["recommendation"] {
  if (params.required) {
    if (params.scorePercent >= 80) {
      return "short_summary";
    }

    if (params.scorePercent >= 60) {
      return "short_module";
    }

    if (params.scorePercent >= 40) {
      return "full_module";
    }

    return "full_module_with_mentor";
  }

  if (params.scorePercent >= 80 && params.skippable === true) {
    return "skip_detailed_module";
  }

  if (params.scorePercent >= 80) {
    return "short_summary";
  }

  if (params.scorePercent >= 60) {
    return "short_module";
  }

  if (params.scorePercent >= 40) {
    return "full_module";
  }

  return "full_module_with_mentor";
}
