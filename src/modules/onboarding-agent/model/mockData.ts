import type {
  CompetencyMilestone,
  CompetencyTopic,
  EmployeeGrade,
  EmployeeRole
} from "./types";

export const roleOptions: Array<{
  value: EmployeeRole;
  label: string;
  description: string;
}> = [
  {
    value: "barista",
    label: "Бариста",
    description:
      "Кофейная стойка, эспрессо, молоко, рецептуры, оборудование и гостевой поток."
  }
];

export const gradeOptions: Array<{
  value: EmployeeGrade;
  label: string;
  description: string;
}> = [
  {
    value: "no_experience",
    label: "Без опыта",
    description: "Нужен спокойный старт с базовыми процессами и терминами."
  },
  {
    value: "horeca_experience",
    label: "Есть опыт в HORECA",
    description: "Можно быстрее пройти общие темы и сфокусироваться на стандартах сети."
  },
  {
    value: "network_experience",
    label: "Опытный сотрудник сети",
    description: "Диагностика поможет уточнить, что стоит освежить в новой точке."
  }
];

export const competencyMilestones: CompetencyMilestone[] = [
  {
    day: 1,
    role: "cook",
    goal: "Безопасно войти в рабочий процесс.",
    competencies: [
      "гигиена и безопасность",
      "форма и рабочее место",
      "базовые правила кухни",
      "структура меню",
      "кто за что отвечает на смене"
    ]
  },
  {
    day: 7,
    role: "cook",
    goal: "Выполнять типовые операции под контролем.",
    competencies: [
      "простые позиции",
      "заготовки",
      "упаковка",
      "маркировка",
      "соблюдение техкарт",
      "работа на одной станции"
    ]
  },
  {
    day: 14,
    role: "cook",
    goal: "Выйти на базовую самостоятельность.",
    competencies: [
      "стабильное качество",
      "скорость",
      "знание популярных позиций",
      "минимизация брака",
      "понимание процессов смены"
    ]
  },
  {
    day: 1,
    role: "admin",
    goal: "Понять путь заказа и стандарты общения с гостем.",
    competencies: [
      "как приходит заказ",
      "как обрабатывается заказ",
      "как общаться с гостем",
      "как эскалировать проблемы",
      "как взаимодействовать с кухней"
    ]
  },
  {
    day: 7,
    role: "admin",
    goal: "Обрабатывать типовые ситуации.",
    competencies: [
      "приём заказов",
      "доставка и самовывоз",
      "статусы заказов",
      "простые претензии",
      "взаимодействие с кухней"
    ]
  },
  {
    day: 14,
    role: "admin",
    goal: "Уверенно работать в типовой смене.",
    competencies: [
      "отмены",
      "возвраты",
      "стоп-лист",
      "касса",
      "отчётность",
      "закрытие смены"
    ]
  },
  {
    day: 1,
    role: "barista",
    goal: "Безопасно войти за кофейную стойку и закрыть обязательные стандарты.",
    competencies: [
      "гигиена рук и станции",
      "чистка группы и питчера",
      "базовая настройка эспрессо",
      "хранение зерна",
      "рецептуры базовых напитков"
    ]
  },
  {
    day: 7,
    role: "barista",
    goal: "Стабильно готовить базовые напитки под контролем наставника.",
    competencies: [
      "помол, доза и трамбовка",
      "экстракция и сенсорика",
      "текстура молока",
      "латте и капучино",
      "работа в утреннем потоке"
    ]
  },
  {
    day: 14,
    role: "barista",
    goal: "Подтвердить базовую самостоятельность в кофейной смене.",
    competencies: [
      "повторяемость эспрессо",
      "молочная графика базового уровня",
      "скорость без потери качества",
      "коммуникация с гостем",
      "контроль чистоты оборудования"
    ]
  }
];

