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
  name: "София",
  fullName: "София Кузнецова",
  role: "Бариста",
  location: "Valle Sanchez · Арбат",
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
  name: "Valle Sanchez",
  tagline: "barista standard",
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
    href: "/onboarding-agent",
    cta: "Пройти диагностику",
  },
  {
    id: "route",
    title: "Персональный маршрут обучения",
    caption: "Система соберёт план под вас по итогам диагностики.",
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
  { id: "beans", label: "Зерно", mastery: "strong", x: 41, y: 18, size: 46 },
  { id: "espresso", label: "Эспрессо", mastery: "learning", x: 63, y: 26, size: 52 },
  { id: "grind", label: "Помол", mastery: "learning", x: 80, y: 44, size: 44 },
  { id: "milk", label: "Молоко", mastery: "new", x: 66, y: 66, size: 48 },
  { id: "recipes", label: "Рецепты", mastery: "learning", x: 44, y: 72, size: 42 },
  { id: "cleaning", label: "Чистка", mastery: "new", x: 23, y: 64, size: 46 },
  { id: "flow", label: "Поток", mastery: "strong", x: 14, y: 47, size: 38 },
];

export const knowledgeLinks: KnowledgeLink[] = [
  ["hygiene", "beans"],
  ["beans", "espresso"],
  ["espresso", "grind"],
  ["grind", "milk"],
  ["milk", "recipes"],
  ["recipes", "cleaning"],
  ["cleaning", "flow"],
  ["flow", "hygiene"],
  ["beans", "flow"],
  ["espresso", "milk"],
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
    title: "Освежить стандарт чистки стойки",
    meta: "Короткий конспект Valle Sanchez",
    minutes: 5,
    done: true,
  },
  {
    id: "t3",
    title: "Проверить рецепт капучино",
    meta: "Эспрессо, молоко, подача",
    minutes: 6,
    done: false,
  },
];

export const assistantSuggestions = [
  "С чего начать сегодня?",
  "Что делать с быстрым проливом?",
  "Что важно в первый день?",
];

export const assistantOpening: AssistantMessage[] = [
  {
    id: "m1",
    author: "guide",
    text: "Привет, София. Я помощник Valle Sanchez на старте. Я рядом, чтобы день был спокойным и понятным.",
  },
  {
    id: "m2",
    author: "guide",
    text: "Сегодня всего один важный шаг — лёгкая диагностика бариста. Это не экзамен: она просто поможет собрать обучение под вас.",
  },
];

export const assistantReplies: Record<string, string> = {
  "С чего начать сегодня?":
    "Начните с диагностики — это 8 минут и без оценок. После неё появится персональный маршрут и лишние знакомые темы уйдут в короткое повторение.",
  "Что делать с быстрым проливом?":
    "Проверьте помол, дозу, распределение и актуальный demo-рецепт эспрессо. Если сомневаетесь, подключите старшего бариста до выдачи спорного шота.",
  "Что важно в первый день?":
    "В первый день важно спокойно освоиться: чистая стойка, оборудование, базовый эспрессо и молоко. Остальное освоим шаг за шагом.",
};

export const defaultAssistantReply =
  "Хороший вопрос. Я подскажу спокойно и по шагам, а если нужно — позову старшего бариста. Здесь не бывает «глупых» вопросов.";
