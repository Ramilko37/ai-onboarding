import { retrieveKnowledge, type KnowledgeSearchResult } from "./retrieveKnowledge";
import type {
  CompetencyTopic,
  DiagnosticResult,
  EmployeeProfile,
  EmployeeRole,
  LearningModule,
  LearningModuleFormat,
  LearningPath,
  LearningPathDay,
  LearningPathDayNumber,
  LearningPathModule,
  LearningPathSource,
  LearningPathTopicSummary,
  LearningPriority,
  ManagerRecommendation,
  Skippable,
  TopicScore
} from "../model/types";

type LearningFormatDecision = LearningModuleFormat | "skip";

type TopicPlan = {
  topic: CompetencyTopic;
  score: TopicScore;
  format: LearningFormatDecision;
  priority: LearningPriority;
  baseDay: LearningPathDayNumber;
  modules: LearningPathModule[];
  sources: LearningPathSource[];
  skipped: boolean;
  hasMentorTask: boolean;
  isCriticalTopic: boolean;
};

const CRITICAL_COOK_TOPICS = [
  "cook-hygiene",
  "cook-storage",
  "cook-labeling",
  "cook-defects",
  "cook-tech-cards"
] as const;

const CRITICAL_ADMIN_TOPICS = [
  "admin-payment",
  "admin-refunds",
  "admin-complaints",
  "admin-orders",
  "admin-communication"
] as const;

const COOK_TOPIC_BASE_DAYS: Record<string, LearningPathDayNumber> = {
  "cook-hygiene": 1,
  "cook-storage": 2,
  "cook-labeling": 2,
  "cook-tech-cards": 3,
  "cook-assembly": 4,
  "cook-defects": 5,
  "cook-packaging": 6,
  "cook-product-matrix": 6,
  "cook-equipment": 9,
  "cook-shift": 11
};

const ADMIN_TOPIC_BASE_DAYS: Record<string, LearningPathDayNumber> = {
  "admin-communication": 1,
  "admin-orders": 2,
  "admin-payment": 3,
  "admin-refunds": 4,
  "admin-complaints": 5,
  "admin-kitchen": 6,
  "admin-delivery": 6,
  "admin-discounts": 8,
  "admin-reporting": 10,
  "admin-shift-close": 12
};

const COOK_DAY_FOCUS: Record<LearningPathDayNumber, string> = {
  1: "Безопасный старт кухни",
  2: "Хранение и маркировка",
  3: "Техкарты и стандарты",
  4: "Сборка и визуальный контроль",
  5: "Качество и работа с браком",
  6: "Упаковка, меню и передача заказа",
  7: "Промежуточная проверка первой недели",
  8: "Закрепление типовых операций",
  9: "Оборудование и готовность станции",
  10: "Практика на рабочей зоне",
  11: "Открытие и закрытие смены",
  12: "Стабильность в загрузке",
  13: "Повторение зон развития",
  14: "Готовность к самостоятельной работе"
};

const ADMIN_DAY_FOCUS: Record<LearningPathDayNumber, string> = {
  1: "Гость, тон общения и старт смены",
  2: "Приём и обработка заказа",
  3: "Касса, оплата и статусы",
  4: "Отмены, возвраты и фиксация",
  5: "Претензии и сложные обращения",
  6: "Кухня, доставка и самовывоз",
  7: "Промежуточная проверка первой недели",
  8: "Акции, скидки и правила согласования",
  9: "Закрепление операционных сценариев",
  10: "Отчётность и сменные риски",
  11: "Передача открытых вопросов",
  12: "Закрытие смены",
  13: "Повторение зон развития",
  14: "Готовность к самостоятельной смене"
};

const DAY_NUMBERS: LearningPathDayNumber[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14
];

const DAY_LIMITS: Record<LearningPathDayNumber, number> = {
  1: 60,
  2: 45,
  3: 45,
  4: 45,
  5: 45,
  6: 45,
  7: 30,
  8: 30,
  9: 30,
  10: 30,
  11: 30,
  12: 30,
  13: 30,
  14: 30
};

