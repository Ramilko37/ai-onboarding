import type { DiagnosticQuestion } from "./types";

export const cookQuestions: DiagnosticQuestion[] = [
  {
    id: "cook-q-001",
    role: "cook",
    topicId: "cook-labeling",
    type: "single_choice",
    difficulty: "basic",
    question: "Ты заметил, что на контейнере с ингредиентом нет маркировки. Что нужно сделать?",
    options: [
      { id: "a", text: "Использовать, если продукт выглядит нормально", isCorrect: false },
      { id: "b", text: "Спросить старшего смены и не использовать до проверки", isCorrect: true },
      { id: "c", text: "Поставить контейнер обратно без изменений", isCorrect: false },
      { id: "d", text: "Использовать только в срочном заказе", isCorrect: false }
    ],
    explanation: "Ингредиент без маркировки нельзя использовать до проверки.",
    source: "Регламент хранения и маркировки продуктов",
    weight: 2
  },
  {
    id: "cook-q-002",
    role: "cook",
    topicId: "cook-tech-cards",
    type: "single_choice",
    difficulty: "basic",
    question: "Если ты не уверен в граммовке ингредиента для ролла, что нужно сделать?",
    options: [
      { id: "a", text: "Положить примерно как обычно", isCorrect: false },
      { id: "b", text: "Посмотреть техкарту", isCorrect: true },
      { id: "c", text: "Спросить у администратора", isCorrect: false },
      { id: "d", text: "Сделать на глаз, если большая загрузка", isCorrect: false }
    ],
    explanation: "Граммовки и последовательность приготовления сверяют с техкартой.",
    source: "Техкарты популярных роллов",
    weight: 2
  },
  {
    id: "cook-q-003",
    role: "cook",
    topicId: "cook-hygiene",
    type: "single_choice",
    difficulty: "basic",
    question: "Что важно сделать перед началом работы с продуктами?",
    options: [
      { id: "a", text: "Вымыть руки и подготовить рабочее место по стандарту", isCorrect: true },
      { id: "b", text: "Сразу начать с самой срочной заготовки", isCorrect: false },
      { id: "c", text: "Проверить только наличие перчаток", isCorrect: false },
      { id: "d", text: "Дождаться первой команды старшего", isCorrect: false }
    ],
    explanation: "Гигиена и подготовка рабочего места идут до работы с продуктами.",
    source: "Санитарный стандарт кухни",
    weight: 3
  },
  {
    id: "cook-q-004",
    role: "cook",
    topicId: "cook-storage",
    type: "single_choice",
    difficulty: "basic",
    question: "Где должны храниться охлаждённые ингредиенты до использования?",
    options: [
      { id: "a", text: "На рабочем столе, если скоро начнётся сборка", isCorrect: false },
      { id: "b", text: "В зоне хранения с нужным температурным режимом", isCorrect: true },
      { id: "c", text: "Рядом с горячим оборудованием", isCorrect: false },
      { id: "d", text: "В любой свободной ёмкости", isCorrect: false }
    ],
    explanation: "Температурный режим помогает сохранить безопасность и качество ингредиентов.",
    source: "Регламент хранения продуктов",
    weight: 3
  },
  {
    id: "cook-q-005",
    role: "cook",
    topicId: "cook-packaging",
    type: "single_choice",
    difficulty: "basic",
    question: "Когда нужно проверить комплектность заказа перед передачей?",
    options: [
      { id: "a", text: "До передачи заказа в доставку или самовывоз", isCorrect: true },
      { id: "b", text: "Только если администратор попросит", isCorrect: false },
      { id: "c", text: "После звонка гостя", isCorrect: false },
      { id: "d", text: "Когда будет свободное время", isCorrect: false }
    ],
    explanation: "Комплектность проверяют до передачи, чтобы не допустить ошибки в заказе.",
    source: "Стандарт упаковки заказа",
    weight: 1
  },
  {
    id: "cook-q-006",
    role: "cook",
    topicId: "cook-product-matrix",
    type: "single_choice",
    difficulty: "basic",
    question: "Гость заказал популярный сет. Что помогает быстро понять его состав?",
    options: [
      { id: "a", text: "Память коллеги на смене", isCorrect: false },
      { id: "b", text: "Продуктовая матрица и актуальное меню", isCorrect: true },
      { id: "c", text: "Описание из старой распечатки", isCorrect: false },
      { id: "d", text: "Фото из соцсетей", isCorrect: false }
    ],
    explanation: "Состав позиций нужно сверять с актуальной матрицей и меню.",
    source: "Продуктовая матрица сети",
    weight: 1
  },
  {
    id: "cook-q-007",
    role: "cook",
    topicId: "cook-defects",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Ролл получился неровным и визуально отличается от стандарта. Что корректнее сделать?",
    options: [
      { id: "a", text: "Упаковать, если вкус не изменился", isCorrect: false },
      { id: "b", text: "Переделать или согласовать с ответственным на смене", isCorrect: true },
      { id: "c", text: "Положить в заказ со скидкой", isCorrect: false },
      { id: "d", text: "Отдать, если клиент не заметит", isCorrect: false }
    ],
    explanation: "Внешний вид продукта — часть стандарта качества.",
    source: "Стандарты качества продукта",
    weight: 2
  },
  {
    id: "cook-q-008",
    role: "cook",
    topicId: "cook-assembly",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Во время сборки ролла ты видишь, что нарезка отличается по размеру. Как действовать?",
    options: [
      { id: "a", text: "Продолжить, если заказ срочный", isCorrect: false },
      { id: "b", text: "Свериться со стандартом нарезки и исправить до сборки", isCorrect: true },
      { id: "c", text: "Скрыть отличия под соусом", isCorrect: false },
      { id: "d", text: "Передать вопрос упаковщику", isCorrect: false }
    ],
    explanation: "Единая нарезка влияет на качество, внешний вид и стабильность продукта.",
    source: "Стандарт нарезки и сборки",
    weight: 2
  },
  {
    id: "cook-q-009",
    role: "cook",
    topicId: "cook-equipment",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Оборудование работает нестабильно. Что нужно сделать в первую очередь?",
    options: [
      { id: "a", text: "Продолжить работу, если заказы не остановились", isCorrect: false },
      { id: "b", text: "Сообщить ответственному и действовать по регламенту безопасности", isCorrect: true },
      { id: "c", text: "Самостоятельно разобрать оборудование", isCorrect: false },
      { id: "d", text: "Отключить всё оборудование на кухне", isCorrect: false }
    ],
    explanation: "Сбои оборудования требуют безопасной эскалации, а не самостоятельного ремонта.",
    source: "Инструкция по безопасной работе с оборудованием",
    weight: 2
  },
  {
    id: "cook-q-010",
    role: "cook",
    topicId: "cook-shift",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Что важно сделать при закрытии рабочей зоны в конце смены?",
    options: [
      { id: "a", text: "Оставить часть заготовок на столе для утренней смены", isCorrect: false },
      { id: "b", text: "Убрать, промаркировать и передать статус зоны по чек-листу", isCorrect: true },
      { id: "c", text: "Проверить только личный инвентарь", isCorrect: false },
      { id: "d", text: "Закрыть зону без передачи, если заказов нет", isCorrect: false }
    ],
    explanation: "Закрытие смены фиксирует состояние зоны, остатков и задач для следующей смены.",
    source: "Чек-лист закрытия кухни",
    weight: 1
  },
  {
    id: "cook-q-011",
    role: "cook",
    topicId: "cook-storage",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Ты нашёл ингредиент с подходящим сроком, но упаковка повреждена. Что делать?",
    options: [
      { id: "a", text: "Использовать, если запах нормальный", isCorrect: false },
      { id: "b", text: "Отложить и передать ответственному для проверки", isCorrect: true },
      { id: "c", text: "Переложить в новую тару без записи", isCorrect: false },
      { id: "d", text: "Использовать только в термообработке", isCorrect: false }
    ],
    explanation: "Повреждённая упаковка требует проверки, даже если срок ещё не истёк.",
    source: "Регламент входного контроля и хранения",
    weight: 3
  },
  {
    id: "cook-q-012",
    role: "cook",
    topicId: "cook-tech-cards",
    type: "single_choice",
    difficulty: "intermediate",
    question: "В смене высокая загрузка, а техкарта кажется знакомой. Что допустимо?",
    options: [
      { id: "a", text: "Упростить граммовки для скорости", isCorrect: false },
      { id: "b", text: "Соблюдать техкарту и уточнять спорные шаги", isCorrect: true },
      { id: "c", text: "Делать по памяти без контроля", isCorrect: false },
      { id: "d", text: "Менять последовательность по удобству", isCorrect: false }
    ],
    explanation: "Загрузка не отменяет техкарту: она защищает стабильность вкуса и себестоимость.",
    source: "Техкарты популярных роллов",
    weight: 2
  },
  {
    id: "cook-q-013",
    role: "cook",
    topicId: "cook-labeling",
    type: "single_choice",
    difficulty: "advanced",
    question: "В холодильнике две партии одного ингредиента с разными сроками. Как выбрать партию для работы?",
    options: [
      { id: "a", text: "Взять ту, что ближе стоит", isCorrect: false },
      { id: "b", text: "Использовать партию по принципу ротации и сроков", isCorrect: true },
      { id: "c", text: "Смешать партии в одной ёмкости", isCorrect: false },
      { id: "d", text: "Оставить решение на конец смены", isCorrect: false }
    ],
    explanation: "Ротация по срокам снижает списания и сохраняет безопасность продукта.",
    source: "Регламент ротации ингредиентов",
    weight: 3
  },
  {
    id: "cook-q-014",
    role: "cook",
    topicId: "cook-defects",
    type: "single_choice",
    difficulty: "advanced",
    question: "Ты заметил повторяющийся брак по одной позиции за смену. Что лучше сделать?",
    options: [
      { id: "a", text: "Списать как обычную ошибку", isCorrect: false },
      { id: "b", text: "Зафиксировать, сообщить старшему и проверить причину по стандарту", isCorrect: true },
      { id: "c", text: "Скрыть, чтобы не задерживать смену", isCorrect: false },
      { id: "d", text: "Заменить ингредиент без согласования", isCorrect: false }
    ],
    explanation: "Повторяющийся брак — сигнал для корректировки процесса и обучения.",
    source: "Стандарт работы с браком",
    weight: 3
  },
  {
    id: "cook-q-015",
    role: "cook",
    topicId: "cook-product-matrix",
    type: "single_choice",
    difficulty: "advanced",
    question: "В меню обновилась позиция, а гость заказал её в первый день запуска. На что опираться?",
    options: [
      { id: "a", text: "На старый похожий ролл", isCorrect: false },
      { id: "b", text: "На актуальную матрицу, техкарту и запусковые материалы", isCorrect: true },
      { id: "c", text: "На описание в доставочном приложении", isCorrect: false },
      { id: "d", text: "На совет самого опытного коллеги без сверки", isCorrect: false }
    ],
    explanation: "Новые позиции готовят по актуальным сетевым материалам, а не по аналогии.",
    source: "Материалы запуска новых позиций",
    weight: 2
  },
  {
    id: "cook-q-016",
    role: "cook",
    topicId: "cook-equipment",
    type: "single_choice",
    difficulty: "advanced",
    question: "После технической паузы нужно вернуть станцию в работу. Что проверить перед стартом?",
    options: [
      { id: "a", text: "Только наличие заказов в очереди", isCorrect: false },
      { id: "b", text: "Безопасность оборудования, чистоту зоны и готовность ингредиентов", isCorrect: true },
      { id: "c", text: "Только температуру в зале", isCorrect: false },
      { id: "d", text: "Ничего, если пауза была короткой", isCorrect: false }
    ],
    explanation: "Возврат станции в работу требует проверки безопасности и готовности процесса.",
    source: "Чек-лист запуска станции",
    weight: 2
  }
];

