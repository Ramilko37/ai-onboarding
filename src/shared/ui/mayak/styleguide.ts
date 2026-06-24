export const mayakStyleguide = {
  name: "Маяк UI",
  purpose:
    "Единый визуальный язык для AI-агента адаптации в HORECA: тёплый, уверенный, гостеприимный, без медицинской стерильности и без ощущения HR-контроля.",
  principles: [
    {
      title: "Гостеприимный проводник",
      description:
        "Интерфейс говорит как хороший наставник на смене: спокойно, по делу, с ощущением заботы и профессиональной кухни.",
    },
    {
      title: "Один понятный шаг",
      description:
        "Каждый экран показывает один главный CTA, короткий контекст и мягкую подсказку, что будет дальше.",
    },
    {
      title: "Тёплая уверенность",
      description:
        "Акценты строятся вокруг espresso, copper, honey и herb: это ближе к HORECA, чем холодный medical teal.",
    },
    {
      title: "Читаемая иерархия",
      description:
        "Заголовки набраны display-шрифтом, body — более читаемым гротеском, muted-тексты стали темнее и заметнее.",
    },
  ],
  tokens: [
    {
      group: "Цвет",
      items: [
        { name: "background", value: "cream tablecloth", usage: "общий тёплый фон приложения" },
        { name: "foreground", value: "espresso", usage: "главный текст и сильная типографика" },
        { name: "primary", value: "copper", usage: "главный CTA, активное состояние, прогресс" },
        { name: "secondary", value: "toasted cream", usage: "плашки, входящие сообщения, спокойные блоки" },
        { name: "accent", value: "honey", usage: "мягкое внимание, обучение в процессе" },
        { name: "deep", value: "espresso surface", usage: "ключевые summary/hero-блоки" },
      ],
    },
    {
      group: "Форма",
      items: [
        { name: "radius-2xl/3xl", value: "большие скругления", usage: "карточки и этапы" },
        { name: "rounded-full", value: "капсулы", usage: "CTA, бейджи, ввод чата" },
        { name: "border-border", value: "тёплая видимая граница", usage: "все интерактивные поверхности" },
      ],
    },
    {
      group: "Типографика",
      items: [
        { name: "font-display", value: "Montserrat", usage: "h1/h2, сильные числа, бренд" },
        { name: "font-sans", value: "Manrope", usage: "основной интерфейс и читаемые подписи" },
        { name: "font-mono uppercase", value: "служебные подписи", usage: "kicker, статусы, номера шагов" },
        { name: "text-muted-foreground", value: "тёплый серо-коричневый", usage: "пояснения без потери контраста" },
      ],
    },
  ],
  components: [
    { name: "MayakShell", usage: "Обязательная оболочка страницы: aurora-фон, top bar и max-w-6xl контент." },
    { name: "MayakTopBar", usage: "Единый верхний бар с брендом «Маяк», меткой этапа и пользователем." },
    { name: "MayakPanel", usage: "Базовая поверхность для всех шагов, виджетов, summary и форм." },
    { name: "MayakSectionHeader", usage: "Заголовок экрана: kicker, display H1, короткое объяснение без перегруза." },
    { name: "MayakButton / MayakLinkButton", usage: "Один copper primary CTA на экран; вторичные действия — secondary/ghost." },
    { name: "MayakOptionCard", usage: "Выбор роли, грейда, ответа диагностики и других вариантов." },
    { name: "MayakBadge / MayakIconBadge", usage: "Статусы, важность, теги и иконки секций." },
  ],
  do: [
    "Использовать cream/card surfaces + тёплый blur для основных поверхностей.",
    "Держать текст дружелюбным: «диагностика», «поддержка», «путь», а не «экзамен».",
    "Показывать текущий этап через copper primary/5 фон и primary/40 border.",
    "Сохранять один главный CTA и группировать вторичные действия в MayakActionBar.",
  ],
  dont: [
    "Не возвращать холодный medical teal как главный цвет интерфейса.",
    "Не вводить новые цвета вне CSS-токенов без обновления styleguide.",
    "Не использовать слишком светлый muted-текст: подписи должны читаться на demo-скринах.",
    "Не смешивать CSS-module стиль старых этапов с визуальным языком Маяка.",
  ],
} as const;
