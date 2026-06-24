"use client";

import { Compass, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MentorSource } from "../../knowledge-base";
import type { LearningRoute } from "../../onboarding-agent/model/learningRouteTypes";
import { assistantSuggestions } from "../data";
import type { PersonalSpaceProfile } from "../PersonalSpace";

type AssistantMessage = {
  id: string;
  author: "guide" | "you";
  text: string;
  sources?: MentorSource[];
};

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export function Assistant({
  profile,
  route,
}: {
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
}) {
  const [messages, setMessages] = useState<AssistantMessage[]>(() =>
    createOpeningMessages(profile?.name),
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
    setIsTyping(true);

    try {
      const response = await fetch("/api/mentor-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          role: route?.role ?? "cook",
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
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-primary/30 bg-card/80 shadow-[var(--shadow-card)] backdrop-blur-sm ring-1 ring-primary/15">
      <div className="flex shrink-0 items-center gap-3 border-b border-primary/15 bg-primary/8 px-4 py-3">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Compass className="h-4 w-4" aria-hidden="true" />
          <span className="animate-pulse-ring absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-card bg-aurora-2" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold tracking-tight text-foreground">
              Маяк · AI-проводник
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              на связи
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            Уже собрал подсказки по вашему маршруту
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-3">
        {messages.map((message) =>
          message.author === "guide" ? (
            <div key={message.id} className="flex items-end gap-2">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
                aria-hidden="true"
              >
                <Compass className="h-3.5 w-3.5 text-primary" />
              </span>
              <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-secondary px-3 py-2 text-xs leading-relaxed text-secondary-foreground">
                <p className="whitespace-pre-line">{message.text}</p>
                {message.sources && message.sources.length > 0 && (
                  <ul className="mt-2 grid gap-1 border-t border-border/70 pt-2 text-[11px] text-muted-foreground">
                    {message.sources.slice(0, 2).map((source) => (
                      <li key={`${message.id}-${source.documentId}-${source.sectionTitle}`}>
                        {source.title} · {source.sectionTitle}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <p
              key={message.id}
              className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-xs leading-relaxed text-primary-foreground"
            >
              {message.text}
            </p>
          ),
        )}

        {isTyping && (
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-secondary" aria-hidden="true">
              <Compass className="h-3.5 w-3.5 text-primary" />
            </span>
            <span className="flex gap-1 rounded-2xl rounded-bl-md bg-secondary px-3 py-2.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
            </span>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border/60 px-4 py-3">
        <div className="mb-2 flex gap-1.5 overflow-x-auto pb-0.5">
          {assistantSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => send(suggestion)}
              className="min-w-fit rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
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
          className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-1 pl-3 transition focus-within:border-primary/50"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Спросите Маяк"
            aria-label="Сообщение проводнику"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Отправить"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
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
      text: `Привет, ${name}. Я Маяк — ваш проводник на старте. Я отвечаю только по демо-базе знаний и показываю источники, чтобы не выдумывать правила точки.`,
    },
    {
      id: "m2",
      author: "guide",
      text:
        "Можно спросить про хранение, маркировку, техкарты, кассу, возвраты или претензии. Если источника нет, я честно отправлю вопрос к наставнику.",
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
