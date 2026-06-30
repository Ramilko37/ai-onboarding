import type { LearningRoute } from "../../onboarding-agent/model/learningRouteTypes";
import type {
  DiagnosticResult,
  EmployeeGrade,
  EmployeeProfile,
  EmployeeRole
} from "../../onboarding-agent/model/types";

export const BARISTA_MANAGER_STORAGE_KEY = "barista:assessment-results:v1";

export type ManagerRiskLevel = "low" | "medium" | "high";

export type ManagerDashboardRecord = {
  id: string;
  name: string;
  role: EmployeeRole;
  grade: EmployeeGrade;
  location: string;
  startDate: string;
  completedAt: string;
  totalScorePercent: number;
  riskLevel: ManagerRiskLevel;
  readinessLabel: string;
  managerRecommendation: string;
  strongTopicTitles: string[];
  weakTopicTitles: string[];
  criticalTopicTitles: string[];
  requiredTopicTitles: string[];
  routeSummary: string;
  routeHighlights: string[];
};

export const demoManagerRecords: ManagerDashboardRecord[] = [
  {
    id: "demo-barista-1",
    name: "Алина Романова",
    role: "barista",
    grade: "horeca_experience",
    location: "Valle Sanchez · Арбат",
    startDate: "2026-06-24",
    completedAt: "2026-06-24T09:20:00.000Z",
    totalScorePercent: 84,
    riskLevel: "low",
    readinessLabel: "Готов к смене под обычным контролем",
    managerRecommendation:
      "Закрепить настройку эспрессо на контрольных шотах и оставить обычный контроль чистки оборудования.",
    strongTopicTitles: ["Гигиена стойки", "Молоко и текстура", "Коммуникация с гостем"],
    weakTopicTitles: ["Настройка эспрессо"],
    criticalTopicTitles: [],
    requiredTopicTitles: ["Гигиена стойки", "Молоко и текстура", "Чистка оборудования"],
    routeSummary:
      "Маршрут сфокусирован на повторяемости эспрессо и коротком контроле обязательных стандартов.",
    routeHighlights: ["День 1: контроль чистки", "День 7: эспрессо в потоке", "День 14: повторная проверка"]
  },
  {
    id: "demo-barista-2",
    name: "Даниил Фомин",
    role: "barista",
    grade: "no_experience",
    location: "Valle Sanchez · Павелецкая",
    startDate: "2026-06-25",
    completedAt: "2026-06-25T11:05:00.000Z",
    totalScorePercent: 57,
    riskLevel: "high",
    readinessLabel: "Нужна поддержка перед сменой",
    managerRecommendation:
      "Поставить наставника на первые напитки: критично усилить эспрессо, молоко и чистку оборудования.",
    strongTopicTitles: ["Коммуникация с гостем"],
    weakTopicTitles: ["Настройка эспрессо", "Молоко и текстура", "Чистка оборудования"],
    criticalTopicTitles: ["Настройка эспрессо", "Молоко и текстура"],
    requiredTopicTitles: ["Гигиена стойки", "Молоко и текстура", "Чистка оборудования"],
    routeSummary:
      "Маршрут усиливает обязательные блоки и переносит напитки в поток только после практики с наставником.",
    routeHighlights: ["День 1: полный модуль", "День 7: практика под контролем", "День 14: повторная проверка"]
  },
  {
    id: "demo-barista-3",
    name: "Марта Орлова",
    role: "barista",
    grade: "network_experience",
    location: "Valle Sanchez · Сокол",
    startDate: "2026-06-26",
    completedAt: "2026-06-26T08:40:00.000Z",
    totalScorePercent: 73,
    riskLevel: "medium",
    readinessLabel: "Можно в смену с точечным контролем",
    managerRecommendation:
      "Дать смену с контролем рецептур молочных напитков и короткой сверкой demo-стандартов.",
    strongTopicTitles: ["Зерно и хранение", "Работа в потоке"],
    weakTopicTitles: ["Рецептуры напитков", "Молоко и текстура"],
    criticalTopicTitles: ["Молоко и текстура"],
    requiredTopicTitles: ["Гигиена стойки", "Молоко и текстура", "Чистка оборудования"],
    routeSummary:
      "Маршрут короткий по знакомым темам, но сохраняет повторную проверку молока.",
    routeHighlights: ["День 1: контроль молока", "День 7: поток", "День 14: чек рецептур"]
  }
];

