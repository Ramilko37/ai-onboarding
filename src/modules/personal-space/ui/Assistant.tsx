"use client";

import { Compass, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  assistantOpening,
  assistantReplies,
  assistantSuggestions,
  defaultAssistantReply,
  type AssistantMessage,
} from "../data";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export function Assistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>(assistantOpening);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), author: "you", text: trimmed },
    ]);
    setInput("");
    setIsTyping(true);

    const reply = assistantReplies[trimmed] ?? defaultAssistantReply;
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), author: "guide", text: reply },
      ]);
      setIsTyping(false);
    }, 900);
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Compass className="h-4 w-4" aria-hidden="true" />
          <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-card bg-aurora-2" />
        </span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Маяк · ваш проводник
          </h2>
          <p className="text-xs text-muted-foreground">
            Спокойно подскажет следующий шаг
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex max-h-80 flex-col gap-3 overflow-y-auto px-5 py-5"
      >
        {messages.map((message) =>
          message.author === "guide" ? (
            <div key={message.id} className="flex items-end gap-2.5">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
                aria-hidden="true"
              >
                <Compass className="h-3.5 w-3.5 text-primary" />
              </span>
              <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-sm leading-relaxed text-secondary-foreground">
                {message.text}
              </p>
            </div>
          ) : (
            <p
              key={message.id}
              className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground"
            >
              {message.text}
            </p>
          ),
        )}

        {isTyping && (
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary"
              aria-hidden="true"
            >
              <Compass className="h-3.5 w-3.5 text-primary" />
            </span>
            <span className="flex gap-1 rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-border/60 px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {assistantSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => send(suggestion)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-primary"
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
          className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-1.5 pl-4 transition focus-within:border-primary/50"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Спросите что угодно — здесь спокойно"
            aria-label="Сообщение проводнику"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
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