const PRIORITY_WEIGHT: Record<LearningPriority, number> = {
  high: 0,
  medium: 1,
  low: 2
};

export function buildLearningPath(params: {
  employee: EmployeeProfile;
  diagnosticResult: DiagnosticResult;
  topics: CompetencyTopic[];
  learningModules: LearningModule[];
}): LearningPath {
  const { employee, diagnosticResult, topics, learningModules } = params;
  const roleTopics = topics.filter((topic) => topic.role === employee.role);
  const topicsById = new Map(roleTopics.map((topic) => [topic.id, topic]));
  const topicPlans = diagnosticResult.topicScores
    .map((score) => {
      const topic = topicsById.get(score.topicId);

      if (!topic) {
        return null;
      }

      return buildTopicPlan({
        employee,
        score,
        topic,
        learningModules
      });
    })
    .filter((plan): plan is TopicPlan => Boolean(plan));
  const selectedPlans = topicPlans.filter((plan) => !plan.skipped);
  const sortedPlans = sortPlansByPriority(selectedPlans);
  const days = distributeModulesAcross14Days(sortedPlans, employee.role);
  const metrics = calculateLearningPathMetrics({
    role: employee.role,
    allTopics: roleTopics,
    selectedPlans
  });
  const shortenedTopics = buildShortenedTopics(topicPlans);
  const strengthenedTopics = buildStrengthenedTopics(topicPlans);
  const criticalTopics = buildCriticalTopics(topicPlans);

  return {
    id: createLearningPathId(employee, diagnosticResult),
    employeeId: employee.id,
    role: employee.role,
    grade: employee.grade,
    basedOnDiagnosticResultId: getDiagnosticResultId(diagnosticResult),
    summary: buildLearningPathSummary({
      shortenedTopics,
      strengthenedTopics,
      criticalTopics
    }),
    totalStandardMinutes: metrics.totalStandardMinutes,
    totalPersonalizedMinutes: metrics.totalPersonalizedMinutes,
    savedMinutes: metrics.savedMinutes,
    savedPercent: metrics.savedPercent,
    shortenedTopics,
    strengthenedTopics,
    criticalTopics,
    days,
    managerRecommendations: buildManagerRecommendations({
      employee,
      topicPlans
    }),
    createdAt: new Date().toISOString()
  };
}

export function getLearningFormat(params: {
  scorePercent: number;
  required: boolean;
  skippable: Skippable;
}): LearningFormatDecision {
  const { scorePercent, required, skippable } = params;

  if (required) {
    if (scorePercent >= 80) {
      return "summary";
    }

    if (scorePercent >= 60) {
      return "short_module";
    }

    return "full_module";
  }

  if (scorePercent >= 80 && skippable === true) {
    return "skip";
  }

  if (scorePercent >= 80) {
    return "summary";
  }

  if (scorePercent >= 60) {
    return "short_module";
  }

  return "full_module";
}

export function shouldAddMentorTask(params: {
  topicId: string;
  role: EmployeeRole;
  scorePercent: number;
  required: boolean;
}) {
  return (
    params.scorePercent < 40 ||
    (params.required && params.scorePercent < 60) ||
    (isCriticalTopic(params.topicId, params.role) && params.scorePercent < 60)
  );
}

export function getTopicPriority(
  topicId: string,
  role: EmployeeRole
): LearningPriority {
  if (role === "cook") {
    if (isOneOf(topicId, CRITICAL_COOK_TOPICS)) {
      return "high";
    }

    if (
      topicId === "cook-assembly" ||
      topicId === "cook-packaging" ||
      topicId === "cook-product-matrix"
    ) {
      return "medium";
    }

    return "low";
  }

  if (isOneOf(topicId, CRITICAL_ADMIN_TOPICS)) {
    return "high";
  }

  if (
    topicId === "admin-kitchen" ||
    topicId === "admin-delivery" ||
    topicId === "admin-discounts"
  ) {
    return "medium";
  }

  return "low";
}