export function buildLiveManagerRecord(params: {
  employee: EmployeeProfile;
  result: DiagnosticResult;
  route: LearningRoute;
}): ManagerDashboardRecord {
  const riskLevel = getRiskLevel(params.result);
  const criticalTopicTitles = params.result.criticalTopics.map((topic) => topic.topicTitle);
  const weakTopicTitles = params.result.weakTopics.map((topic) => topic.topicTitle);

  return {
    id: params.employee.id,
    name: params.employee.name,
    role: params.employee.role,
    grade: params.employee.grade,
    location: params.employee.location,
    startDate: params.employee.startDate,
    completedAt: params.result.completedAt,
    totalScorePercent: params.result.totalScorePercent,
    riskLevel,
    readinessLabel: getReadinessLabel(riskLevel),
    managerRecommendation: buildManagerRecommendation({
      riskLevel,
      criticalTopicTitles,
      weakTopicTitles
    }),
    strongTopicTitles: params.result.strongTopics.map((topic) => topic.topicTitle),
    weakTopicTitles,
    criticalTopicTitles,
    requiredTopicTitles: params.result.requiredTopics.map((topic) => topic.topicTitle),
    routeSummary: params.route.summary,
    routeHighlights: params.route.days.map((day) => `${day.title}: ${day.goal}`)
  };
}

export function mergeManagerRecords(
  liveRecords: ManagerDashboardRecord[],
  demoRecords = demoManagerRecords
) {
  const recordsById = new Map<string, ManagerDashboardRecord>();

  for (const record of demoRecords) {
    recordsById.set(record.id, record);
  }

  for (const record of liveRecords) {
    recordsById.set(record.id, record);
  }

  return [...recordsById.values()].sort(
    (first, second) =>
      Date.parse(second.completedAt) - Date.parse(first.completedAt) ||
      first.name.localeCompare(second.name)
  );
}

export function readLiveManagerRecords(): ManagerDashboardRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawRecords = window.localStorage.getItem(BARISTA_MANAGER_STORAGE_KEY);
    if (!rawRecords) {
      return [];
    }

    const records = JSON.parse(rawRecords);
    return Array.isArray(records) ? records.filter(isManagerRecord) : [];
  } catch {
    return [];
  }
}

export function saveLiveManagerRecord(record: ManagerDashboardRecord) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const records = mergeManagerRecords([record], readLiveManagerRecords()).filter(
      (item) => !item.id.startsWith("demo-")
    );
    window.localStorage.setItem(BARISTA_MANAGER_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Dashboard persistence is demo-local; route generation should continue without it.
  }
}

function getRiskLevel(result: DiagnosticResult): ManagerRiskLevel {
  if (result.totalScorePercent < 65 || result.criticalTopics.length >= 2) {
    return "high";
  }

  if (result.totalScorePercent < 80 || result.criticalTopics.length >= 1) {
    return "medium";
  }

  return "low";
}

function getReadinessLabel(riskLevel: ManagerRiskLevel) {
  const labels: Record<ManagerRiskLevel, string> = {
    high: "Нужна поддержка перед сменой",
    medium: "Можно в смену с точечным контролем",
    low: "Готов к смене под обычным контролем"
  };

  return labels[riskLevel];
}

function buildManagerRecommendation(params: {
  riskLevel: ManagerRiskLevel;
  criticalTopicTitles: string[];
  weakTopicTitles: string[];
}) {
  const focusTopics =
    params.criticalTopicTitles.length > 0
      ? params.criticalTopicTitles
      : params.weakTopicTitles.slice(0, 2);

  if (params.riskLevel === "high") {
    return `Назначить наставника перед сменой: усилить ${formatTopicList(focusTopics)} и проверить выполнение обязательных блоков.`;
  }

  if (params.riskLevel === "medium") {
    return `Допустить к смене с точечным контролем: закрепить ${formatTopicList(focusTopics)} и вернуться к маршруту на день 7.`;
  }

  return "Закрепить сильные темы коротким контролем и оставить обычный контроль обязательных стандартов стойки.";
}

function formatTopicList(topics: string[]) {
  if (topics.length === 0) {
    return "ключевые темы маршрута";
  }

  return topics.slice(0, 3).join(", ");
}

function isManagerRecord(value: unknown): value is ManagerDashboardRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<ManagerDashboardRecord>;

  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    record.role === "barista" &&
    typeof record.totalScorePercent === "number" &&
    typeof record.completedAt === "string" &&
    Array.isArray(record.routeHighlights)
  );
}
