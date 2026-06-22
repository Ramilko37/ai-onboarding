"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { answerOnboardingQuestion } from "../lib/answerOnboardingQuestion";
import {
  demoEmployees,
  knowledgeArticles,
  mockIntegrations,
  ownerLabels,
  phaseLabels,
  quickQuestions,
  roleDefinitions,
  statusLabels,
  type DemoEmployee,
  type DemoTask,
  type KnowledgeArticle,
  type OnboardingPhaseId,
  type TaskStatus
} from "../model/mvpDemoData";
import styles from "./MvpOnboardingPage.module.css";

type AppView = "employee" | "manager";

export type MvpOnboardingPageProps = {
  initialEmployeeId?: string;
  initialView?: AppView;
  allowModeSwitch?: boolean;
};

type ChatMessage = {
  id: string;
  author: "newcomer" | "assistant";
  text: string;
  createdAt: string;
  confidence?: "high" | "low";
  sources?: KnowledgeArticle[];
  escalationId?: string;
};

type DemoEscalation = {
  id: string;
  employeeId: string;
  title: string;
  reason: string;
  owner: "HR" | "IT" | "Manager" | "Mentor";
  status: "open" | "sent";
  createdAt: string;
};

const phases: OnboardingPhaseId[] = ["day_0", "day_1", "week_1", "month_1"];

const employeeStatusActions: Array<{ status: TaskStatus; label: string }> = [
  { status: "in_progress", label: "Начать" },
  { status: "done", label: "Готово" },
  { status: "blocked", label: "Нужна помощь" }
];

const employeeStatusLabels: Record<TaskStatus, string> = {
  todo: "К выполнению",
  in_progress: "В работе",
  done: "Готово",
  blocked: "Нужна помощь"
};

const initialEscalations: DemoEscalation[] = [
  {
    id: "initial-dev-access",
    employeeId: "employee-lera",
    title: "SSO / локальное окружение заблокированы",
    reason: "Задачи с доступами отмечены как blocked в маршруте новичка.",
    owner: "IT",
    status: "open",
    createdAt: "сегодня, 09:20"
  },
  {
    id: "initial-sales-shadowing",
    employeeId: "employee-timur",
    title: "Не назначен shadowing demo-call",
    reason: "У наставника нет календарного слота на Week 1.",
    owner: "Mentor",
    status: "open",
    createdAt: "сегодня, 10:05"
  }
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getRouteProgress(tasks: DemoTask[]) {
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === "done").length;
  const needsHelp = tasks.filter((task) => task.status === "blocked").length;
  const inProgress = tasks.filter((task) => task.status === "in_progress").length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return { total, done, needsHelp, inProgress, percent };
}

function getEmployeeName(employeeId: string, employees: DemoEmployee[]) {
  return employees.find((employee) => employee.id === employeeId)?.name ?? "Неизвестный новичок";
}

function getTaskArticles(task: DemoTask) {
  return task.sourceArticleIds
    .map((articleId) => knowledgeArticles.find((article) => article.id === articleId))
    .filter((article): article is KnowledgeArticle => Boolean(article));
}

function getPersonalArticles(tasks: DemoTask[]) {
  const articleIds = Array.from(new Set(tasks.flatMap((task) => task.sourceArticleIds)));

  return articleIds
    .map((articleId) => knowledgeArticles.find((article) => article.id === articleId))
    .filter((article): article is KnowledgeArticle => Boolean(article));
}

function getWelcomeMessage(employee: DemoEmployee): ChatMessage {
  return {
    id: `assistant-welcome-${employee.id}`,
    author: "assistant",
    text: `Привет, ${employee.name.split(" ")[0]}! Я помогу пройти ваш персональный онбординг: подскажу следующий шаг, найду инструкцию в базе знаний и передам вопрос человеку, если в источниках нет уверенного ответа.`,
    createdAt: "старт демо",
    confidence: "high",
    sources: [knowledgeArticles[0], knowledgeArticles[1]]
  };
}