export function getBaseDay(
  topicId: string,
  role: EmployeeRole
): LearningPathDayNumber {
  const fallbackDay: LearningPathDayNumber = 7;

  if (role === "cook") {
    return COOK_TOPIC_BASE_DAYS[topicId] ?? fallbackDay;
  }

  return ADMIN_TOPIC_BASE_DAYS[topicId] ?? fallbackDay;
}

export function sortPlansByPriority(plans: TopicPlan[]): TopicPlan[] {
  return [...plans].sort((left, right) => {
    if (left.topic.required !== right.topic.required) {
      return left.topic.required ? -1 : 1;
    }

    const leftCriticalGap = left.score.status === "critical_gap";
    const rightCriticalGap = right.score.status === "critical_gap";

    if (leftCriticalGap !== rightCriticalGap) {
      return leftCriticalGap ? -1 : 1;
    }

    if (left.priority !== right.priority) {
      return PRIORITY_WEIGHT[left.priority] - PRIORITY_WEIGHT[right.priority];
    }

    if (left.score.scorePercent !== right.score.scorePercent) {
      return left.score.scorePercent - right.score.scorePercent;
    }

    return left.baseDay - right.baseDay;
  });
}

export function distributeModulesAcross14Days(
  plans: TopicPlan[],
  role: EmployeeRole
): LearningPathDay[] {
  const days = createEmptyDays(role);
  const minutesByDay = new Map<LearningPathDayNumber, number>(
    DAY_NUMBERS.map((day) => [day, 0])
  );

  for (const plan of plans) {
    let lastPlacedDay = plan.baseDay;

    for (const module of plan.modules) {
      const preferredDay =
        module.format === "mentor_task"
          ? nextDay(lastPlacedDay)
          : plan.baseDay;
      const day = findAvailableDay({
        fromDay: preferredDay,
        durationMinutes: module.durationMinutes,
        minutesByDay
      });
      const target = days[day - 1];
      target.modules.push(module);
      minutesByDay.set(day, (minutesByDay.get(day) ?? 0) + module.durationMinutes);
      lastPlacedDay = day;
    }
  }

  return days;
}

export function calculateLearningPathMetrics(params: {
  role: EmployeeRole;
  allTopics: CompetencyTopic[];
  selectedPlans: TopicPlan[];
}) {
  const totalStandardMinutes = params.allTopics.filter(
    (topic) => topic.role === params.role
  ).length * 40;
  const totalPersonalizedMinutes = params.selectedPlans.reduce(
    (sum, plan) =>
      sum +
      plan.modules.reduce(
        (modulesSum, module) => modulesSum + module.durationMinutes,
        0
      ),
    0
  );
  const savedMinutes = totalStandardMinutes - totalPersonalizedMinutes;
  const savedPercent =
    totalStandardMinutes === 0
      ? 0
      : Math.round((savedMinutes / totalStandardMinutes) * 100);

  return {
    totalStandardMinutes,
    totalPersonalizedMinutes,
    savedMinutes,
    savedPercent
  };
}

export function buildManagerRecommendations(params: {
  employee: EmployeeProfile;
  topicPlans: TopicPlan[];
}): ManagerRecommendation[] {
  return params.topicPlans
    .filter((plan) => shouldBuildManagerRecommendation(plan))
    .map((plan) => {
      const source = plan.sources[0];
      const suggestedDay =
        plan.baseDay <= 1 ? 1 : plan.baseDay <= 7 ? 7 : 14;

      return {
        id: `mr-${params.employee.id}-${plan.topic.id}`,
        employeeId: params.employee.id,
        topicId: plan.topic.id,
        title: `Review по теме: ${plan.topic.title}`,
        text: buildManagerRecommendationText(plan, source),
        priority:
          plan.score.scorePercent < 40 || plan.topic.required
            ? "high"
            : plan.priority,
        suggestedDay,
        sources: plan.sources
      };
    });
}

