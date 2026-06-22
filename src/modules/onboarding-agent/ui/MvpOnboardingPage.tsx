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
const statusOptions: TaskStatus[] = ["todo", "in_progress", "done", "blocked"];

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
  const blocked = tasks.filter((task) => task.status === "blocked").length;
  const inProgress = tasks.filter((task) => task.status === "in_progress").length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return { total, done, blocked, inProgress, percent };
}

function getEmployeeName(employeeId: string, employees: DemoEmployee[]) {
  return employees.find((employee) => employee.id === employeeId)?.name ?? "Неизвестный новичок";
}

function getSourceTitles(task: DemoTask) {
  return task.sourceArticleIds
    .map((articleId) => knowledgeArticles.find((article) => article.id === articleId))
    .filter((article): article is KnowledgeArticle => Boolean(article))
    .map((article) => article.title);
}

export function MvpOnboardingPage() {
  const [employees, setEmployees] = useState<DemoEmployee[]>(demoEmployees);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(demoEmployees[0]?.id ?? "");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-welcome",
      author: "assistant",
      text: "Привет! Я AI-ассистент онбординга. Отвечаю только по curated базе знаний, показываю источники и эскалирую неизвестные или чувствительные вопросы к человеку.",
      createdAt: "demo start",
      confidence: "high",
      sources: [knowledgeArticles[0], knowledgeArticles[1]]
    }
  ]);
  const [escalations, setEscalations] = useState<DemoEscalation[]>(initialEscalations);

  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId) ?? employees[0];
  const selectedRole = roleDefinitions.find((role) => role.id === selectedEmployee.roleId) ?? roleDefinitions[0];
  const selectedProgress = getRouteProgress(selectedEmployee.tasks);

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
    const askedQuestions = messages.filter((message) => message.author === "newcomer").map((message) => message.text);

    return {
      completionRate,
      blockedTasks,
      openEscalations,
      askedQuestions: askedQuestions.length > 0 ? askedQuestions.slice(-5).reverse() : quickQuestions.slice(0, 5)
    };
  }, [employees, escalations, messages]);

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
          id: makeId("blocked-task"),
          employeeId: selectedEmployee.id,
          title: currentTask?.title ?? "Задача заблокирована",
          reason: "Новичок отметил задачу как blocked в onboarding-маршруте.",
          owner: currentTask?.owner === "it" ? "IT" : currentTask?.owner === "mentor" ? "Mentor" : "Manager",
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

    setMessages((previousMessages) => [
      ...previousMessages,
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
    ]);

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
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Demo-first MVP · AI onboarding layer</p>
          <h1>Онбординг, который ведёт новичка, отвечает по базе знаний и даёт HR прозрачность.</h1>
          <p>
            Прототип следует MVP flow: персональный маршрут по роли, AI-ассистент с источниками,
            статусы задач, fallback на HR/наставника, dashboard руководителя и мок-интеграции вместо HRIS/LMS/SSO.
          </p>
        </div>
        <div className={styles.heroMetrics} aria-label="Ключевые показатели демо">
          <div>
            <strong>3</strong>
            <span>роли в seed-данных</span>
          </div>
          <div>
            <strong>{knowledgeArticles.length}</strong>
            <span>статей в базе знаний</span>
          </div>
          <div>
            <strong>{dashboard.openEscalations.length}</strong>
            <span>открытых эскалаций</span>
          </div>
        </div>
      </section>

      <section className={styles.personaBar} aria-label="Выбор демо-новичка">
        {employees.map((employee) => {
          const role = roleDefinitions.find((item) => item.id === employee.roleId);
          const progress = getRouteProgress(employee.tasks);
          const isActive = employee.id === selectedEmployee.id;

          return (
            <button
              className={isActive ? styles.personaButtonActive : styles.personaButton}
              key={employee.id}
              type="button"
              onClick={() => setSelectedEmployeeId(employee.id)}
            >
              <span>{employee.name}</span>
              <small>{role?.title}</small>
              <em>{progress.percent}% маршрута</em>
            </button>
          );
        })}
      </section>

      <section className={styles.workspace}>
        <article className={styles.routePanel}>
          <div className={styles.panelHeader}>
            <p className={styles.kicker}>Зона новичка</p>
            <h2>Персональный маршрут</h2>
            <p>{selectedRole.routeGoal}</p>
          </div>

          <div className={styles.profileCard}>
            <div>
              <strong>{selectedEmployee.name}</strong>
              <span>{selectedRole.title}</span>
            </div>
            <dl>
              <div>
                <dt>Команда</dt>
                <dd>{selectedEmployee.team}</dd>
              </div>
              <div>
                <dt>Старт</dt>
                <dd>{selectedEmployee.startDate}</dd>
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
          </div>

          <div className={styles.progressCard}>
            <div>
              <strong>{selectedProgress.percent}%</strong>
              <span>completion rate</span>
            </div>
            <div>
              <strong>{selectedProgress.done}/{selectedProgress.total}</strong>
              <span>задач закрыто</span>
            </div>
            <div>
              <strong>{selectedProgress.blocked}</strong>
              <span>блокеров</span>
            </div>
          </div>

          <div className={styles.competencyList}>
            {selectedRole.competencies.map((competency) => (
              <span key={competency}>{competency}</span>
            ))}
          </div>

          <div className={styles.phaseList}>
            {tasksByPhase.map(({ phaseId, tasks }) => (
              <section className={styles.phaseCard} key={phaseId}>
                <h3>{phaseLabels[phaseId]}</h3>
                {tasks.map((task) => (
                  <div className={styles.taskCard} key={task.id}>
                    <div className={styles.taskTopline}>
                      <strong>{task.title}</strong>
                      <span className={styles[`status_${task.status}`]}>{statusLabels[task.status]}</span>
                    </div>
                    <p>{task.description}</p>
                    <div className={styles.taskMeta}>
                      <span>{ownerLabels[task.owner]}</span>
                      <span>{task.dueLabel}</span>
                      {task.integrationId && <span>{mockIntegrations.find((item) => item.id === task.integrationId)?.title}</span>}
                    </div>
                    <div className={styles.sourceList}>
                      {getSourceTitles(task).map((title) => (
                        <small key={title}>Источник: {title}</small>
                      ))}
                    </div>
                    <div className={styles.statusButtons}>
                      {statusOptions.map((status) => (
                        <button
                          className={task.status === status ? styles.statusButtonActive : styles.statusButton}
                          key={status}
                          type="button"
                          onClick={() => updateTaskStatus(task.id, status)}
                        >
                          {statusLabels[status]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </article>

        <article className={styles.chatPanel}>
          <div className={styles.panelHeader}>
            <p className={styles.kicker}>AI-ассистент</p>
            <h2>Ответы по базе знаний</h2>
            <p>Curated retrieval: уверенный ответ показывает источник, неизвестный или чувствительный вопрос создаёт эскалацию.</p>
          </div>

          <div className={styles.guardrailCard}>
            <strong>Guardrails demo</strong>
            <span>Нет источника → fallback к человеку. Payroll/legal/disciplinary/medical → сразу HR.</span>
          </div>

          <div className={styles.quickQuestions} aria-label="Демо-вопросы">
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
                  <span>{message.author === "assistant" ? "AI assistant" : selectedEmployee.name}</span>
                  <small>{message.createdAt}</small>
                  {message.confidence && <small>confidence: {message.confidence}</small>}
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
                  <div className={styles.escalationNotice}>Создана эскалация: {message.escalationId}</div>
                )}
              </div>
            ))}
          </div>

          <form className={styles.chatForm} onSubmit={handleSubmit}>
            <label>
              <span>Вопрос новичка</span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Например: Как получить доступ к CRM?"
                rows={3}
              />
            </label>
            <button type="submit">Спросить ассистента</button>
          </form>
        </article>

        <aside className={styles.dashboardPanel}>
          <div className={styles.panelHeader}>
            <p className={styles.kicker}>HR / manager dashboard</p>
            <h2>Прогресс, блокеры, эскалации</h2>
            <p>Демо-панель показывает то, что в MVP заменяет ручные Excel-таблицы и хаотичные статусы.</p>
          </div>

          <div className={styles.dashboardStats}>
            <div>
              <strong>{dashboard.completionRate}%</strong>
              <span>общий completion</span>
            </div>
            <div>
              <strong>{dashboard.blockedTasks.length}</strong>
              <span>blocked tasks</span>
            </div>
            <div>
              <strong>{dashboard.openEscalations.length}</strong>
              <span>open escalations</span>
            </div>
          </div>

          <section className={styles.dashboardSection}>
            <h3>Новички</h3>
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
                  <small>{role?.title} · {progress.percent}% · {progress.blocked} blockers</small>
                </button>
              );
            })}
          </section>

          <section className={styles.dashboardSection}>
            <h3>Открытые эскалации</h3>
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
          </section>

          <section className={styles.dashboardSection}>
            <h3>Частые вопросы / search intents</h3>
            <ul className={styles.intentList}>
              {dashboard.askedQuestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className={styles.dashboardSection}>
            <h3>Моки интеграций</h3>
            <div className={styles.integrationGrid}>
              {mockIntegrations.map((integration) => (
                <div className={styles.integrationCard} key={integration.id}>
                  <strong>{integration.title}</strong>
                  <span>{integration.status}</span>
                  <p>{integration.description}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
