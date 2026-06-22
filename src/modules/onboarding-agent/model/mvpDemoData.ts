export type DemoRoleId = "support_specialist" | "sales_manager" | "developer";

export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";

export type OnboardingPhaseId = "day_0" | "day_1" | "week_1" | "month_1";

export type DemoTaskOwner = "newcomer" | "manager" | "mentor" | "it" | "hr";

export type MockIntegrationId = "hris" | "lms" | "sso" | "service_desk" | "calendar" | "messaging";

export type DemoTask = {
  id: string;
  phaseId: OnboardingPhaseId;
  title: string;
  description: string;
  owner: DemoTaskOwner;
  status: TaskStatus;
  dueLabel: string;
  sourceArticleIds: string[];
  integrationId?: MockIntegrationId;
};

export type DemoEmployee = {
  id: string;
  name: string;
  roleId: DemoRoleId;
  team: string;
  location: string;
  startDate: string;
  manager: string;
  mentor: string;
  tasks: DemoTask[];
};

export type DemoRoleDefinition = {
  id: DemoRoleId;
  title: string;
  summary: string;
  routeGoal: string;
  competencies: string[];
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  source: string;
  tags: string[];
  roleIds: DemoRoleId[] | "all";
  body: string;
  answer: string;
  escalationHint?: string;
};

export type MockIntegration = {
  id: MockIntegrationId;
  title: string;
  status: "mocked" | "ready";
  description: string;
};

export const phaseLabels: Record<OnboardingPhaseId, string> = {
  day_0: "Day 0 / Preboarding",
  day_1: "Day 1",
  week_1: "Week 1",
  month_1: "Month 1"
};

export const statusLabels: Record<TaskStatus, string> = {
  todo: "К выполнению",
  in_progress: "В работе",
  done: "Готово",
  blocked: "Блокер"
};

export const ownerLabels: Record<DemoTaskOwner, string> = {
  newcomer: "Новичок",
  manager: "Руководитель",
  mentor: "Наставник",
  it: "IT",
  hr: "HR"
};

export const roleDefinitions: DemoRoleDefinition[] = [
  {
    id: "support_specialist",
    title: "Support Specialist",
    summary: "Первая линия поддержки: SLA, CRM, база знаний и корректная эскалация клиентских вопросов.",
    routeGoal: "За первый месяц выйти на самостоятельную обработку типовых обращений с контролем качества.",
    competencies: ["CRM", "SLA", "Tone of voice", "Escalation", "Security"]
  },
  {
    id: "sales_manager",
    title: "Sales Manager",
    summary: "Менеджер продаж: пайплайн, discovery, демо, CRM-гигиена и handoff в Customer Success.",
    routeGoal: "За первый месяц провести первые квалифицированные discovery и корректно вести сделки в CRM.",
    competencies: ["Pipeline", "Discovery", "Product story", "CRM hygiene", "Handoff"]
  },
  {
    id: "developer",
    title: "Developer",
    summary: "Инженер продуктовой команды: окружение, репозиторий, delivery-flow, code review и инциденты.",
    routeGoal: "За первый месяц безопасно выполнить первые задачи, пройти review и понять release-процесс.",
    competencies: ["Dev environment", "Git flow", "Code review", "CI/CD", "Incident basics"]
  }
];