export const competencyTopics: CompetencyTopic[] = [
  {
    id: "cook-hygiene",
    title: "Гигиена и безопасность",
    role: "cook",
    importance: "high",
    skippable: false,
    required: true
  },
  {
    id: "cook-storage",
    title: "Хранение ингредиентов",
    role: "cook",
    importance: "high",
    skippable: false,
    required: true
  },
  {
    id: "cook-labeling",
    title: "Маркировка и сроки",
    role: "cook",
    importance: "high",
    skippable: false,
    required: true
  },
  {
    id: "cook-tech-cards",
    title: "Техкарты популярных роллов",
    role: "cook",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "cook-assembly",
    title: "Стандарты нарезки и сборки",
    role: "cook",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "cook-packaging",
    title: "Упаковка заказа",
    role: "cook",
    importance: "medium",
    skippable: "partial",
    required: false
  },
  {
    id: "cook-defects",
    title: "Работа с браком",
    role: "cook",
    importance: "high",
    skippable: false,
    required: true
  },
  {
    id: "cook-shift",
    title: "Открытие и закрытие смены",
    role: "cook",
    importance: "medium",
    skippable: true,
    required: false
  },
  {
    id: "cook-equipment",
    title: "Оборудование",
    role: "cook",
    importance: "medium",
    skippable: "partial",
    required: false
  },
  {
    id: "cook-product-matrix",
    title: "Продуктовая матрица",
    role: "cook",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "admin-communication",
    title: "Стандарты общения с гостем",
    role: "admin",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "admin-orders",
    title: "Приём и обработка заказа",
    role: "admin",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "admin-payment",
    title: "Работа с кассой и оплатой",
    role: "admin",
    importance: "high",
    skippable: false,
    required: true
  },
  {
    id: "admin-refunds",
    title: "Отмена и возврат заказа",
    role: "admin",
    importance: "high",
    skippable: false,
    required: true
  },
  {
    id: "admin-complaints",
    title: "Работа с претензиями",
    role: "admin",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "admin-kitchen",
    title: "Взаимодействие с кухней",
    role: "admin",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "admin-delivery",
    title: "Доставка и самовывоз",
    role: "admin",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "admin-discounts",
    title: "Акции и скидки",
    role: "admin",
    importance: "medium",
    skippable: "partial",
    required: false
  },
  {
    id: "admin-shift-close",
    title: "Закрытие смены",
    role: "admin",
    importance: "medium",
    skippable: true,
    required: false
  },
  {
    id: "admin-reporting",
    title: "Отчётность",
    role: "admin",
    importance: "medium",
    skippable: "partial",
    required: false
  },
  {
    id: "barista-hygiene",
    title: "Гигиена и безопасность стойки",
    role: "barista",
    importance: "high",
    skippable: false,
    required: true
  },
  {
    id: "barista-beans-storage",
    title: "Зерно и хранение",
    role: "barista",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "barista-espresso-setup",
    title: "Настройка эспрессо",
    role: "barista",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "barista-grind-dose-tamp",
    title: "Помол, доза и трамбовка",
    role: "barista",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "barista-extraction-sensory",
    title: "Экстракция и сенсорика",
    role: "barista",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "barista-milk-texture",
    title: "Молоко и текстура",
    role: "barista",
    importance: "high",
    skippable: false,
    required: true
  },
  {
    id: "barista-drink-recipes",
    title: "Рецептуры напитков",
    role: "barista",
    importance: "high",
    skippable: "partial",
    required: false
  },
  {
    id: "barista-equipment-cleaning",
    title: "Чистка оборудования",
    role: "barista",
    importance: "high",
    skippable: false,
    required: true
  },
  {
    id: "barista-service-flow",
    title: "Работа в потоке",
    role: "barista",
    importance: "medium",
    skippable: "partial",
    required: false
  },
  {
    id: "barista-guest-communication",
    title: "Коммуникация с гостем",
    role: "barista",
    importance: "medium",
    skippable: "partial",
    required: false
  }
];
