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

type LearningTopicConfig = Pick<
  LearningTopicMaterial,
  "shortTitle" | "role" | "source"
>;

const topicConfigs: Record<string, LearningTopicConfig> = {
  "cook-hygiene": { shortTitle: "Гигиена и безопасность", role: "cook", source: "Санитарный стандарт кухни" },
  "cook-storage": { shortTitle: "Хранение ингредиентов", role: "cook", source: "Регламент хранения продуктов" },
  "cook-labeling": { shortTitle: "Маркировка и сроки", role: "cook", source: "Регламент хранения и маркировки продуктов" },
  "cook-tech-cards": { shortTitle: "Техкарты популярных роллов", role: "cook", source: "Техкарты популярных роллов" },
  "cook-assembly": { shortTitle: "Нарезка и сборка", role: "cook", source: "Стандарт нарезки и сборки" },
  "cook-packaging": { shortTitle: "Упаковка заказа", role: "cook", source: "Стандарт упаковки заказа" },
  "cook-defects": { shortTitle: "Работа с браком", role: "cook", source: "Стандарты качества продукта" },
  "cook-shift": { shortTitle: "Открытие и закрытие смены", role: "cook", source: "Чек-лист закрытия кухни" },
  "cook-equipment": { shortTitle: "Оборудование", role: "cook", source: "Инструкция по безопасной работе с оборудованием" },
  "cook-product-matrix": { shortTitle: "Продуктовая матрица", role: "cook", source: "Продуктовая матрица сети" },
  "admin-communication": { shortTitle: "Общение с гостем", role: "admin", source: "Стандарт общения с гостем" },
  "admin-orders": { shortTitle: "Приём и обработка заказа", role: "admin", source: "Регламент приёма заказа" },
  "admin-payment": { shortTitle: "Касса и оплата", role: "admin", source: "Кассовый регламент" },
  "admin-refunds": { shortTitle: "Отмена и возврат заказа", role: "admin", source: "Инструкция по отмене и возврату заказа" },
  "admin-complaints": { shortTitle: "Работа с претензиями", role: "admin", source: "Регламент работы с задержками и претензиями" },
  "admin-kitchen": { shortTitle: "Взаимодействие с кухней", role: "admin", source: "Регламент взаимодействия администратора и кухни" },
  "admin-delivery": { shortTitle: "Доставка и самовывоз", role: "admin", source: "Регламент доставки и самовывоза" },
  "admin-discounts": { shortTitle: "Акции и скидки", role: "admin", source: "Регламент акций и скидок" },
  "admin-shift-close": { shortTitle: "Закрытие смены", role: "admin", source: "Чек-лист закрытия смены" },
  "admin-reporting": { shortTitle: "Отчётность", role: "admin", source: "Инструкция по сменной отчётности" }
};

export const learningTopicMaterials = Object.fromEntries(
  Object.entries(topicConfigs).map(([topicId, config]) => [
    topicId,
    createLearningTopicMaterial(config)
  ])
) as Record<string, LearningTopicMaterial>;

export function getLearningTopicMaterial(topicId: string) {
  return learningTopicMaterials[topicId];
}

function createLearningTopicMaterial(
  config: LearningTopicConfig
): LearningTopicMaterial {
  if (config.role === "cook") {
    return {
      ...config,
      day1Task: `Разобрать материал «${config.shortTitle}»: что проверить до начала работы, какие действия нельзя выполнять по памяти и где смотреть актуальный стандарт.`,
      practiceTask: `Выполнить учебную операцию по теме «${config.shortTitle}» на рабочем месте или демо-сценарии и сверить результат с чек-листом.`,
      checkTask: `Пройти короткую проверку по теме «${config.shortTitle}»: безопасное действие, контроль качества и момент обращения к старшему смены.`,
      summaryTask: `Коротко повторить «${config.shortTitle}» и отметить 2–3 действия, которые нужно выполнять в каждой смене.`
    };
  }

  return {
    ...config,
    day1Task: `Разобрать материал «${config.shortTitle}»: путь гостя или заказа, обязательные поля, корректные формулировки и источник актуального правила.`,
    practiceTask: `Отработать учебный сценарий по теме «${config.shortTitle}» и зафиксировать следующий шаг так, как это сделал бы администратор в смене.`,
    checkTask: `Пройти короткую проверку по теме «${config.shortTitle}»: статус, коммуникация с гостем, фиксация обращения и обмен информацией с кухней.`,
    summaryTask: `Коротко повторить «${config.shortTitle}» и отметить, где смотреть актуальные условия или регламент перед ответом гостю.`
  };
}