export const adminQuestions: DiagnosticQuestion[] = [
  {
    id: "admin-q-001",
    role: "admin",
    topicId: "admin-complaints",
    type: "single_choice",
    difficulty: "basic",
    question: "Гость звонит и говорит, что заказ задерживается на 25 минут. Что ты сделаешь в первую очередь?",
    options: [
      { id: "a", text: "Скажешь, что кухня загружена", isCorrect: false },
      { id: "b", text: "Проверишь статус заказа и сообщишь гостю конкретную информацию", isCorrect: true },
      { id: "c", text: "Сразу предложишь отмену", isCorrect: false },
      { id: "d", text: "Переведёшь звонок на повара", isCorrect: false }
    ],
    explanation: "Сначала нужно проверить фактический статус заказа и дать гостю конкретную информацию.",
    source: "Регламент работы с задержками",
    weight: 2
  },
  {
    id: "admin-q-002",
    role: "admin",
    topicId: "admin-orders",
    type: "single_choice",
    difficulty: "basic",
    question: "Что важно проверить при приёме заказа?",
    options: [
      { id: "a", text: "Состав, адрес или формат выдачи, оплату и комментарии", isCorrect: true },
      { id: "b", text: "Только имя гостя", isCorrect: false },
      { id: "c", text: "Только сумму заказа", isCorrect: false },
      { id: "d", text: "Только время закрытия смены", isCorrect: false }
    ],
    explanation: "Администратор проверяет ключевые данные заказа до передачи в работу.",
    source: "Регламент приёма заказа",
    weight: 2
  },
  {
    id: "admin-q-003",
    role: "admin",
    topicId: "admin-communication",
    type: "single_choice",
    difficulty: "basic",
    question: "Какой тон общения подходит для первого ответа гостю?",
    options: [
      { id: "a", text: "Спокойный, вежливый и конкретный", isCorrect: true },
      { id: "b", text: "Короткий и сухой, чтобы быстрее завершить разговор", isCorrect: false },
      { id: "c", text: "С юмором в любой ситуации", isCorrect: false },
      { id: "d", text: "Без уточняющих вопросов", isCorrect: false }
    ],
    explanation: "Спокойная и конкретная коммуникация снижает напряжение и помогает решить вопрос.",
    source: "Стандарт общения с гостем",
    weight: 2
  },
  {
    id: "admin-q-004",
    role: "admin",
    topicId: "admin-payment",
    type: "single_choice",
    difficulty: "basic",
    question: "Если оплата по заказу не прошла, что нужно сделать?",
    options: [
      { id: "a", text: "Передать заказ на кухню как обычно", isCorrect: false },
      { id: "b", text: "Проверить статус оплаты и действовать по кассовому регламенту", isCorrect: true },
      { id: "c", text: "Попросить гостя оплатить наличными без фиксации", isCorrect: false },
      { id: "d", text: "Закрыть заказ вручную", isCorrect: false }
    ],
    explanation: "Кассовые операции нужно вести по регламенту и с корректной фиксацией статуса.",
    source: "Кассовый регламент",
    weight: 3
  },
  {
    id: "admin-q-005",
    role: "admin",
    topicId: "admin-delivery",
    type: "single_choice",
    difficulty: "basic",
    question: "Гость выбрал самовывоз. Что важно подтвердить?",
    options: [
      { id: "a", text: "Время готовности, точку получения и состав заказа", isCorrect: true },
      { id: "b", text: "Только номер телефона", isCorrect: false },
      { id: "c", text: "Только имя курьера", isCorrect: false },
      { id: "d", text: "Ничего, самовывоз не требует проверки", isCorrect: false }
    ],
    explanation: "Для самовывоза важно исключить ошибку по времени, точке и составу.",
    source: "Регламент самовывоза",
    weight: 1
  },
  {
    id: "admin-q-006",
    role: "admin",
    topicId: "admin-discounts",
    type: "single_choice",
    difficulty: "basic",
    question: "Гость спрашивает про акцию. На что нужно опираться в ответе?",
    options: [
      { id: "a", text: "На актуальные условия акции в системе или регламенте", isCorrect: true },
      { id: "b", text: "На память о прошлой акции", isCorrect: false },
      { id: "c", text: "На обещание любой скидки", isCorrect: false },
      { id: "d", text: "На мнение кухни", isCorrect: false }
    ],
    explanation: "Условия акций должны быть актуальными и одинаковыми для гостей.",
    source: "Регламент акций и скидок",
    weight: 1
  },
  {
    id: "admin-q-007",
    role: "admin",
    topicId: "admin-refunds",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Клиент получил заказ, но в нём не хватает одной позиции. Какое действие корректно?",
    options: [
      { id: "a", text: "Попросить клиента оформить новый заказ", isCorrect: false },
      { id: "b", text: "Проверить заказ, зафиксировать обращение и действовать по регламенту компенсации или довоза", isCorrect: true },
      { id: "c", text: "Сказать, что кухня не ошибается", isCorrect: false },
      { id: "d", text: "Передать вопрос курьеру", isCorrect: false }
    ],
    explanation: "Ошибку нужно зафиксировать и решить по регламенту: довоз, компенсация или другой сценарий.",
    source: "Регламент работы с ошибками в заказе",
    weight: 3
  },
  {
    id: "admin-q-008",
    role: "admin",
    topicId: "admin-kitchen",
    type: "single_choice",
    difficulty: "intermediate",
    question: "На кухне закончился ингредиент для нескольких позиций. Что должен сделать администратор?",
    options: [
      { id: "a", text: "Ждать, пока клиент сам выберет другое", isCorrect: false },
      { id: "b", text: "Обновить стоп-лист или доступность позиций по регламенту", isCorrect: true },
      { id: "c", text: "Продолжить принимать заказы", isCorrect: false },
      { id: "d", text: "Сообщить только курьерам", isCorrect: false }
    ],
    explanation: "Недоступная позиция должна быть отражена в стоп-листе или системе заказов.",
    source: "Регламент работы со стоп-листом",
    weight: 3
  },
  {
    id: "admin-q-009",
    role: "admin",
    topicId: "admin-delivery",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Курьер сообщает о задержке. Какой следующий шаг администратора?",
    options: [
      { id: "a", text: "Дождаться повторного звонка гостя", isCorrect: false },
      { id: "b", text: "Обновить статус, оценить время и предупредить гостя по регламенту", isCorrect: true },
      { id: "c", text: "Отменить заказ без согласования", isCorrect: false },
      { id: "d", text: "Передать разговор кухне", isCorrect: false }
    ],
    explanation: "При задержке важно дать гостю конкретику и зафиксировать статус.",
    source: "Регламент доставки",
    weight: 2
  },
  {
    id: "admin-q-010",
    role: "admin",
    topicId: "admin-shift-close",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Что входит в корректное закрытие смены администратора?",
    options: [
      { id: "a", text: "Передача статусов заказов, кассовая сверка и заметки по смене", isCorrect: true },
      { id: "b", text: "Только выключить рабочее место", isCorrect: false },
      { id: "c", text: "Оставить открытые вопросы на утро без записи", isCorrect: false },
      { id: "d", text: "Сверить только личные сообщения", isCorrect: false }
    ],
    explanation: "Закрытие смены помогает следующей команде увидеть статусы и риски.",
    source: "Чек-лист закрытия смены администратора",
    weight: 1
  },
  {
    id: "admin-q-011",
    role: "admin",
    topicId: "admin-reporting",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Менеджер просит краткий итог смены. Что важно включить?",
    options: [
      { id: "a", text: "Факты по заказам, обращениям, стоп-листу и нерешённым вопросам", isCorrect: true },
      { id: "b", text: "Только личное впечатление о смене", isCorrect: false },
      { id: "c", text: "Только количество гостей в зале", isCorrect: false },
      { id: "d", text: "Ничего, отчётность не нужна в прототипе", isCorrect: false }
    ],
    explanation: "Отчёт должен помогать управленцу видеть факты и зоны внимания.",
    source: "Форма сменного отчёта",
    weight: 1
  },
  {
    id: "admin-q-012",
    role: "admin",
    topicId: "admin-complaints",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Гость эмоционально недоволен качеством позиции. Как начать разговор?",
    options: [
      { id: "a", text: "Спокойно признать обращение, уточнить детали и зафиксировать ситуацию", isCorrect: true },
      { id: "b", text: "Сразу спорить, если кухня уверена в качестве", isCorrect: false },
      { id: "c", text: "Попросить звонить позже", isCorrect: false },
      { id: "d", text: "Не фиксировать, если гость раздражён", isCorrect: false }
    ],
    explanation: "Претензию сначала принимают, уточняют и фиксируют без спора.",
    source: "Регламент работы с претензиями",
    weight: 2
  },
  {
    id: "admin-q-013",
    role: "admin",
    topicId: "admin-payment",
    type: "single_choice",
    difficulty: "advanced",
    question: "В кассовой сверке есть расхождение. Какой подход корректен?",
    options: [
      { id: "a", text: "Исправить сумму вручную без записи", isCorrect: false },
      { id: "b", text: "Зафиксировать расхождение и эскалировать по кассовому регламенту", isCorrect: true },
      { id: "c", text: "Закрыть смену и вернуться к вопросу завтра", isCorrect: false },
      { id: "d", text: "Списать на скидку", isCorrect: false }
    ],
    explanation: "Кассовые расхождения требуют фиксации и управленческой проверки.",
    source: "Кассовый регламент",
    weight: 3
  },
  {
    id: "admin-q-014",
    role: "admin",
    topicId: "admin-kitchen",
    type: "single_choice",
    difficulty: "advanced",
    question: "Позиция в стоп-листе снова доступна после поставки. Что нужно сделать?",
    options: [
      { id: "a", text: "Сразу обещать гостям позицию без проверки кухни", isCorrect: false },
      { id: "b", text: "Согласовать готовность с кухней и обновить доступность по регламенту", isCorrect: true },
      { id: "c", text: "Оставить в стоп-листе до конца дня", isCorrect: false },
      { id: "d", text: "Сообщить только курьерам", isCorrect: false }
    ],
    explanation: "Стоп-лист обновляют после подтверждения фактической готовности позиции.",
    source: "Регламент работы со стоп-листом",
    weight: 2
  },
  {
    id: "admin-q-015",
    role: "admin",
    topicId: "admin-refunds",
    type: "single_choice",
    difficulty: "advanced",
    question: "Гость просит возврат по заказу, где часть позиций уже съедена. Что важно сделать?",
    options: [
      { id: "a", text: "Сразу отказать без фиксации", isCorrect: false },
      { id: "b", text: "Уточнить факты, зафиксировать обращение и действовать по регламенту возврата", isCorrect: true },
      { id: "c", text: "Вернуть всю сумму из личных средств", isCorrect: false },
      { id: "d", text: "Обещать любое решение до проверки", isCorrect: false }
    ],
    explanation: "Сложные возвраты требуют фактов, фиксации и решения в рамках регламента.",
    source: "Регламент отмен и возвратов",
    weight: 3
  },
  {
    id: "admin-q-016",
    role: "admin",
    topicId: "admin-reporting",
    type: "single_choice",
    difficulty: "advanced",
    question: "За смену было несколько задержек доставки. Что полезно передать управляющему?",
    options: [
      { id: "a", text: "Только общее ощущение, что день был сложный", isCorrect: false },
      { id: "b", text: "Количество случаев, причины, время задержек и открытые рекомендации", isCorrect: true },
      { id: "c", text: "Только имена курьеров", isCorrect: false },
      { id: "d", text: "Ничего, если гости уже получили заказы", isCorrect: false }
    ],
    explanation: "Фактический отчёт помогает найти причины задержек и снизить повторение.",
    source: "Форма отчёта по сменным рискам",
    weight: 2
  }
];

