import type {
  LearningRoute,
  LearningTask,
  LearningTaskStatus,
} from "../../onboarding-agent/model/learningRouteTypes";
import {
  knowledgeLinks,
  knowledgeNodes,
  type KnowledgeLink,
  type KnowledgeMastery,
  type KnowledgeNode,
} from "../data";

export type KnowledgeConstellationItem = KnowledgeNode & {
  title: string;
  statusLabel: string;
  task?: LearningTask;
  actionLabel: string;
};

const routePositions = [
  [18, 30],
  [40, 20],
  [62, 28],
  [80, 44],
  [65, 66],
  [43, 72],
  [22, 62],
  [14, 48],
] as const;

const masteryByStatus: Record<
  LearningTaskStatus,
  { mastery: KnowledgeMastery; label: string }
> = {
  done: { mastery: "strong", label: "Уверенно" },
  in_progress: { mastery: "learning", label: "В работе" },
  needs_mentor: { mastery: "learning", label: "В работе" },
  todo: { mastery: "new", label: "Впереди" },
};

const statusLabelByMastery: Record<KnowledgeMastery, string> = {
  strong: "Уверенно",
  learning: "В работе",
  new: "Впереди",
};

export function getKnowledgeConstellationItems(route?: LearningRoute): {
  items: KnowledgeConstellationItem[];
  links: KnowledgeLink[];
} {
  const tasksByTopic = getTasksByTopic(route);

  if (tasksByTopic.size === 0) {
    return {
      items: knowledgeNodes.map((node) => ({
        ...node,
        title: node.label,
        statusLabel: statusLabelByMastery[node.mastery],
        actionLabel: node.actionLabel ?? "Открыть материалы",
      })),
      links: knowledgeLinks,
    };
  }

  const items = [...tasksByTopic.entries()]
    .slice(0, routePositions.length)
    .map(([topicId, task], index) => {
      const [x, y] = routePositions[index] ?? [50, 50];
      const status = masteryByStatus[task.status];

      return {
        id: topicId,
        label: String(index + 1),
        title: task.title.includes(":") ? (task.title.split(":").pop()?.trim() ?? task.title) : task.title,
        description: task.description,
        actionLabel: "Открыть задачу",
        mastery: status.mastery,
        statusLabel: status.label,
        task,
        x,
        y,
        size: 54 - Math.min(index, 4) * 2,
      } satisfies KnowledgeConstellationItem;
    });

  return {
    items,
    links: items.slice(1).map((item, index) => [items[index]!.id, item.id]),
  };
}

export function getNextConstellationIndex(
  currentIndex: number,
  key: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown" | "Home" | "End",
  length: number,
) {
  if (length === 0 || key === "Home") return 0;
  if (key === "End") return length - 1;

  const direction = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
  return ((currentIndex + direction) % length + length) % length;
}

function getTasksByTopic(route?: LearningRoute) {
  const tasksByTopic = new Map<string, LearningTask>();

  for (const task of route?.days.flatMap((day) => day.tasks) ?? []) {
    if (task.topicId && !tasksByTopic.has(task.topicId)) {
      tasksByTopic.set(task.topicId, task);
    }
  }

  return tasksByTopic;
}