function buildTopicPlan(params: {
  employee: EmployeeProfile;
  score: TopicScore;
  topic: CompetencyTopic;
  learningModules: LearningModule[];
}): TopicPlan {
  const { employee, score, topic, learningModules } = params;
  const priority = getTopicPriority(topic.id, employee.role);
  const baseDay = getBaseDay(topic.id, employee.role);
  const format = getLearningFormat({
    scorePercent: score.scorePercent,
    required: topic.required,
    skippable: topic.skippable
  });
  const sources = mapKnowledgeSources(
    retrieveKnowledge({
      role: employee.role,
      topicId: topic.id,
      query: topic.title,
      limit: 3
    })
  );
  const criticalTopic = isCriticalTopic(topic.id, employee.role);

  if (format === "skip") {
    return {
      topic,
      score,
      format,
      priority,
      baseDay,
      modules: [],
      sources,
      skipped: true,
      hasMentorTask: false,
      isCriticalTopic: criticalTopic
    };
  }

  const primaryModule = selectLearningModule({
    modules: learningModules,
    role: employee.role,
    topicId: topic.id,
    format
  });
  const shouldAddPractice =
    score.scorePercent < 60 || (criticalTopic && score.scorePercent < 80);
  const practiceModule = shouldAddPractice
    ? selectLearningModule({
        modules: learningModules,
        role: employee.role,
        topicId: topic.id,
        format: "practice"
      })
    : null;
  const mentorModule = shouldAddMentorTask({
    topicId: topic.id,
    role: employee.role,
    scorePercent: score.scorePercent,
    required: topic.required
  })
    ? selectLearningModule({
        modules: learningModules,
        role: employee.role,
        topicId: topic.id,
        format: "mentor_task"
      })
    : null;
  const modules = [primaryModule, practiceModule, mentorModule]
    .filter((module): module is LearningModule => Boolean(module))
    .map((module) =>
      buildLearningPathModule({
        module,
        topic,
        score,
        priority,
        sources
      })
    );

  return {
    topic,
    score,
    format,
    priority,
    baseDay,
    modules,
    sources,
    skipped: false,
    hasMentorTask: Boolean(mentorModule),
    isCriticalTopic: criticalTopic
  };
}

export function selectLearningModule(params: {
  modules: LearningModule[];
  role: EmployeeRole;
  topicId: string;
  format: LearningModuleFormat;
}): LearningModule | null {
  const exactMatch = params.modules.find(
    (module) =>
      module.role === params.role &&
      module.topicId === params.topicId &&
      module.format === params.format
  );

  if (exactMatch) {
    return exactMatch;
  }

  if (params.format === "practice" || params.format === "mentor_task") {
    return null;
  }

  const shortModule = params.modules.find(
    (module) =>
      module.role === params.role &&
      module.topicId === params.topicId &&
      module.format === "short_module"
  );

  if (shortModule) {
    return shortModule;
  }

  return (
    params.modules.find(
      (module) =>
        module.role === params.role &&
        module.topicId === params.topicId &&
        module.format === "summary"
    ) ?? null
  );
}

function buildLearningPathModule(params: {
  module: LearningModule;
  topic: CompetencyTopic;
  score: TopicScore;
  priority: LearningPriority;
  sources: LearningPathSource[];
}): LearningPathModule {
  const { module, topic, score, priority, sources } = params;

  return {
    id: `lpm-${module.id}`,
    moduleId: module.id,
    topicId: topic.id,
    title: module.title,
    format: module.format,
    durationMinutes: module.durationMinutes,
    priority,
    required: topic.required || module.required,
    reason: buildModuleReason({
      format: module.format,
      topic,
      score,
      sources
    }),
    sources
  };
}