const baseTasks = {
  day0Welcome: {
    id: "day0-welcome",
    phaseId: "day_0" as const,
    title: "Открыть welcome-пакет и карту первого дня",
    description: "Проверить письмо, контакты HR, наставника, руководителя и план встреч первого дня.",
    owner: "newcomer" as const,
    status: "done" as const,
    dueLabel: "до выхода",
    sourceArticleIds: ["welcome-pack", "first-day-map"],
    integrationId: "messaging" as const
  },
  day0Access: {
    id: "day0-access",
    phaseId: "day_0" as const,
    title: "Проверить доступы и SSO",
    description: "Убедиться, что корпоративная почта, SSO и профиль сотрудника активированы.",
    owner: "it" as const,
    status: "in_progress" as const,
    dueLabel: "до 10:00 Day 1",
    sourceArticleIds: ["access-sso", "it-service-desk"],
    integrationId: "sso" as const
  },
  day1Buddy: {
    id: "day1-buddy",
    phaseId: "day_1" as const,
    title: "Встреча с наставником",
    description: "Сверить ожидания, договориться о ежедневном check-in и канале быстрых вопросов.",
    owner: "mentor" as const,
    status: "todo" as const,
    dueLabel: "Day 1",
    sourceArticleIds: ["buddy-checklist", "manager-one-to-one"],
    integrationId: "calendar" as const
  },
  day1Security: {
    id: "day1-security",
    phaseId: "day_1" as const,
    title: "Пройти обязательный security-блок",
    description: "Изучить правила обработки клиентских данных, паролей и инцидентов доступа.",
    owner: "newcomer" as const,
    status: "todo" as const,
    dueLabel: "Day 1",
    sourceArticleIds: ["security-basics", "access-sso"],
    integrationId: "lms" as const
  },
  week1Pulse: {
    id: "week1-pulse",
    phaseId: "week_1" as const,
    title: "Заполнить pulse-check 7-го дня",
    description: "Сообщить, понятны ли ожидания, хватает ли доступов и поддержки наставника.",
    owner: "newcomer" as const,
    status: "todo" as const,
    dueLabel: "конец Week 1",
    sourceArticleIds: ["pulse-checks", "manager-one-to-one"],
    integrationId: "hris" as const
  },
  month1Review: {
    id: "month1-review",
    phaseId: "month_1" as const,
    title: "Промежуточный review с руководителем",
    description: "Сверить прогресс, блокеры, следующие цели и зоны развития на оставшийся испытательный срок.",
    owner: "manager" as const,
    status: "todo" as const,
    dueLabel: "Month 1",
    sourceArticleIds: ["manager-one-to-one", "probation-review"],
    integrationId: "calendar" as const
  }
};

