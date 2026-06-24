import { answerMentorQuestion } from "../../../src/modules/knowledge-base";
import type { EmployeeRole } from "../../../src/modules/onboarding-agent/model/types";

type MentorChatRequest = {
  question?: unknown;
  role?: unknown;
  topicIds?: unknown;
  employeeName?: unknown;
  routeSummary?: unknown;
  activeTaskTitles?: unknown;
};

export async function POST(request: Request) {
  let body: MentorChatRequest;

  try {
    body = (await request.json()) as MentorChatRequest;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (typeof body.question !== "string" || body.question.trim().length === 0) {
    return json({ error: "question is required" }, 400);
  }

  if (!isEmployeeRole(body.role)) {
    return json({ error: "role must be cook or admin" }, 400);
  }

  const answer = answerMentorQuestion({
    question: body.question,
    role: body.role,
    topicIds: parseStringArray(body.topicIds),
    employeeName: typeof body.employeeName === "string" ? body.employeeName : undefined,
    routeSummary: typeof body.routeSummary === "string" ? body.routeSummary : undefined,
    activeTaskTitles: parseStringArray(body.activeTaskTitles)
  });

  return json(answer, 200);
}

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  });
}

function isEmployeeRole(value: unknown): value is EmployeeRole {
  return value === "cook" || value === "admin";
}

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : undefined;
}
