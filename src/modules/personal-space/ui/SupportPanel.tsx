import { BookOpen, LifeBuoy, MessageCircle } from "lucide-react";
import { newcomer } from "../data";

const quickLinks = [
  { id: "kb", label: "База знаний", caption: "Стандарты и техкарты", icon: BookOpen },
  { id: "chat", label: "Чат смены", caption: "Спросить команду", icon: MessageCircle },
];

export function SupportPanel() {
  return (
    <section className="rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-sm sm:p-7">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <LifeBuoy className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Вы не одни
          </h2>
          <p className="text-xs text-muted-foreground">Помощь всегда рядом</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-4">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground"
          aria-hidden="true"
        >
          {newcomer.mentor.initials}
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {newcomer.mentor.name}
          </p>
          <p className="text-xs text-muted-foreground">{newcomer.mentor.role}</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
        >
          Написать
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {quickLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
          >
            <link.icon
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
            <span className="block">
              <span className="block text-sm font-medium text-foreground">
                {link.label}
              </span>
              <span className="block text-xs text-muted-foreground">
                {link.caption}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
