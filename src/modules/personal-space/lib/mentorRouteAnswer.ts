import type { LearningTask } from "../../onboarding-agent/model/learningRouteTypes";
import { getTaskHref, getWorkspaceHref } from "./workspaceNavigation";

export type MentorRouteAction = {
  label: string;
  href: string;
};

export type MentorRouteMessage = {
  id: string;
  author: "guide";
  text: string;
  sourceLabel: string;
  action: MentorRouteAction;
};

export function isNextTaskPrompt(text: string): boolean {
  return text
    .trim()
    .toLowerCase()
    .replace(/[?？！!.,]+$/g, "") === "с чего начать сегодня";
}

export function buildNextTaskAnswer(
  nextTask: LearningTask | undefined,
  createId: () => string,
): MentorRouteMessage {
  if (!nextTask) {
    return {
      id: createId(),
      author: "guide",
      text: "На сегодня всё. Можно посмотреть следующие этапы маршрута.",
      sourceLabel: "Ваш персональный план",
      action: {
        label: "Открыть мой план",
        href: getWorkspaceHref("route"),
      },
    };
  }

  return {
    id: createId(),
    author: "guide",
    text: `Начните с задачи «${nextTask.title}». Она займёт примерно ${nextTask.estimatedMinutes} минут.`,
    sourceLabel: "Ваш персональный план",
    action: {
      label: "Открыть задачу",
      href: getTaskHref(nextTask.id),
    },
  };
}