function buildModuleReason(params: {
  format: LearningModuleFormat;
  topic: CompetencyTopic;
  score: TopicScore;
  sources: LearningPathSource[];
}) {
  const source = params.sources[0];
  const sourceText = source
    ? `Она связана со стандартом УК: "${source.title}".`
    : "Источник в базе знаний не найден, рекомендуется уточнить стандарт у управляющего.";
  const requiredText = params.topic.required
    ? "Обязательная тема не пропускается полностью. "
    : "";
  const scoreText = `Диагностика по теме: ${params.score.scorePercent}%.`;

  if (params.format === "summary" || params.format === "check") {
    return `${requiredText}Тема сокращена до контрольного блока, потому что диагностика показала уверенное понимание. ${scoreText} ${sourceText}`;
  }

  if (params.format === "short_module") {
    return `${requiredText}Тема назначена в коротком формате, чтобы спокойно освежить стандарт. ${scoreText} ${sourceText}`;
  }

  if (params.format === "practice") {
    return `${requiredText}Добавлена практика, чтобы закрепить тему на рабочем кейсе. ${scoreText} ${sourceText}`;
  }

  if (params.format === "mentor_task") {
    return `${requiredText}Добавлена поддержка наставника или управляющего, потому что тема влияет на устойчивую работу смены. ${scoreText} ${sourceText}`;
  }

  return `${requiredText}Тема назначена, потому что диагностика показала зону развития. ${scoreText} ${sourceText}`;
}

function findAvailableDay(params: {
  fromDay: LearningPathDayNumber;
  durationMinutes: number;
  minutesByDay: Map<LearningPathDayNumber, number>;
}): LearningPathDayNumber {
  const startIndex = DAY_NUMBERS.indexOf(params.fromDay);
  const candidateDays = DAY_NUMBERS.slice(Math.max(startIndex, 0));

  for (const day of candidateDays) {
    const currentMinutes = params.minutesByDay.get(day) ?? 0;

    if (currentMinutes + params.durationMinutes <= DAY_LIMITS[day]) {
      return day;
    }
  }

  return 14;
}

function createEmptyDays(role: EmployeeRole): LearningPathDay[] {
  const focusByDay = role === "cook" ? COOK_DAY_FOCUS : ADMIN_DAY_FOCUS;

  return DAY_NUMBERS.map((day) => ({
    day,
    title: `День ${day}`,
    focus: focusByDay[day],
    modules: [],
    checkpoint: getCheckpoint(day)
  }));
}

function getCheckpoint(day: LearningPathDayNumber) {
  if (day === 7) {
    return {
      title: "Промежуточная проверка",
      description:
        "Короткая проверка по темам, которые требовали внимания в первую неделю."
    };
  }

  if (day === 14) {
    return {
      title: "Итоговая проверка готовности",
      description:
        "Проверка готовности к самостоятельной работе в типовых ситуациях."
    };
  }

  return undefined;
}

function nextDay(day: LearningPathDayNumber): LearningPathDayNumber {
  return Math.min(day + 1, 14) as LearningPathDayNumber;
}

function buildShortenedTopics(plans: TopicPlan[]): LearningPathTopicSummary[] {
  return plans
    .filter(
      (plan) =>
        plan.skipped ||
        plan.format === "summary" ||
        plan.format === "short_module"
    )
    .map((plan) => ({
      topicId: plan.topic.id,
      title: plan.topic.title,
      scorePercent: plan.score.scorePercent,
      reason: plan.skipped
        ? "Тема хорошо знакома и может быть пропущена в подробном маршруте."
        : "Тема сокращена до короткого повторения или контрольного блока."
    }));
}

function buildStrengthenedTopics(plans: TopicPlan[]): LearningPathTopicSummary[] {
  return plans
    .filter(
      (plan) =>
        plan.format === "full_module" ||
        plan.modules.some(
          (module) =>
            module.format === "practice" || module.format === "mentor_task"
        )
    )
    .map((plan) => ({
      topicId: plan.topic.id,
      title: plan.topic.title,
      scorePercent: plan.score.scorePercent,
      reason: plan.hasMentorTask
        ? "Маршрут усилен поддержкой наставника или управляющего."
        : "Маршрут усилен подробным модулем и практическим закреплением."
    }));
}

