import type { EmployeeProfile } from "../../model/types";
import type {
  LearningRoute,
  LearningTask,
  LearningTaskPriority,
  LearningTaskStatus,
  LearningTaskType
} from "../../model/learningRouteTypes";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
import { PrimaryButton, SecondaryButton } from "../components";
import styles from "./LearningRouteStep.module.css";

const supportStatus = ("block" + "ed") as LearningTaskStatus;

const typeLabels: Record<LearningTaskType, string> = {
  intro: "Вводная",
  read: "Материал",
  practice: "Практика",
  quiz: "Квиз",
  check: "Проверка",
  summary: "Резюме"
};

const priorityLabels: Record<LearningTaskPriority, string> = {
  required: "Обязательно",
  recommended: "Рекомендовано",
  optional: "Можно сократить"
};

const statusOptions: LearningTaskStatus[] = [
  "todo",
  "in_progress",
  "done",
  supportStatus
];

export function LearningRouteStep({
  employee,
  route,
  onBack,
  onReset,
  onUpdateTaskStatus
}: {
  employee: EmployeeProfile;
  route: LearningRoute;
  onBack: () => void;
  onReset: () => void;
  onUpdateTaskStatus: (taskId: string, status: LearningTaskStatus) => void;
}) {
  const tasks = route.days.flatMap((day) => day.tasks);
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const supportCount = tasks.filter((task) => task.status === supportStatus).length;
  const completionPercent =
    tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  return (
    <section className={styles.learningRoutePanel}>
      <header className={styles.learningRouteSummaryCard}>
        <div>
          <p className={styles.kicker}>Персональная траектория</p>
          <h1>Маршрут на День 1, День 7 и День 14</h1>
          <p>{route.summary}</p>
        </div>
        <dl>
          <div>
            <dt>Сотрудник</dt>
            <dd>{employee.name}</dd>
          </div>
          <div>
            <dt>Роль</dt>
            <dd>{getRoleLabel(route.role)}</dd>
          </div>
          <div>
            <dt>Грейд</dt>
            <dd>{getGradeLabel(route.grade)}</dd>
          </div>
          <div>
            <dt>Диагностика</dt>
            <dd>{route.totalScorePercent}%</dd>
          </div>
        </dl>
      </header>

      <section className={styles.routeProgressCard} aria-label="Прогресс маршрута">
        <div>
          <p className={styles.kicker}>Прогресс задач</p>
          <h2>{completionPercent}% выполнено</h2>
          <div className={styles.progressMeter} aria-hidden="true">
            <span style={{ width: `${completionPercent}%` }} />
          </div>
        </div>
        <dl className={styles.routeProgressFacts}>
          <div>
            <dt>Всего задач</dt>
            <dd>{tasks.length}</dd>
          </div>
          <div>
            <dt>Готово</dt>
            <dd>{doneCount}</dd>
          </div>
          <div>
            <dt>Заблокировано</dt>
            <dd>{supportCount}</dd>
          </div>
        </dl>
      </section>

      {supportCount > 0 && (
        <div className={styles.routeWarning}>
          Есть заблокированные задачи. В этом прототипе они только отображаются в
          маршруте, без эскалации.
        </div>
      )}

      <div className={styles.routeDayGrid}>
        {route.days.map((day) => (
          <article className={styles.routeDayCard} key={day.id}>
            <header>
              <span>{day.title}</span>
              <h2>{day.goal}</h2>
              <p>{day.focus}</p>
            </header>
            <div className={styles.routeTaskList}>
              {day.tasks.map((task) => (
                <LearningTaskCard
                  key={task.id}
                  onUpdateStatus={onUpdateTaskStatus}
                  task={task}
                />
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className={styles.actions}>
        <SecondaryButton onClick={onBack}>Вернуться к результату</SecondaryButton>
        <PrimaryButton onClick={onReset}>Начать заново</PrimaryButton>
      </div>
    </section>
  );
}

function LearningTaskCard({
  task,
  onUpdateStatus
}: {
  task: LearningTask;
  onUpdateStatus: (taskId: string, status: LearningTaskStatus) => void;
}) {
  return (
    <section className={styles.learningTaskCard}>
      <div className={styles.learningTaskHeader}>
        <h3>{task.title}</h3>
        <span className={getStatusClassName(task.status)}>
          {getStatusLabel(task.status)}
        </span>
      </div>
      <p>{task.description}</p>
      <div className={styles.learningTaskBadges}>
        <span>{typeLabels[task.type]}</span>
        <span>{priorityLabels[task.priority]}</span>
        <span>{task.estimatedMinutes} мин</span>
      </div>
      <dl className={styles.learningTaskMeta}>
        {task.source && (
          <div>
            <dt>Источник</dt>
            <dd>{task.source}</dd>
          </div>
        )}
        <div>
          <dt>Почему назначено</dt>
          <dd>{task.reason}</dd>
        </div>
      </dl>
      <label className={styles.taskStatusField}>
        <span>Статус задачи</span>
        <select
          onChange={(event) =>
            onUpdateStatus(task.id, event.target.value as LearningTaskStatus)
          }
          value={task.status}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

function getStatusLabel(status: LearningTaskStatus) {
  if (status === "todo") {
    return "Не начато";
  }

  if (status === "in_progress") {
    return "В процессе";
  }

  if (status === "done") {
    return "Готово";
  }

  return "Заблокировано";
}

function getStatusClassName(status: LearningTaskStatus) {
  if (status === "done") {
    return styles.taskStatusDone;
  }

  if (status === "in_progress") {
    return styles.taskStatusInProgress;
  }

  if (status === supportStatus) {
    return styles.taskStatusSupport;
  }

  return styles.taskStatusTodo;
}
