import { getLearningTopicMaterial } from "../model/learningRouteData";
import type {
  LearningRoute,
  LearningRouteDay,
  LearningRouteDayId,
  LearningTask,
  LearningTaskPriority,
  LearningTaskType
} from "../model/learningRouteTypes";
import type {
  DiagnosticResult,
  EmployeeProfile,
  EmployeeRole,
  TopicRecommendation,
  TopicScore
} from "../model/types";

const dayOrder: LearningRouteDayId[] = ["day_1", "day_7", "day_14"];

const routeDayTemplates: Record<
  EmployeeRole,
  Record<LearningRouteDayId, Omit<LearningRouteDay, "tasks">>
> = {
  cook: {
    day_1: {
      id: "day_1",
      title: "День 1",
      goal: "Спокойно войти в смену и закрыть обязательные риски кухни.",
      focus:
        "Гигиена, хранение, маркировка, техкарты и безопасная подготовка рабочего места."
    },
    day_7: {
      id: "day_7",
      title: "День 7",
      goal: "Закрепить слабые зоны на практике и увереннее выполнять типовые операции.",
      focus:
        "Практика по темам диагностики, повторение критичных стандартов и работа с типовыми ситуациями на станции."
    },
    day_14: {
      id: "day_14",
      title: "День 14",
      goal: "Проверить самостоятельность и стабильность качества в базовой смене.",
      focus:
        "Контроль качества, повторная проверка, финальное закрепление и короткие блоки по сильным темам."
    }
  },
  admin: {
    day_1: {
      id: "day_1",
      title: "День 1",
      goal: "Понять путь заказа и безопасно войти в коммуникацию с гостем.",
      focus:
        "Путь заказа, общение с гостем, касса, отмены, возвраты и взаимодействие с кухней."
    },
    day_7: {
      id: "day_7",
      title: "День 7",
      goal: "Отработать типовые ситуации и закрепить зоны развития.",
      focus:
        "Практика по заказам, оплате, претензиям, доставке, стоп-листу и обмену статусами с кухней."
    },
    day_14: {
      id: "day_14",
      title: "День 14",
      goal: "Подготовиться к более самостоятельной работе в типовой смене.",
      focus:
        "Итоговая проверка, отчётность, закрытие смены и закрепление оставшихся зон развития."
    }
  },
  barista: {
    day_1: {
      id: "day_1",
      title: "День 1",
      goal: "Спокойно войти за кофейную стойку и закрыть обязательные риски качества.",
      focus:
        "Гигиена, оборудование, эспрессо, молоко и базовые стандарты Valle Sanchez."
    },
    day_7: {
      id: "day_7",
      title: "День 7",
      goal: "Закрепить слабые зоны в напитках и увереннее работать в потоке.",
      focus:
        "Практика по эспрессо, молоку, рецептурам, сенсорике и работе под контролем наставника."
    },
    day_14: {
      id: "day_14",
      title: "День 14",
      goal: "Проверить стабильность напитков и готовность к типовой смене.",
      focus:
        "Повторная проверка эспрессо, молока, чистки оборудования и гостевой коммуникации."
    }
  }
};

const recommendationRank: Record<TopicRecommendation, number> = {
  full_module_with_mentor: 0,
  full_module: 1,
  short_module: 2,
  short_summary: 3,
  skip_detailed_module: 4
};

const importanceRank: Record<TopicScore["importance"], number> = {
  high: 0,
  medium: 1,
  low: 2
};