function buildCriticalTopics(plans: TopicPlan[]): LearningPathTopicSummary[] {
  return plans
    .filter(
      (plan) =>
        plan.score.status === "critical_gap" ||
        (plan.isCriticalTopic && plan.score.scorePercent < 60) ||
        (plan.topic.required && plan.score.scorePercent < 60)
    )
    .map((plan) => ({
      topicId: plan.topic.id,
      title: plan.topic.title,
      scorePercent: plan.score.scorePercent,
      reason: "Тема требует внимания управляющего, потому что влияет на безопасность, качество или самостоятельную работу."
    }));
}

function buildLearningPathSummary(params: {
  shortenedTopics: LearningPathTopicSummary[];
  strengthenedTopics: LearningPathTopicSummary[];
  criticalTopics: LearningPathTopicSummary[];
}) {
  const parts = [
    "Я собрал для тебя персональный маршрут на 14 дней.",
    "Мы сократили темы, которые уже хорошо знакомы, и сделали акцент на зонах, которые помогут быстрее и спокойнее выйти на смену.",
    "Маршрут построен на основе диагностики и стандартов управляющей компании."
  ];

  if (params.shortenedTopics.length >= 2) {
    parts.push(
      "По диагностике видно, что часть тем уже знакома. Поэтому подробное обучение по ним сокращено до коротких резюме и контрольных чеков."
    );
  }

  if (params.strengthenedTopics.length >= 2) {
    parts.push(
      "Диагностика показала несколько тем, где лучше дать больше поддержки. Это нормально для старта: маршрут построен так, чтобы идти постепенно и не перегружать первый день."
    );
  }

  if (params.criticalTopics.length > 0) {
    parts.push(
      "По нескольким темам я добавил поддержку управляющего или наставника. Это поможет быстрее разобраться на практике и увереннее чувствовать себя на смене."
    );
  }

  return parts.join("\n\n");
}

function shouldBuildManagerRecommendation(plan: TopicPlan) {
  return (
    plan.score.scorePercent < 40 ||
    (plan.topic.required && plan.score.scorePercent < 60) ||
    plan.hasMentorTask ||
    (plan.isCriticalTopic && plan.score.scorePercent < 80)
  );
}

function buildManagerRecommendationText(
  plan: TopicPlan,
  source: LearningPathSource | undefined
) {
  const sourceText = source
    ? `Связанный стандарт: "${source.title}".`
    : "Источник в базе знаний не найден, рекомендуется уточнить стандарт у управляющего.";
  const action =
    plan.topic.role === "cook"
      ? "Проверьте с сотрудником правило на рабочей зоне и разберите короткий практический пример."
      : "Разберите с сотрудником типовой сценарий и проверьте, как он фиксирует факты в системе или сменном комментарии.";

  return `${action} Диагностика показала ${plan.score.scorePercent}% по теме "${plan.topic.title}", поэтому тема требует поддержки в адаптации. ${sourceText} Используйте review как помощь в обучении, не как HR-решение.`;
}

function mapKnowledgeSources(
  results: KnowledgeSearchResult[]
): LearningPathSource[] {
  return results.map((result) => ({
    documentId: result.documentId,
    title: result.title,
    sourceType: result.sourceType
  }));
}

function isCriticalTopic(topicId: string, role: EmployeeRole) {
  return role === "cook"
    ? isOneOf(topicId, CRITICAL_COOK_TOPICS)
    : isOneOf(topicId, CRITICAL_ADMIN_TOPICS);
}

function isOneOf<T extends readonly string[]>(value: string, items: T) {
  return items.some((item) => item === value);
}

function createLearningPathId(
  employee: EmployeeProfile,
  diagnosticResult: DiagnosticResult
) {
  const completedAt = diagnosticResult.completedAt.replace(/[^a-zA-Z0-9]/g, "");

  return `lp-${employee.id}-${completedAt}`;
}

function getDiagnosticResultId(diagnosticResult: DiagnosticResult) {
  const resultWithId = diagnosticResult as DiagnosticResult & { id?: string };

  return resultWithId.id;
}
