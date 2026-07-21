"use client";

import { BookOpen, Compass, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MentorSource } from "../../knowledge-base";
import type { LearningRoute } from "../../onboarding-agent/model/learningRouteTypes";
import { getNextTask } from "../../onboarding-agent/model/onboardingSelectors";
import { assistantSuggestions } from "../data";
import { buildNextTaskAnswer, isNextTaskPrompt, type MentorRouteAction } from "../lib/mentorRouteAnswer";
import type { PersonalSpaceProfile } from "../PersonalSpace";

type AssistantMessage = {
  id: string;
  author: "guide" | "you";
  text: string;
  sources?: MentorSource[];
  sourceLabel?: string;
  action?: MentorRouteAction;
};

type AssistantRequestStatus = "idle" | "loading" | "answered" | "needs_human" | "error";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export function Assistant({
  profile,
  route,
  onCreateEscalation,
}: {
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
  onCreateEscalation?: (question: string) => void;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<AssistantMessage[]>(() =>
    createOpeningMessages(profile?.name),
  );
  const [input, setInput] = useState("");
  const [requestStatus, setRequestStatus] = useState<AssistantRequestStatus>("idle");
  const [lastQuestion, setLastQuestion] = useState("");
  const isTyping = requestStatus === "loading";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { id: nextId(), author: "you", text: trimmed }]);
    setInput("");
    setLastQuestion(trimmed);

    if (isNextTaskPrompt(trimmed)) {
      const answer = buildNextTaskAnswer(getNextTask(route), nextId);
      setMessages((prev) => [...prev, answer]);
      setRequestStatus("answered");
      return;
    }

    setRequestStatus("loading");

    try {
      const response = await fetch("/api/mentor-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          role: route?.role ?? "barista",
          topicIds: getRouteTopicIds(route),
          employeeName: profile?.name,
          routeSummary: route?.summary,
          activeTaskTitles: getActiveTaskTitles(route),
        }),
      });
      const payload = (await response.json()) as {
        answer?: string;
        sources?: MentorSource[];
        error?: string;
      };

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          author: "guide",
          text:
            response.ok && payload.answer
              ? payload.answer
              : payload.error ?? "Не удалось получить ответ из базы знаний.",
          sources: payload.sources,
        },
      ]);
      setRequestStatus(response.ok && payload.answer && (payload.sources?.length ?? 0) > 0 ? "answered" : "needs_human");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          author: "guide",
          text:
            "Сейчас не удалось обратиться к базе знаний. Не буду выдумывать ответ: лучше уточнить у наставника или управляющего.",
        },
      ]);
      setRequestStatus("error");
    } finally {
      // Every completion branch above leaves an explicit request state for the UI.
    }
  }

  return (
    <section className="mx-auto flex min-h-[640px] w-full max-w-[860px] min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-card/90 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-8 lg:min-h-[724px] lg:p-10">
      <header className="flex shrink-0 items-center gap-3 border-b border-border pb-5">
        <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Compass className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
            Всегда на связи
          </p>
          <h1 className="mt-1 font-brand text-3xl leading-tight tracking-tight text-foreground">
            AI-наставник
          </h1>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/12 px-3 py-1.5 text-[10px] font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          В сети
        </span>
      </header>

      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto py-5">
        <div className="self-center font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          Сегодня
        </div>
        {messages.map((message) =>
          message.author === "guide" ? (
            <div key={message.id} className="flex items-end gap-2">
              <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-secondary px-4 py-3 text-xs leading-relaxed text-secondary-foreground sm:max-w-[72%]">
                <p className="whitespace-pre-line">{message.text}</p>
                {message.sources && message.sources.length > 0 && (
                  <ul className="mt-3 grid gap-1 text-[10px] text-primary">
                    {message.sources.slice(0, 2).map((source) => (
                      <li
                        className="flex items-center gap-1.5 rounded-lg bg-card px-2 py-1.5"
                        key={`${message.id}-${source.documentId}-${source.sectionTitle}`}
                      >
                        <BookOpen className="h-3 w-3 shrink-0" aria-hidden="true" />
                        {source.title} · {source.sectionTitle}
                      </li>
                    ))}
                  </ul>
                )}
                {message.sourceLabel && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-card px-2 py-1.5 text-[10px] text-primary">
                    <BookOpen className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {message.sourceLabel}
                  </div>
                )}
                {message.action && (
                  <button
                    className="mt-3 inline-flex min-h-9 cursor-pointer items-center justify-center rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
                    onClick={() => router.push(message.action!.href)}
                    type="button"
                  >
                    {message.action.label}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p
              key={message.id}
              className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-xs leading-relaxed text-primary-foreground sm:max-w-[72%]"
            >
              {message.text}
            </p>
          ),
        )}

        {isTyping && (
          <div className="flex items-center gap-2">
            <span className="flex gap-1 rounded-2xl rounded-bl-md bg-secondary px-3 py-2.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
            </span>
          </div>
        )}
        {requestStatus === "needs_human" && (
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-3 text-xs text-foreground">
            Я не нашёл точного ответа в доступной базе знаний. Могу передать вопрос наставнику.
            <button className="ml-2 font-semibold text-primary" onClick={() => { onCreateEscalation?.(lastQuestion); setRequestStatus("idle"); }} type="button">Передать наставнику</button>
          </div>
        )}
        {requestStatus === "error" && (
          <button className="w-fit rounded-full border border-border px-3 py-2 text-xs font-semibold text-primary" onClick={() => send(lastQuestion)} type="button">Не удалось получить ответ. Попробовать ещё раз</button>
        )}
      </div>

      <div className="shrink-0 border-t border-border pt-3">
        <div className="mb-2 flex gap-1.5 overflow-x-auto pb-0.5">
          {assistantSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => send(suggestion)}
              className="min-h-9 min-w-fit cursor-pointer rounded-full border border-border bg-card px-3 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
          className="flex min-h-[55px] items-center gap-2 rounded-2xl border border-border bg-card py-1.5 pr-1.5 pl-4 transition focus-within:border-primary/50"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Задайте вопрос о работе…"
            aria-label="Сообщение AI-наставнику"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Отправить сообщение"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}

function createOpeningMessages(employeeName?: string): AssistantMessage[] {
  const name = employeeName?.split(" ")[0] ?? "Алина";

  return [
    {
      id: "m1",
      author: "guide",
      text: `${name}, задайте вопрос о работе — отвечу по базе знаний или помогу открыть следующий шаг.`,
    },
  ];
}

function getRouteTopicIds(route?: LearningRoute) {
  if (!route) {
    return undefined;
  }

  const topicIds = [
    ...new Set(
      route.days
        .flatMap((day) => day.tasks)
        .map((task) => task.topicId)
        .filter((topicId): topicId is string => Boolean(topicId)),
    ),
  ];

  return topicIds.length > 0 ? topicIds : undefined;
}

function getActiveTaskTitles(route?: LearningRoute) {
  if (!route) {
    return undefined;
  }

  const titles = route.days
    .flatMap((day) => day.tasks)
    .filter((task) => task.status !== "done")
    .slice(0, 5)
    .map((task) => task.title);

  return titles.length > 0 ? titles : undefined;
}