function getInitialMessagesByEmployee() {
  return Object.fromEntries(
    demoEmployees.map((employee) => [employee.id, [getWelcomeMessage(employee)]])
  ) as Record<string, ChatMessage[]>;
}

function getEscalationOwner(task?: DemoTask): DemoEscalation["owner"] {
  if (task?.owner === "it") {
    return "IT";
  }

  if (task?.owner === "mentor") {
    return "Mentor";
  }

  if (task?.owner === "manager") {
    return "Manager";
  }

  return "HR";
}

export function MvpOnboardingPage({
  initialEmployeeId = demoEmployees[0]?.id ?? "",
  initialView = "employee",
  allowModeSwitch = true
}: MvpOnboardingPageProps = {}) {
  const [view, setView] = useState<AppView>(initialView);
  const [employees, setEmployees] = useState<DemoEmployee[]>(demoEmployees);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(initialEmployeeId);
  const [question, setQuestion] = useState("");
  const [messagesByEmployee, setMessagesByEmployee] = useState<Record<string, ChatMessage[]>>(
    getInitialMessagesByEmployee
  );
  const [escalations, setEscalations] = useState<DemoEscalation[]>(initialEscalations);

  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId) ?? employees[0]!;
  const selectedRole = roleDefinitions.find((role) => role.id === selectedEmployee.roleId) ?? roleDefinitions[0]!;
  const selectedProgress = getRouteProgress(selectedEmployee.tasks);
  const messages = messagesByEmployee[selectedEmployee.id] ?? [getWelcomeMessage(selectedEmployee)];
  const personalArticles = getPersonalArticles(selectedEmployee.tasks).slice(0, 8);
  const nextTask =
    selectedEmployee.tasks.find((task) => task.status === "in_progress") ??
    selectedEmployee.tasks.find((task) => task.status === "todo") ??
    selectedEmployee.tasks.find((task) => task.status === "blocked") ??
    selectedEmployee.tasks[0];

  const tasksByPhase = useMemo(
    () =>
      phases.map((phaseId) => ({
        phaseId,
        tasks: selectedEmployee.tasks.filter((task) => task.phaseId === phaseId)
      })),
    [selectedEmployee]
  );

  const dashboard = useMemo(() => {
    const allTasks = employees.flatMap((employee) => employee.tasks);
    const doneTasks = allTasks.filter((task) => task.status === "done").length;
    const blockedTasks = allTasks.filter((task) => task.status === "blocked");
    const openEscalations = escalations.filter((escalation) => escalation.status === "open");
    const completionRate = allTasks.length === 0 ? 0 : Math.round((doneTasks / allTasks.length) * 100);
    const askedQuestions = Object.values(messagesByEmployee)
      .flat()
      .filter((message) => message.author === "newcomer")
      .map((message) => message.text);

    return {
      completionRate,
      blockedTasks,
      openEscalations,
      askedQuestions: askedQuestions.length > 0 ? askedQuestions.slice(-5).reverse() : quickQuestions.slice(0, 5)
    };
  }, [employees, escalations, messagesByEmployee]);

  function updateTaskStatus(taskId: string, status: TaskStatus) {
    const currentTask = selectedEmployee.tasks.find((task) => task.id === taskId);

    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) => {
        if (employee.id !== selectedEmployee.id) {
          return employee;
        }

        return {
          ...employee,
          tasks: employee.tasks.map((task) => (task.id === taskId ? { ...task, status } : task))
        };
      })
    );

    if (status === "blocked" && currentTask?.status !== "blocked") {
      setEscalations((previousEscalations) => [
        {
          id: makeId("help-request"),
          employeeId: selectedEmployee.id,
          title: currentTask?.title ?? "Нужна помощь по задаче",
          reason: "Сотрудник нажал «Нужна помощь» в личном онбординг-треке.",
          owner: getEscalationOwner(currentTask),
          status: "open",
          createdAt: "только что"
        },
        ...previousEscalations
      ]);
    }
  }

  function askAssistant(text: string) {
    const trimmedQuestion = text.trim();

    if (!trimmedQuestion) {
      return;
    }

    const reply = answerOnboardingQuestion({
      question: trimmedQuestion,
      roleId: selectedEmployee.roleId,
      articles: knowledgeArticles
    });

    const escalation = reply.shouldEscalate
      ? {
          id: makeId("assistant-escalation"),
          employeeId: selectedEmployee.id,
          title: trimmedQuestion,
          reason: reply.escalationReason ?? "AI-ассистент не нашёл подтверждённый ответ",
          owner: "HR" as const,
          status: "open" as const,
          createdAt: "только что"
        }
      : null;

    setMessagesByEmployee((previousMessagesByEmployee) => {
      const currentMessages = previousMessagesByEmployee[selectedEmployee.id] ?? [getWelcomeMessage(selectedEmployee)];

      return {
        ...previousMessagesByEmployee,
        [selectedEmployee.id]: [
          ...currentMessages,
          {
            id: makeId("question"),
            author: "newcomer",
            text: trimmedQuestion,
            createdAt: "только что"
          },
          {
            id: makeId("answer"),
            author: "assistant",
            text: reply.text,
            createdAt: "только что",
            confidence: reply.confidence,
            sources: reply.sources,
            escalationId: escalation?.id
          }
        ]
      };
    });

    if (escalation) {
      setEscalations((previousEscalations) => [escalation, ...previousEscalations]);
    }

    setQuestion("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askAssistant(question);
  }

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div>
          <span>AI Onboarding MVP</span>
          <strong>{view === "employee" ? "Личный портал сотрудника" : "Служебный режим HR / руководителя"}</strong>
        </div>
        {allowModeSwitch ? (
          <nav aria-label="Режим прототипа">
            <button
              className={view === "employee" ? styles.viewButtonActive : styles.viewButton}
              type="button"
              onClick={() => setView("employee")}
            >
              Портал сотрудника
            </button>
            <button
              className={view === "manager" ? styles.viewButtonActive : styles.viewButton}
              type="button"
              onClick={() => setView("manager")}
            >
              HR / руководитель
            </button>
          </nav>
        ) : (
          <p className={styles.personalRouteNote}>Личная ссылка сотрудника · служебная панель скрыта</p>
        )}
      </header>

      {view === "employee" ? (
        <section className={styles.employeeShell}>
          <section className={styles.employeeHero}>
            <div>
              <p className={styles.kicker}>Мой онбординг</p>
              <h1>Добро пожаловать, {selectedEmployee.name.split(" ")[0]}</h1>
              <p>
                Здесь только ваш персональный путь: что сделать сейчас, какие материалы открыть,
                где задать вопрос ассистенту и когда подключить наставника или руководителя.
              </p>
            </div>
            <aside className={styles.employeeSummary} aria-label="Мои данные адаптации">
              <strong>{selectedRole.title}</strong>
              <span>{selectedEmployee.team}</span>
              <dl>
                <div>
                  <dt>Старт</dt>
                  <dd>{selectedEmployee.startDate}</dd>
                </div>
                <div>
                  <dt>Локация</dt>
                  <dd>{selectedEmployee.location}</dd>
                </div>
                <div>
                  <dt>Руководитель</dt>
                  <dd>{selectedEmployee.manager}</dd>
                </div>
                <div>
                  <dt>Наставник</dt>
                  <dd>{selectedEmployee.mentor}</dd>
                </div>
              </dl>
            </aside>
          </section>

          <section className={styles.employeeGrid}>
            <article className={styles.todayCard}>
              <p className={styles.kicker}>Следующий шаг</p>
              {nextTask ? (
                <>
                  <h2>{nextTask.title}</h2>
                  <p>{nextTask.description}</p>
                  <div className={styles.taskMeta}>
                    <span>{nextTask.dueLabel}</span>
                    <span>{ownerLabels[nextTask.owner]}</span>
                    {nextTask.integrationId && (
                      <span>{mockIntegrations.find((item) => item.id === nextTask.integrationId)?.title}</span>
                    )}
                  </div>
                  <div className={styles.statusButtons}>
                    {employeeStatusActions.map((action) => (
                      <button
                        className={nextTask.status === action.status ? styles.statusButtonActive : styles.statusButton}
                        key={action.status}
                        type="button"
                        onClick={() => updateTaskStatus(nextTask.id, action.status)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p>Маршрут пока пуст. Обратитесь к HR или руководителю.</p>
              )}
            </article>

            <article className={styles.progressForEmployee}>
              <p className={styles.kicker}>Мой прогресс</p>
              <div>
                <strong>{selectedProgress.done}/{selectedProgress.total}</strong>
                <span>шагов выполнено</span>
              </div>
              <div>
                <strong>{selectedProgress.inProgress}</strong>
                <span>сейчас в работе</span>
              </div>
              <div>
                <strong>{selectedProgress.needsHelp}</strong>
                <span>нужна помощь</span>
              </div>
              <small>Это не оценка знаний и не рейтинг. Это навигация по вашему онбордингу.</small>
            </article>
          </section>

          <section className={styles.employeeMainGrid}>
            <article className={styles.trackPanel}>
              <div className={styles.panelHeader}>
                <p className={styles.kicker}>Персональный трек обучения</p>
                <h2>Ваш путь по этапам</h2>
                <p>{selectedRole.routeGoal}</p>
              </div>

              <div className={styles.phaseList}>
                {tasksByPhase.map(({ phaseId, tasks }) => (
                  <section className={styles.phaseCard} key={phaseId}>
                    <h3>{phaseLabels[phaseId]}</h3>
                    {tasks.map((task) => {
                      const taskArticles = getTaskArticles(task);

                      return (
                        <div className={styles.taskCard} key={task.id}>
                          <div className={styles.taskTopline}>
                            <strong>{task.title}</strong>
                            <span className={styles[`status_${task.status}`]}>{employeeStatusLabels[task.status]}</span>
                          </div>
                          <p>{task.description}</p>
                          <div className={styles.taskMeta}>
                            <span>{ownerLabels[task.owner]}</span>
                            <span>{task.dueLabel}</span>
                          </div>
                          {taskArticles.length > 0 && (
                            <div className={styles.sourceList}>
                              {taskArticles.map((article) => (
                                <small key={article.id}>Материал: {article.title}</small>
                              ))}
                            </div>
                          )}
                          <div className={styles.statusButtons}>
                            {employeeStatusActions.map((action) => (
                              <button
                                className={task.status === action.status ? styles.statusButtonActive : styles.statusButton}
                                key={action.status}
                                type="button"
                                onClick={() => updateTaskStatus(task.id, action.status)}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </section>
                ))}
              </div>
            </article>

            <aside className={styles.employeeSidePanel}>
              <article className={styles.chatPanel}>
                <div className={styles.panelHeader}>
                  <p className={styles.kicker}>Мой ассистент</p>
                  <h2>Спросить по адаптации</h2>
                  <p>Ассистент отвечает по базе знаний и показывает источники. Если вопрос не подтверждён источниками, он передаёт его человеку.</p>
                </div>

                <div className={styles.quickQuestions} aria-label="Быстрые вопросы">
                  {quickQuestions.map((item) => (
                    <button key={item} type="button" onClick={() => askAssistant(item)}>
                      {item}
                    </button>
                  ))}
                </div>

                <div className={styles.chatFeed} aria-live="polite">
                  {messages.map((message) => (
                    <div
                      className={message.author === "assistant" ? styles.assistantMessage : styles.userMessage}
                      key={message.id}
                    >
                      <div className={styles.messageMeta}>
                        <span>{message.author === "assistant" ? "AI assistant" : "Вы"}</span>
                        <small>{message.createdAt}</small>
                      </div>
                      <p>{message.text}</p>
                      {message.sources && message.sources.length > 0 && (
                        <div className={styles.answerSources}>
                          {message.sources.map((source) => (
                            <span key={source.id}>{source.title} · {source.source}</span>
                          ))}
                        </div>
                      )}
                      {message.escalationId && (
                        <div className={styles.escalationNotice}>Вопрос передан человеку. ID: {message.escalationId}</div>
                      )}
                    </div>
                  ))}
                </div>

                <form className={styles.chatForm} onSubmit={handleSubmit}>
                  <label>
                    <span>Ваш вопрос</span>
                    <textarea
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      placeholder="Например: Что мне сделать в первый день?"
                      rows={3}
                    />
                  </label>
                  <button type="submit">Спросить ассистента</button>
                </form>
              </article>

              <article className={styles.materialsCard}>
                <p className={styles.kicker}>Мои материалы</p>
                <h2>Полезное для трека</h2>
                <div className={styles.materialList}>
                  {personalArticles.map((article) => (
                    <div key={article.id}>
                      <strong>{article.title}</strong>
                      <span>{article.source}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className={styles.supportCard}>
                <p className={styles.kicker}>К кому обратиться</p>
                <h2>Поддержка рядом</h2>
                <dl>
                  <div>
                    <dt>Наставник</dt>
                    <dd>{selectedEmployee.mentor}</dd>
                  </div>
                  <div>
                    <dt>Руководитель</dt>
                    <dd>{selectedEmployee.manager}</dd>
                  </div>
                  <div>
                    <dt>HR / доступы</dt>
                    <dd>Через кнопку «Нужна помощь» или вопрос ассистенту</dd>
                  </div>
                </dl>
              </article>
            </aside>
          </section>
        </section>
      ) : (
        <section className={styles.managerShell}>
          <section className={styles.managerHero}>
            <div>
              <p className={styles.kicker}>Служебный режим</p>
              <h1>HR и руководитель видят прогресс, но это не экран сотрудника.</h1>
              <p>
                Этот режим нужен для демо управленческой прозрачности: кто застрял, где нужна помощь,
                какие вопросы повторяются и какие интеграции подключаются моками.
              </p>
            </div>
            <div className={styles.managerStats}>
              <div>
                <strong>{dashboard.completionRate}%</strong>
                <span>общий completion</span>
              </div>
              <div>
                <strong>{dashboard.blockedTasks.length}</strong>
                <span>задач требуют помощи</span>
              </div>
              <div>
                <strong>{dashboard.openEscalations.length}</strong>
                <span>открытых эскалаций</span>
              </div>
            </div>
          </section>

          <section className={styles.managerGrid}>
            <article className={styles.dashboardSection}>
              <h2>Новички в адаптации</h2>
              {employees.map((employee) => {
                const progress = getRouteProgress(employee.tasks);
                const role = roleDefinitions.find((item) => item.id === employee.roleId);

                return (
                  <button
                    className={employee.id === selectedEmployee.id ? styles.employeeRowActive : styles.employeeRow}
                    key={employee.id}
                    type="button"
                    onClick={() => setSelectedEmployeeId(employee.id)}
                  >
                    <span>{employee.name}</span>
                    <small>{role?.title} · {progress.done}/{progress.total} шагов · помощь: {progress.needsHelp}</small>
                  </button>
                );
              })}
            </article>

            <article className={styles.dashboardSection}>
              <h2>Открытые эскалации</h2>
              {dashboard.openEscalations.length === 0 ? (
                <p className={styles.emptyState}>Открытых эскалаций нет.</p>
              ) : (
                dashboard.openEscalations.map((escalation) => (
                  <div className={styles.escalationCard} key={escalation.id}>
                    <strong>{escalation.title}</strong>
                    <span>{getEmployeeName(escalation.employeeId, employees)} · owner: {escalation.owner}</span>
                    <p>{escalation.reason}</p>
                  </div>
                ))
              )}
            </article>

            <article className={styles.dashboardSection}>
              <h2>Частые вопросы</h2>
              <ul className={styles.intentList}>
                {dashboard.askedQuestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className={styles.dashboardSection}>
              <h2>Моки интеграций</h2>
              <div className={styles.integrationGrid}>
                {mockIntegrations.map((integration) => (
                  <div className={styles.integrationCard} key={integration.id}>
                    <strong>{integration.title}</strong>
                    <span>{integration.status}</span>
                    <p>{integration.description}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </section>
      )}
    </main>
  );
}
