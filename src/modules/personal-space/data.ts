export type JourneyStatus = "done" | "active" | "upcoming";

export type JourneyStage = {
  id: string;
  title: string;
  caption: string;
  status: JourneyStatus;
  day: string;
  href?: string;
  cta?: string;
};

export type KnowledgeMastery = "strong" | "learning" | "new";

export type KnowledgeNode = {
  id: string;
  label: string;
  mastery: KnowledgeMastery;
  /** position in % within the constellation canvas */
  x: number;
  y: number;
  size: number;
};

export type KnowledgeLink = [string, string];

export type TodayTask = {
  id: string;
  title: string;
  meta: string;
  minutes: number;
  done: boolean;
};

export type AssistantMessage = {
  id: string;
  author: "guide" | "you";
  text: string;
};

export const newcomer = {
  name: "Алина",
  fullName: "Алина Соколова",
  role: "Повар-стажёр",
  location: "Нори · Покровка",
  dayIndex: 3,
  dayTotal: 14,
  progress: 38,
  mentor: {
    name: "Максим",
    role: "Шеф-наставник смены",
    initials: "М",
  },
};

export const company = {
  name: "Нори",
  tagline: "сеть доставки",
};

export const journeyStages: JourneyStage[] = [
  {
    id: "team",
    title: "Знакомство с командой",
    caption: "Вы познакомились со сменой и наставником.",
    status: "done",
    day: "День 1",
  },
  {
    id: "workspace",
    title: "Рабочее место и доступы",
    caption: "Форма, станция и вход в базу знаний готовы.",
    status: "done",
    day: "День 1",
  },
  {
    id: "diagnostic",
    title: "Диагностика навыков",
    caption: "Спокойный разбор того, что уже знаете — без оценок.",
    status: "active",
    day: "Сегодня",
    href: "/",
    cta: "Пройти диагностику",
  },
  {
    id: "route",
    title: "Персональный маршрут обучения",
    caption: "Маяк соберёт план под вас по итогам диагностики.",
    status: "upcoming",
    day: "День 3–7",
  },
  {
    id: "shift",
    title: "Первая самостоятельная станция",
    caption: "Готовите популярные позиции под мягким контролем.",
    status: "upcoming",
    day: "День 7",
  },
  {
    id: "grade",
    title: "Подтверждение грейда",
    caption: "Спокойное подтверждение, что вы уверенно в потоке.",
    status: "upcoming",
    day: "День 14",
  },
];

export const knowledgeNodes: KnowledgeNode[] = [
  { id: "hygiene", label: "Гигиена", mastery: "strong", x: 20, y: 30, size: 58 },
  { id: "storage", label: "Хранение", mastery: "strong", x: 41, y: 18, size: 46 },
  { id: "labeling", label: "Маркировка", mastery: "learning", x: 63, y: 26, size: 44 },
  { id: "techcards", label: "Техкарты", mastery: "learning", x: 80, y: 44, size: 52 },
  { id: "assembly", label: "Сборка", mastery: "new", x: 66, y: 66, size: 48 },
  { id: "packaging", label: "Упаковка", mastery: "learning", x: 44, y: 72, size: 40 },
  { id: "defects", label: "Качество", mastery: "new", x: 23, y: 64, size: 46 },
  { id: "matrix", label: "Меню", mastery: "strong", x: 14, y: 47, size: 38 },
];

export const knowledgeLinks: KnowledgeLink[] = [
  ["hygiene", "storage"],
  ["storage", "labeling"],
  ["labeling", "techcards"],
  ["techcards", "assembly"],
  ["assembly", "packaging"],
  ["packaging", "defects"],
  ["defects", "matrix"],
  ["matrix", "hygiene"],
  ["storage", "matrix"],
  ["labeling", "assembly"],
];

export const initialTodayTasks: TodayTask[] = [
  {
    id: "t1",
    title: "Пройти диагностику навыков",
    meta: "Спокойно, без оценок · 12 вопросов",
    minutes: 8,
    done: false,
  },
  {
    id: "t2",
    title: "Освежить стандарт гигиены кухни",
    meta: "Короткий конспект от Маяка",
    minutes: 5,
    done: true,
  },
  {
    id: "t3",
    title: "Познакомиться с продуктовой матрицей",
    meta: "10 популярных позиций смены",
    minutes: 6,
    done: false,
  },
];

export const assistantSuggestions = [
  "С чего начать сегодня?",
  "Где найти техкарту филадельфии?",
  "Что важно в первый день?",
];

export const assistantOpening: AssistantMessage[] = [
  {
    id: "m1",
    author: "guide",
    text: "Привет, Алина. Я Маяк — ваш проводник на старте. Я рядом, чтобы день был спокойным и понятным.",
  },
  {
    id: "m2",
    author: "guide",
    text: "Сегодня всего один важный шаг — лёгкая диагностика. Это не экзамен: она просто поможет собрать обучение под вас.",
  },
];

export const assistantReplies: Record<string, string> = {
  "С чего начать сегодня?":
    "Начните с диагностики — это 8 минут и без оценок. После неё я соберу персональный маршрут и уберу из плана то, что вы уже знаете.",
  "Где найти техкарту филадельфии?":
    "Техкарта лежит в базе знаний → «Техкарты популярных роллов». Я открою её рядом с вашей станцией, когда дойдём до практики.",
  "Что важно в первый день?":
    "В первый день важно спокойно освоиться: гигиена, рабочее место и кто за что отвечает на смене. Остальное освоим шаг за шагом.",
};

export const defaultAssistantReply =
  "Хороший вопрос. Я подскажу спокойно и по шагам, а если нужно — позову вашего наставника Максима. Здесь не бывает «глупых» вопросов.";
