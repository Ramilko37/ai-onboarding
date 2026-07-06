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
  "admin-reporting": { shortTitle: "Отчётность", role: "admin", source: "Инструкция по сменной отчётности" },
  "barista-hygiene": { shortTitle: "Гигиена стойки", role: "barista", source: "Demo KB · Стандарт гигиены кофейной стойки" },
  "barista-beans-storage": { shortTitle: "Зерно и хранение", role: "barista", source: "Demo KB · Стандарт хранения зерна" },
  "barista-espresso-setup": { shortTitle: "Настройка эспрессо", role: "barista", source: "Материалы методолога · День 1: Эспрессо" },
  "barista-grind-dose-tamp": { shortTitle: "Помол, доза и трамбовка", role: "barista", source: "Материалы методолога · День 1: Эспрессо" },
  "barista-extraction-sensory": { shortTitle: "Экстракция и сенсорика", role: "barista", source: "Материалы методолога · День 1: Эспрессо" },
  "barista-milk-texture": { shortTitle: "Молоко и текстура", role: "barista", source: "Материалы методолога · День 1: Эспрессо" },
  "barista-drink-recipes": { shortTitle: "Рецептуры напитков", role: "barista", source: "Материалы методолога · День 1: Эспрессо" },
  "barista-equipment-cleaning": { shortTitle: "Чистка оборудования", role: "barista", source: "Demo KB · Чек-лист чистки кофейного оборудования" },
  "barista-service-flow": { shortTitle: "Работа в потоке", role: "barista", source: "Demo KB · Стандарт работы в пиковый поток" },
  "barista-guest-communication": { shortTitle: "Коммуникация с гостем", role: "barista", source: "Demo KB · Стандарт гостевого диалога" }
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

  if (config.role === "admin") {
    return {
      ...config,
      day1Task: `Разобрать материал «${config.shortTitle}»: путь гостя или заказа, обязательные поля, корректные формулировки и источник актуального правила.`,
      practiceTask: `Отработать учебный сценарий по теме «${config.shortTitle}» и зафиксировать следующий шаг так, как это сделал бы администратор в смене.`,
      checkTask: `Пройти короткую проверку по теме «${config.shortTitle}»: статус, коммуникация с гостем, фиксация обращения и обмен информацией с кухней.`,
      summaryTask: `Коротко повторить «${config.shortTitle}» и отметить, где смотреть актуальные условия или регламент перед ответом гостю.`
    };
  }

  return {
    ...config,
    day1Task: `Разобрать стандарт «${config.shortTitle}»: что проверить до первого напитка, где источник правила и когда остановиться для уточнения у наставника.`,
    practiceTask: `Отработать учебный сценарий по теме «${config.shortTitle}» на стойке: подготовка, выполнение, самопроверка качества и короткая обратная связь.`,
    checkTask: `Пройти повторную проверку по теме «${config.shortTitle}»: стабильность напитка, безопасность, чистота оборудования и момент обращения к старшему бариста.`,
    summaryTask: `Коротко повторить «${config.shortTitle}» и отметить 2–3 действия, которые нужно держать в каждой кофейной смене.`
  };
}