export const demoEmployees: DemoEmployee[] = [
  {
    id: "employee-anna",
    name: "Анна Смирнова",
    roleId: "support_specialist",
    team: "Customer Support",
    location: "Berlin / Remote",
    startDate: "2026-06-25",
    manager: "Мария Котова",
    mentor: "Илья Орлов",
    tasks: [
      baseTasks.day0Welcome,
      baseTasks.day0Access,
      baseTasks.day1Buddy,
      baseTasks.day1Security,
      {
        id: "support-crm-basics",
        phaseId: "day_1",
        title: "Открыть CRM playbook",
        description: "Разобрать карточку клиента, статус обращения и правила фиксации первого ответа.",
        owner: "newcomer",
        status: "in_progress",
        dueLabel: "Day 1",
        sourceArticleIds: ["crm-access", "support-sla"],
        integrationId: "lms"
      },
      {
        id: "support-shadowing",
        phaseId: "week_1",
        title: "Shadowing 3 клиентских диалогов",
        description: "Посмотреть, как наставник закрывает типовые вопросы и когда делает эскалацию.",
        owner: "mentor",
        status: "todo",
        dueLabel: "Week 1",
        sourceArticleIds: ["support-sla", "escalation-rules"],
        integrationId: "calendar"
      },
      baseTasks.week1Pulse,
      {
        id: "support-quality-check",
        phaseId: "month_1",
        title: "Первая QA-проверка ответов",
        description: "Руководитель смотрит 5 обращений и даёт обратную связь по тону и полноте ответа.",
        owner: "manager",
        status: "todo",
        dueLabel: "Month 1",
        sourceArticleIds: ["tone-of-voice", "probation-review"],
        integrationId: "hris"
      },
      baseTasks.month1Review
    ]
  },
  {
    id: "employee-timur",
    name: "Тимур Ахметов",
    roleId: "sales_manager",
    team: "Sales SMB",
    location: "Moscow / Hybrid",
    startDate: "2026-06-25",
    manager: "Ольга Ланская",
    mentor: "Денис Волков",
    tasks: [
      { ...baseTasks.day0Welcome, status: "done" },
      { ...baseTasks.day0Access, status: "done" },
      { ...baseTasks.day1Buddy, status: "in_progress" },
      baseTasks.day1Security,
      {
        id: "sales-crm-pipeline",
        phaseId: "day_1",
        title: "Разобрать CRM pipeline и обязательные поля",
        description: "Понять стадии сделки, критерии квалификации и правила следующего шага.",
        owner: "newcomer",
        status: "todo",
        dueLabel: "Day 1",
        sourceArticleIds: ["sales-pipeline", "crm-access"],
        integrationId: "lms"
      },
      {
        id: "sales-demo-shadowing",
        phaseId: "week_1",
        title: "Посетить 2 demo-call как слушатель",
        description: "Зафиксировать структуру discovery, боли клиента и handoff после встречи.",
        owner: "mentor",
        status: "blocked",
        dueLabel: "Week 1",
        sourceArticleIds: ["discovery-call", "sales-handoff"],
        integrationId: "calendar"
      },
      baseTasks.week1Pulse,
      baseTasks.month1Review
    ]
  },
  {
    id: "employee-lera",
    name: "Лера Морозова",
    roleId: "developer",
    team: "Product Platform",
    location: "Yerevan / Remote",
    startDate: "2026-06-25",
    manager: "Алексей Романов",
    mentor: "Никита Шульц",
    tasks: [
      { ...baseTasks.day0Welcome, status: "done" },
      { ...baseTasks.day0Access, status: "blocked" },
      { ...baseTasks.day1Buddy, status: "todo" },
      baseTasks.day1Security,
      {
        id: "developer-local-env",
        phaseId: "day_1",
        title: "Поднять локальное окружение",
        description: "Склонировать репозиторий, запустить приложение и пройти smoke-check.",
        owner: "newcomer",
        status: "blocked",
        dueLabel: "Day 1",
        sourceArticleIds: ["developer-environment", "it-service-desk"],
        integrationId: "service_desk"
      },
      {
        id: "developer-first-pr",
        phaseId: "week_1",
        title: "Сделать первый безопасный PR",
        description: "Взять маленькую задачу, пройти code review и исправить замечания.",
        owner: "newcomer",
        status: "todo",
        dueLabel: "Week 1",
        sourceArticleIds: ["code-review", "git-flow"],
        integrationId: "lms"
      },
      baseTasks.week1Pulse,
      {
        id: "developer-release-flow",
        phaseId: "month_1",
        title: "Разобрать release и incident flow",
        description: "Понять, как команда деплоит изменения, смотрит алерты и реагирует на инциденты.",
        owner: "mentor",
        status: "todo",
        dueLabel: "Month 1",
        sourceArticleIds: ["release-flow", "incident-basics"],
        integrationId: "calendar"
      },
      baseTasks.month1Review
    ]
  }
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "welcome-pack",
    title: "Welcome-пакет новичка",
    source: "KB-HR-001 · Preboarding checklist",
    tags: ["welcome", "preboarding", "первый день", "пакет", "контакты"],
    roleIds: "all",
    body: "Welcome-пакет содержит карту первого дня, контакты HR, руководителя, наставника, расписание вводных встреч и ссылки на обязательные материалы.",
    answer: "Открой welcome-пакет, проверь контакты HR, руководителя и наставника, затем посмотри карту первого дня. Если какой-то контакт или встреча отсутствует, это блокер для HR."
  },
  {
    id: "first-day-map",
    title: "Карта первого дня",
    source: "KB-HR-002 · Day 1 schedule",
    tags: ["day 1", "первый день", "расписание", "что сделать", "встречи"],
    roleIds: "all",
    body: "В первый день новичок проверяет доступы, проходит welcome, встречается с руководителем и наставником, изучает security-basics и открывает ролевой маршрут.",
    answer: "В первый день нужно: проверить доступы, посетить welcome-встречу, провести 1:1 с руководителем, встретиться с наставником, пройти security-блок и открыть ролевые задачи в маршруте."
  },
  {
    id: "access-sso",
    title: "SSO и корпоративные доступы",
    source: "KB-IT-010 · Access setup",
    tags: ["sso", "доступ", "логин", "почта", "пароль", "account"],
    roleIds: "all",
    body: "SSO активируется IT до первого рабочего дня. Если вход не работает, новичок должен создать обращение в service desk и сообщить руководителю.",
    answer: "Проверь корпоративную почту и SSO. Если вход не работает, создай тикет в Service Desk и отметь задачу как блокер, чтобы HR и руководитель увидели проблему."
  },
  {
    id: "it-service-desk",
    title: "Service Desk: как открыть тикет",
    source: "KB-IT-011 · Service Desk FAQ",
    tags: ["service desk", "тикет", "it", "проблема", "блокер", "доступ"],
    roleIds: "all",
    body: "Для технических проблем используется service desk. В тикете нужно указать систему, скрин ошибки, срочность и влияние на работу первого дня.",
    answer: "Открой тикет в Service Desk: укажи систему, скрин ошибки, срочность и как это мешает онбордингу. В демо это создаёт эскалацию к IT/HR."
  },
  {
    id: "buddy-checklist",
    title: "Чек-лист наставника",
    source: "KB-HR-020 · Buddy checklist",
    tags: ["buddy", "наставник", "ментор", "check-in", "встреча"],
    roleIds: "all",
    body: "Наставник помогает с бытовыми и практическими вопросами, показывает рабочие ритуалы, проверяет доступы и собирает первые блокеры.",
    answer: "Наставник должен провести короткую встречу, объяснить рабочие ритуалы, проверить доступы, договориться о канале быстрых вопросов и отметить блокеры в маршруте."
  },
  {
    id: "manager-one-to-one",
    title: "1:1 руководителя с новичком",
    source: "KB-MGR-001 · Manager onboarding actions",
    tags: ["1:1", "руководитель", "ожидания", "цели", "manager"],
    roleIds: "all",
    body: "Руководитель в первый день объясняет ожидания, цели испытательного срока, критерии успеха, формат обратной связи и ближайшие встречи.",
    answer: "На первом 1:1 руководитель объясняет ожидания, цели испытательного срока, критерии успеха и формат обратной связи. Если встреча не назначена, создай эскалацию к HR."
  },
  {
    id: "security-basics",
    title: "Security basics для всех ролей",
    source: "KB-SEC-001 · Mandatory security course",
    tags: ["security", "безопасность", "данные", "пароли", "privacy", "обязательный"],
    roleIds: "all",
    body: "Каждый новичок проходит обязательный security-блок: пароли, 2FA, клиентские данные, фишинг, инциденты доступа и запрет передачи учётных записей.",
    answer: "Security-блок обязателен для всех ролей. Пройди материалы про 2FA, пароли, клиентские данные и инциденты доступа; этот блок нельзя пропускать даже при высоком опыте."
  },
  {
    id: "pulse-checks",
    title: "Pulse-check на 7-й и 30-й день",
    source: "KB-HR-030 · Pulse feedback",
    tags: ["pulse", "опрос", "7 день", "30 день", "feedback", "блокеры"],
    roleIds: "all",
    body: "Pulse-check помогает быстро увидеть проблемы с доступами, ожиданиями, поддержкой наставника, тревогами и перегрузкой новичка.",
    answer: "Pulse-check нужен, чтобы рано поймать блокеры: доступы, непонятные ожидания, нехватку поддержки или перегрузку. Заполни его честно; это не экзамен."
  },
  {
    id: "probation-review",
    title: "Промежуточный review испытательного срока",
    source: "KB-HR-040 · Probation review guide",
    tags: ["review", "испытательный", "месяц", "прогресс", "оценка"],
    roleIds: "all",
    body: "На промежуточном review обсуждаются прогресс, открытые блокеры, следующие цели и поддержка, но демо-агент не принимает кадровых решений.",
    answer: "На review руководитель и новичок сверяют прогресс, блокеры, следующие цели и поддержку. AI-агент показывает данные, но не принимает кадровые решения."
  },
  {
    id: "crm-access",
    title: "CRM: доступ и базовая навигация",
    source: "KB-CRM-001 · CRM start guide",
    tags: ["crm", "карточка", "клиент", "доступ", "pipeline"],
    roleIds: ["support_specialist", "sales_manager"],
    body: "CRM содержит карточки клиентов, обращения, сделки, историю коммуникаций, обязательные поля и статусы. Доступ проверяется через SSO.",
    answer: "В CRM проверь доступ через SSO, открой тестовую карточку клиента и найди историю коммуникаций, статус, ответственного и обязательные поля."
  },
  {
    id: "support-sla",
    title: "Support SLA и статусы обращений",
    source: "KB-SUP-001 · Support playbook",
    tags: ["support", "sla", "обращение", "статус", "клиент"],
    roleIds: ["support_specialist"],
    body: "Support Specialist фиксирует первый ответ, приоритет обращения, SLA, статус и причину эскалации, если вопрос нельзя закрыть на первой линии.",
    answer: "Для support-вопроса проверь приоритет, SLA, статус обращения и контекст клиента. Если вопрос нельзя решить на первой линии, укажи причину эскалации."
  },
  {
    id: "tone-of-voice",
    title: "Tone of voice поддержки",
    source: "KB-SUP-002 · Customer tone guide",
    tags: ["tone", "voice", "тон", "клиент", "ответ", "support"],
    roleIds: ["support_specialist"],
    body: "Ответы поддержки должны быть спокойными, конкретными, без обвинений клиента и с понятным следующим шагом.",
    answer: "Пиши спокойно и конкретно: признай вопрос клиента, объясни следующий шаг, не обвиняй и не обещай то, чего нет в базе знаний."
  },
  {
    id: "escalation-rules",
    title: "Правила эскалации клиентских вопросов",
    source: "KB-OPS-010 · Escalation matrix",
    tags: ["эскалация", "escalation", "к человеку", "не уверен", "блокер"],
    roleIds: "all",
    body: "Эскалация нужна для неизвестных, чувствительных, юридических, персональных, payroll, disciplinary и технически заблокированных вопросов.",
    answer: "Если ответ не подтверждается базой знаний или вопрос чувствительный, не выдумывай. Передай его HR, руководителю, IT или профильному эксперту и зафиксируй причину."
  },
  {
    id: "sales-pipeline",
    title: "Sales pipeline и стадии сделки",
    source: "KB-SALES-001 · Pipeline guide",
    tags: ["sales", "pipeline", "сделка", "стадия", "crm", "квалификация"],
    roleIds: ["sales_manager"],
    body: "Sales Manager ведёт сделку по стадиям: lead, qualified, discovery, demo, proposal, negotiation, closed won/lost. Для каждой стадии есть критерии выхода.",
    answer: "В pipeline проверь стадию сделки, критерии перехода, следующий шаг, ответственного и дату следующего контакта. Без этих данных сделка считается неполной."
  },
  {
    id: "discovery-call",
    title: "Discovery call: структура встречи",
    source: "KB-SALES-002 · Discovery checklist",
    tags: ["discovery", "demo", "call", "продажи", "встреча", "квалификация"],
    roleIds: ["sales_manager"],
    body: "Discovery помогает понять контекст клиента, проблему, критерии решения, бюджет, сроки, участников и следующий шаг.",
    answer: "На discovery зафиксируй контекст клиента, проблему, критерии успеха, сроки, участников решения и следующий шаг. После звонка обнови CRM."
  },
  {
    id: "sales-handoff",
    title: "Handoff из Sales в Customer Success",
    source: "KB-SALES-003 · Handoff rules",
    tags: ["handoff", "customer success", "sales", "передача", "клиент"],
    roleIds: ["sales_manager"],
    body: "Handoff включает цели клиента, обещания, риски, ограничения, договорённости и ссылку на CRM-запись. Передача без контекста запрещена.",
    answer: "Перед handoff собери цели клиента, обещания, риски, ограничения и ссылку на CRM. Customer Success должен видеть полный контекст, а не только факт сделки."
  },
  {
    id: "developer-environment",
    title: "Developer environment setup",
    source: "KB-ENG-001 · Local environment",
    tags: ["developer", "dev", "environment", "локальное окружение", "repo", "запуск"],
    roleIds: ["developer"],
    body: "Инженер должен настроить SSH/SSO, склонировать репозиторий, установить зависимости, создать env-файл из шаблона и пройти smoke-check.",
    answer: "Для локального окружения проверь SSH/SSO, склонируй репозиторий, установи зависимости, создай env из шаблона и запусти smoke-check. Если доступов нет — это IT-блокер."
  },
  {
    id: "git-flow",
    title: "Git flow для первого PR",
    source: "KB-ENG-002 · Git workflow",
    tags: ["git", "branch", "pr", "pull request", "разработка"],
    roleIds: ["developer"],
    body: "Первый PR должен быть маленьким, с понятным описанием, ссылкой на задачу, локальной проверкой и запросом review у наставника.",
    answer: "Создай отдельную ветку, сделай маленькое изменение, приложи ссылку на задачу, опиши проверку и запроси review у наставника."
  },
  {
    id: "code-review",
    title: "Code review: ожидания",
    source: "KB-ENG-003 · Review standards",
    tags: ["code review", "review", "pr", "качество", "developer"],
    roleIds: ["developer"],
    body: "Code review проверяет корректность, читаемость, тесты, влияние на безопасность и поддержку. Замечания — часть обучения, не оценка личности.",
    answer: "На code review ожидай вопросы по корректности, читаемости, тестам и безопасности. Замечания — нормальная часть онбординга, отвечай по сути и обновляй PR."
  },
  {
    id: "release-flow",
    title: "Release flow и CI/CD",
    source: "KB-ENG-004 · Release process",
    tags: ["release", "ci", "cd", "deploy", "pipeline", "разработчик"],
    roleIds: ["developer"],
    body: "Release flow включает проверки CI, review, merge, staged rollout, мониторинг метрик и rollback-plan для рискованных изменений.",
    answer: "Перед release убедись, что CI зелёный, review завершён, риск понятен, rollout согласован, а после deploy команда смотрит метрики и алерты."
  },
  {
    id: "incident-basics",
    title: "Incident basics для продуктовой команды",
    source: "KB-ENG-005 · Incident response intro",
    tags: ["incident", "инцидент", "alert", "rollback", "production", "дежурство"],
    roleIds: ["developer"],
    body: "Новичок не ведёт инцидент самостоятельно. Он должен знать канал инцидентов, правила фиксации фактов, роль дежурного и когда звать наставника.",
    answer: "Если видишь production-инцидент, не действуй в одиночку: перейди в incident-канал, зафиксируй факт, позови дежурного и наставника, не делай rollback без согласования."
  }
];

