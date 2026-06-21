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
    value: "cook",
    label: "Повар",
    description: "Кухня, техкарты, безопасность, заготовки и качество блюд."
  },
  {
    value: "admin",
    label: "Администратор кафе",
    description: "Заказы, гости, касса, доставка, претензии и коммуникация."
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
  }
];