export const baristaQuestions: DiagnosticQuestion[] = [
  {
    id: "barista-q-001",
    role: "barista",
    topicId: "barista-hygiene",
    type: "single_choice",
    difficulty: "basic",
    question: "Что бариста проверяет перед первым напитком на смене?",
    options: [
      { id: "a", text: "Только наличие стаканов на стойке", isCorrect: false },
      { id: "b", text: "Чистоту рук, станции, инвентаря и готовность оборудования", isCorrect: true },
      { id: "c", text: "Только очередь заказов", isCorrect: false },
      { id: "d", text: "Только температуру в зале", isCorrect: false }
    ],
    explanation:
      "Перед работой бариста проверяет личную гигиену, чистоту станции и безопасную готовность оборудования.",
    source: "Demo KB · Стандарт гигиены кофейной стойки",
    weight: 3
  },
  {
    id: "barista-q-002",
    role: "barista",
    topicId: "barista-beans-storage",
    type: "single_choice",
    difficulty: "basic",
    question: "Как правильно обращаться с открытым пакетом зерна по стандарту сети?",
    options: [
      { id: "a", text: "Оставить открытым рядом с кофемолкой", isCorrect: false },
      { id: "b", text: "Закрыть, промаркировать и хранить вдали от влаги и тепла", isCorrect: true },
      { id: "c", text: "Пересыпать в любую свободную ёмкость без даты", isCorrect: false },
      { id: "d", text: "Смешать с остатками предыдущего зерна", isCorrect: false }
    ],
    explanation:
      "Зерно защищают от воздуха, влаги и тепла, а открытие партии фиксируют для ротации.",
    source: "Demo KB · Стандарт хранения зерна",
    weight: 2
  },
  {
    id: "barista-q-003",
    role: "barista",
    topicId: "barista-espresso-setup",
    type: "single_choice",
    difficulty: "basic",
    question: "Что означает учебный рецепт эспрессо 18-27-38?",
    options: [
      { id: "a", text: "18 мл воды, 27 г кофе и 38 секунд прогрева группы", isCorrect: false },
      { id: "b", text: "18 г закладка, 27 секунд экстракция и 38 мл выход напитка", isCorrect: true },
      { id: "c", text: "18 секунд помол, 27 мл молока и 38°C температура напитка", isCorrect: false },
      { id: "d", text: "Номер рецептуры, который не связан с параметрами шота", isCorrect: false }
    ],
    explanation:
      "В учебном рецепте 18-27-38 фиксируются закладка, время экстракции и выход эспрессо.",
    source: "Материалы методолога · День 1: Эспрессо",
    weight: 3
  },
  {
    id: "barista-q-004",
    role: "barista",
    topicId: "barista-grind-dose-tamp",
    type: "single_choice",
    difficulty: "basic",
    question: "Как бариста выбирает закладку эспрессо по учебному материалу?",
    options: [
      { id: "a", text: "По дате обжарки зерна: примерно от 17.5 г до 18.5 г", isCorrect: true },
      { id: "b", text: "Всегда ровно 15 г, независимо от зерна", isCorrect: false },
      { id: "c", text: "По размеру очереди у стойки", isCorrect: false },
      { id: "d", text: "По температуре молока в питчере", isCorrect: false }
    ],
    explanation:
      "Методологический материал связывает закладку с датой обжарки: чем старше зерно, тем выше учебная закладка.",
    source: "Материалы методолога · День 1: Эспрессо",
    weight: 2
  },
  {
    id: "barista-q-005",
    role: "barista",
    topicId: "barista-extraction-sensory",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Какой диапазон времени экстракции указан в учебном стандарте эспрессо?",
    options: [
      { id: "a", text: "23-32 секунды, с целевым диапазоном 27-30 секунд", isCorrect: true },
      { id: "b", text: "10-12 секунд, чтобы не задерживать очередь", isCorrect: false },
      { id: "c", text: "45-60 секунд для любой партии зерна", isCorrect: false },
      { id: "d", text: "Время не контролируется, важен только объём чашки", isCorrect: false }
    ],
    explanation:
      "Материал фиксирует стандарт 23-32 секунды и целевой ориентир 27-30 секунд.",
    source: "Материалы методолога · День 1: Эспрессо",
    weight: 2
  },
  {
    id: "barista-q-006",
    role: "barista",
    topicId: "barista-milk-texture",
    type: "single_choice",
    difficulty: "basic",
    question: "До какой температуры рекомендуется греть молоко для капучино?",
    options: [
      { id: "a", text: "55-65°C, около 60°C как ориентир сладости", isCorrect: true },
      { id: "b", text: "30-35°C, чтобы молоко осталось почти холодным", isCorrect: false },
      { id: "c", text: "80-90°C, чтобы пена была максимально горячей", isCorrect: false },
      { id: "d", text: "Температура не важна, если есть рисунок", isCorrect: false }
    ],
    explanation:
      "В материале указано 55-65°C; около 60°C молоко лучше раскрывает сладость.",
    source: "Материалы методолога · День 1: Эспрессо",
    weight: 3
  },
  {
    id: "barista-q-007",
    role: "barista",
    topicId: "barista-drink-recipes",
    type: "single_choice",
    difficulty: "basic",
    question: "Чем флэт уайт отличается от капучино в учебном материале?",
    options: [
      { id: "a", text: "Готовится с двумя порциями эспрессо и очень тонкой пеной", isCorrect: true },
      { id: "b", text: "Всегда готовится без эспрессо", isCorrect: false },
      { id: "c", text: "Должен иметь самую толстую сухую пену", isCorrect: false },
      { id: "d", text: "Отличается только цветом чашки", isCorrect: false }
    ],
    explanation:
      "Флэт уайт в материале описан как напиток 150-180 мл с двумя порциями эспрессо и тонкой пеной около 0.25 см.",
    source: "Материалы методолога · День 1: Эспрессо",
    weight: 2
  },
  {
    id: "barista-q-008",
    role: "barista",
    topicId: "barista-equipment-cleaning",
    type: "single_choice",
    difficulty: "basic",
    question: "Что делать после работы с молоком и перед следующим напитком?",
    options: [
      { id: "a", text: "Оставить питчер до паузы", isCorrect: false },
      { id: "b", text: "Очистить паровую трубку и промыть питчер по чек-листу", isCorrect: true },
      { id: "c", text: "Протереть только внешнюю сторону кофемашины", isCorrect: false },
      { id: "d", text: "Ничего, если очередь большая", isCorrect: false }
    ],
    explanation:
      "Чистка после молока — обязательный блок безопасности и качества напитков.",
    source: "Demo KB · Чек-лист чистки кофейного оборудования",
    weight: 3
  },
  {
    id: "barista-q-009",
    role: "barista",
    topicId: "barista-service-flow",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Как действовать в утренний пик, чтобы не потерять качество?",
    options: [
      { id: "a", text: "Упростить рецептуры без согласования", isCorrect: false },
      { id: "b", text: "Держать порядок заказов, группировать операции и не пропускать контроль", isCorrect: true },
      { id: "c", text: "Готовить молоко заранее на весь поток", isCorrect: false },
      { id: "d", text: "Не сообщать о задержках", isCorrect: false }
    ],
    explanation:
      "Поток ускоряют организацией операций, а не отказом от стандартов качества.",
    source: "Demo KB · Стандарт работы в пиковый поток",
    weight: 2
  },
  {
    id: "barista-q-010",
    role: "barista",
    topicId: "barista-guest-communication",
    type: "single_choice",
    difficulty: "basic",
    question: "Гость просит напиток, которого нет в рецептурах сети. Как ответить?",
    options: [
      { id: "a", text: "Придумать рецепт на месте", isCorrect: false },
      { id: "b", text: "Спокойно предложить ближайшую позицию из меню или уточнить у старшего", isCorrect: true },
      { id: "c", text: "Отказать без объяснения", isCorrect: false },
      { id: "d", text: "Обещать любой состав", isCorrect: false }
    ],
    explanation:
      "Бариста не придумывает правила меню: предлагает доступную альтернативу или уточняет.",
    source: "Demo KB · Стандарт гостевого диалога",
    weight: 1
  },
  {
    id: "barista-q-011",
    role: "barista",
    topicId: "barista-espresso-setup",
    type: "single_choice",
    difficulty: "advanced",
    question: "После смены зерна вкус эспрессо стал нестабильным. Что корректнее?",
    options: [
      { id: "a", text: "Работать по старой настройке до конца дня", isCorrect: false },
      { id: "b", text: "Перенастроить рецепт, сделать контрольные шоты и зафиксировать параметры", isCorrect: true },
      { id: "c", text: "Смешать новое зерно со старым без отметки", isCorrect: false },
      { id: "d", text: "Скрывать вкус молоком во всех напитках", isCorrect: false }
    ],
    explanation:
      "Смена зерна требует настройки рецепта и фиксации параметров для повторяемости.",
    source: "Demo KB · Стандарт настройки эспрессо",
    weight: 3
  },
  {
    id: "barista-q-012",
    role: "barista",
    topicId: "barista-milk-texture",
    type: "single_choice",
    difficulty: "advanced",
    question: "Почему молоко для капучино не стоит перегревать выше учебного диапазона?",
    options: [
      { id: "a", text: "Молоко хуже воспринимается по сладости, а текстура становится нестабильной", isCorrect: true },
      { id: "b", text: "Потому что при любой температуре выше 40°C эспрессо исчезает", isCorrect: false },
      { id: "c", text: "Перегрев нужен всегда, если напиток на вынос", isCorrect: false },
      { id: "d", text: "Температура влияет только на скорость обслуживания", isCorrect: false }
    ],
    explanation:
      "Около 60°C сладость воспринимается лучше, а правильно нагретое молоко даёт устойчивую тонкую пену.",
    source: "Материалы методолога · День 1: Эспрессо",
    weight: 3
  },
  {
    id: "barista-q-013",
    role: "barista",
    topicId: "barista-extraction-sensory",
    type: "single_choice",
    difficulty: "advanced",
    question: "Эспрессо горчит и сушит послевкусие. Что нужно проверить?",
    options: [
      { id: "a", text: "Параметры экстракции, свежесть шота и чистоту группы", isCorrect: true },
      { id: "b", text: "Только температуру в зале", isCorrect: false },
      { id: "c", text: "Добавить больше воды в готовый шот", isCorrect: false },
      { id: "d", text: "Сменить название напитка в заказе", isCorrect: false }
    ],
    explanation:
      "Горечь и сухость — повод проверить экстракцию и чистоту, а не маскировать дефект.",
    source: "Demo KB · Сенсорный чек-лист эспрессо",
    weight: 2
  },
  {
    id: "barista-q-014",
    role: "barista",
    topicId: "barista-equipment-cleaning",
    type: "single_choice",
    difficulty: "intermediate",
    question: "Когда бариста делает обратную промывку группы по чек-листу?",
    options: [
      { id: "a", text: "По чек-листу смены и при признаках загрязнения группы", isCorrect: true },
      { id: "b", text: "Только когда кофе перестал молоться", isCorrect: false },
      { id: "c", text: "Раз в месяц, если поток большой", isCorrect: false },
      { id: "d", text: "Никогда во время рабочей недели", isCorrect: false }
    ],
    explanation:
      "Группа кофемашины требует регулярной чистки по чек-листу, особенно при признаках загрязнения.",
    source: "Demo KB · Чек-лист чистки кофейного оборудования",
    weight: 3
  },
  {
    id: "barista-q-015",
    role: "barista",
    topicId: "barista-espresso-setup",
    type: "single_choice",
    difficulty: "advanced",
    question: "Что делать с помолом, если эспрессо проливается слишком быстро?",
    options: [
      { id: "a", text: "Уменьшить помол, менять шагом 0.1 и после изменения смолоть одну порцию в сброс", isCorrect: true },
      { id: "b", text: "Увеличить помол сразу на несколько делений и продолжать выдачу", isCorrect: false },
      { id: "c", text: "Не менять помол, а увеличить объём воды в готовом напитке", isCorrect: false },
      { id: "d", text: "Сменить чашку, не проверяя параметры рецепта", isCorrect: false }
    ],
    explanation:
      "В материале указано: быстрый пролив корректируют уменьшением помола; шаг изменения — 0.1, после изменения одна порция уходит в сброс.",
    source: "Материалы методолога · День 1: Эспрессо",
    weight: 3
  }
];

export const diagnosticQuestions: DiagnosticQuestion[] = [
  ...cookQuestions,
  ...adminQuestions,
  ...baristaQuestions
];