export function buildPersonalLearningRoute(params: {
  employee: EmployeeProfile;
  result: DiagnosticResult;
}): LearningRoute {
  const days = createRouteDays(params.employee.role);
  const sortedTopics = [...params.result.topicScores].sort(compareTopicsForRoute);

  days.day_1.tasks.push(
    createTask({
      id: "route-intro-diagnostic-summary",
      dayId: "day_1",
      title: "Разобрать персональный маршрут",
      description:
        "Посмотреть, какие темы диагностика предложила сократить, а какие лучше усилить в первые две недели.",
      type: "intro",
      priority: "required",
      estimatedMinutes: 10,
      source: "Результаты диагностики знаний",
      reason: `Маршрут собран автоматически для ${params.employee.name}: общий результат ${params.result.totalScorePercent}%, сильных зон — ${params.result.strongTopics.length}, зон развития — ${params.result.weakTopics.length}, обязательных блоков — ${params.result.requiredTopics.length}.`
    })
  );

  for (const topic of sortedTopics) {
    addTopicTasks({ days, topic });
  }

  days.day_14.tasks.push(
    createTask({
      id: "route-final-progress-check",
      dayId: "day_14",
      title: "Итоговая проверка маршрута",
      description:
        "Сверить выполненные задачи, заблокированные пункты и темы, которые стоит повторить перед следующей самостоятельной сменой.",
      type: "check",
      priority: "required",
      estimatedMinutes: 15,
      source: "Итоговый чек-лист адаптации",
      reason:
        params.result.criticalTopics.length > 0
          ? "Добавлено, чтобы спокойно вернуться к усиленным темам и убедиться, что поддержка по ним сработала."
          : "Добавлено как финальная контрольная точка после персонального маршрута."
    })
  );

  return {
    employeeId: params.employee.id,
    role: params.employee.role,
    grade: params.employee.grade,
    generatedAt: new Date().toISOString(),
    totalScorePercent: params.result.totalScorePercent,
    summary: buildRouteSummary(params.result),
    days: dayOrder.map((dayId) => days[dayId])
  };
}

function createRouteDays(role: EmployeeRole): Record<LearningRouteDayId, LearningRouteDay> {
  return {
    day_1: { ...routeDayTemplates[role].day_1, tasks: [] },
    day_7: { ...routeDayTemplates[role].day_7, tasks: [] },
    day_14: { ...routeDayTemplates[role].day_14, tasks: [] }
  };
}

function addTopicTasks(params: {
  days: Record<LearningRouteDayId, LearningRouteDay>;
  topic: TopicScore;
}) {
  const material = getLearningTopicMaterial(params.topic.topicId);
  const shortTitle = material?.shortTitle ?? params.topic.topicTitle;
  const source = material?.source ?? `Учебный материал: ${params.topic.topicTitle}`;
  const priority = getTaskPriority(params.topic);

  if (
    params.topic.recommendation === "skip_detailed_module" ||
    params.topic.recommendation === "short_summary"
  ) {
    const dayId: LearningRouteDayId = params.topic.required ? "day_1" : "day_14";
    const taskType: LearningTaskType = params.topic.required ? "check" : "summary";

    params.days[dayId].tasks.push(
      createTask({
        id: `${params.topic.topicId}-${dayId}-${taskType}`,
        dayId,
        topicId: params.topic.topicId,
        title: params.topic.required
          ? `Контрольный блок: ${shortTitle}`
          : `Короткое повторение: ${shortTitle}`,
        description:
          material?.summaryTask ??
          `Коротко повторить тему «${params.topic.topicTitle}» без полного учебного модуля.`,
        type: taskType,
        priority,
        estimatedMinutes: params.topic.required ? 12 : 8,
        source,
        reason: buildReason(params.topic)
      })
    );

    return;
  }

  if (params.topic.recommendation === "short_module") {
    const firstDayId: LearningRouteDayId = params.topic.required ? "day_1" : "day_7";
    const practiceDayId: LearningRouteDayId = params.topic.required ? "day_7" : "day_14";

    params.days[firstDayId].tasks.push(
      createTask({
        id: `${params.topic.topicId}-${firstDayId}-read`,
        dayId: firstDayId,
        topicId: params.topic.topicId,
        title: `Короткий модуль: ${shortTitle}`,
        description:
          material?.day1Task ??
          `Пройти короткий модуль по теме «${params.topic.topicTitle}».`,
        type: "read",
        priority,
        estimatedMinutes: 15,
        source,
        reason: buildReason(params.topic)
      })
    );
    params.days[practiceDayId].tasks.push(
      createTask({
        id: `${params.topic.topicId}-${practiceDayId}-practice`,
        dayId: practiceDayId,
        topicId: params.topic.topicId,
        title: `Практика: ${shortTitle}`,
        description:
          material?.practiceTask ??
          `Закрепить тему «${params.topic.topicTitle}» на коротком практическом задании.`,
        type: "practice",
        priority,
        estimatedMinutes: 20,
        source,
        reason: buildReason(params.topic)
      })
    );

    return;
  }

  const needsMentorPractice = params.topic.recommendation === "full_module_with_mentor";

  params.days.day_1.tasks.push(
    createTask({
      id: `${params.topic.topicId}-day_1-read`,
      dayId: "day_1",
      topicId: params.topic.topicId,
      title: `Полный модуль: ${shortTitle}`,
      description:
        material?.day1Task ??
        `Пройти подробный модуль по теме «${params.topic.topicTitle}».`,
      type: "read",
      priority,
      estimatedMinutes: needsMentorPractice ? 30 : 25,
      source,
      reason: buildReason(params.topic)
    })
  );

  params.days.day_7.tasks.push(
    createTask({
      id: `${params.topic.topicId}-day_7-practice`,
      dayId: "day_7",
      topicId: params.topic.topicId,
      title: needsMentorPractice
        ? `Практика под контролем управляющего: ${shortTitle}`
        : `Практика: ${shortTitle}`,
      description:
        material?.practiceTask ??
        `Закрепить тему «${params.topic.topicTitle}» на практическом задании.`,
      type: "practice",
      priority,
      estimatedMinutes: needsMentorPractice ? 35 : 25,
      source,
      reason: buildReason(params.topic)
    })
  );

  params.days.day_14.tasks.push(
    createTask({
      id: `${params.topic.topicId}-day_14-check`,
      dayId: "day_14",
      topicId: params.topic.topicId,
      title: `Повторная проверка: ${shortTitle}`,
      description:
        material?.checkTask ??
        `Пройти повторную проверку по теме «${params.topic.topicTitle}».`,
      type: "check",
      priority,
      estimatedMinutes: needsMentorPractice ? 15 : 12,
      source,
      reason: buildReason(params.topic)
    })
  );
}

