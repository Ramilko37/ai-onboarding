import type { TopicScore } from "../model/types";

const recommendationLabels: Record<TopicScore["recommendation"], string> = {
  skip_detailed_module: "Можно сократить подробный блок",
  short_summary: "Краткое резюме",
  short_module: "Короткий модуль",
  full_module: "Полный модуль",
  full_module_with_mentor: "Модуль и поддержка наставника"
};

const statusLabels: Record<TopicScore["status"], string> = {
  strong: "Сильная зона",
  good: "Есть базовое понимание",
  medium_gap: "Зона развития",
  critical_gap: "Нужна поддержка"
};

export function getRecommendationLabel(
  recommendation: TopicScore["recommendation"]
) {
  return recommendationLabels[recommendation];
}

export function getStatusLabel(status: TopicScore["status"]) {
  return statusLabels[status];
}