export const quickQuestions = [
  "Что мне сделать в первый день?",
  "Как получить доступ к CRM?",
  "Что делать, если SSO не работает?",
  "Когда нужна эскалация к человеку?",
  "Как проходит review через месяц?"
];

export const mockIntegrations: MockIntegration[] = [
  {
    id: "hris",
    title: "HRIS",
    status: "mocked",
    description: "Профиль сотрудника, дата выхода, руководитель, наставник и pulse-check статусы."
  },
  {
    id: "lms",
    title: "LMS",
    status: "mocked",
    description: "Учебные блоки, обязательные курсы, completion rate и контрольные задания."
  },
  {
    id: "sso",
    title: "SSO",
    status: "mocked",
    description: "Проверка активированного аккаунта и доступов к корпоративным системам."
  },
  {
    id: "service_desk",
    title: "Service Desk",
    status: "mocked",
    description: "Эскалации по IT-блокерам, доступам и техническим вопросам первого дня."
  },
  {
    id: "calendar",
    title: "Calendar",
    status: "mocked",
    description: "Welcome, 1:1 с руководителем, встречи с наставником и review."
  },
  {
    id: "messaging",
    title: "Messaging",
    status: "mocked",
    description: "Welcome-письмо, напоминания, уведомления руководителю и наставнику."
  }
];