function createTask(task: Omit<LearningTask, "status">): LearningTask {
  return {
    ...task,
    status: "todo"
  };
}

function buildReason(topic: TopicScore) {
  if (
    topic.required &&
    (topic.recommendation === "short_summary" ||
      topic.recommendation === "skip_detailed_module")
  ) {
    return "Обязательный блок сети: оставлен в маршруте даже при хорошем результате диагностики.";
  }

  if (
    topic.recommendation === "skip_detailed_module" ||
    topic.recommendation === "short_summary"
  ) {
    return "Тема сокращена: сотрудник уверенно ответил на вопросы по этому блоку.";
  }

  if (topic.recommendation === "short_module") {
    return topic.required
      ? "Обязательный блок сети требует короткого повторения и практического закрепления."
      : "По результату диагностики достаточно короткого модуля и одной практической задачи.";
  }

  if (topic.recommendation === "full_module_with_mentor") {
    return topic.required
      ? "Обязательный блок сети лучше усилить полным модулем, практикой и повторной проверкой с поддержкой управляющего."
      : "Диагностика показала критичную зону развития: добавлены полный модуль, практика и повторная проверка.";
  }

  return topic.required
    ? "Обязательный блок сети лучше усилить полным модулем, практикой и повторной проверкой."
    : "Зона развития по диагностике: тема получает полный модуль, практику и повторную проверку.";
}

function getTaskPriority(topic: TopicScore): LearningTaskPriority {
  if (topic.required) {
    return "required";
  }

  if (
    topic.recommendation === "skip_detailed_module" ||
    topic.recommendation === "short_summary"
  ) {
    return "optional";
  }

  return "recommended";
}

function buildRouteSummary(result: DiagnosticResult) {
  const base =
    "Маршрут собран автоматически на основе диагностики: сильные темы сокращены, слабые усилены, обязательные блоки оставлены в программе.";

  if (result.criticalTopics.length > 0) {
    return `${base} Особый фокус — ${result.criticalTopics.length} тем(ы), где требуется поддержка и повторная проверка.`;
  }

  if (result.weakTopics.length > 0) {
    return `${base} Основной фокус — закрепить ${result.weakTopics.length} зон(ы) развития через практику.`;
  }

  return `${base} Основной фокус — быстрое повторение обязательных стандартов и контроль самостоятельности.`;
}

function compareTopicsForRoute(first: TopicScore, second: TopicScore) {
  if (first.required !== second.required) {
    return first.required ? -1 : 1;
  }

  const recommendationDiff =
    recommendationRank[first.recommendation] - recommendationRank[second.recommendation];
  if (recommendationDiff !== 0) {
    return recommendationDiff;
  }

  const importanceDiff = importanceRank[first.importance] - importanceRank[second.importance];
  if (importanceDiff !== 0) {
    return importanceDiff;
  }

  const scoreDiff = first.scorePercent - second.scorePercent;
  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  return first.topicId.localeCompare(second.topicId);
}
