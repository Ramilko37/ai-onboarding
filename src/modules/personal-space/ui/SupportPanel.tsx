import { BookOpen, LifeBuoy, MessageCircle } from "lucide-react";
import { newcomer } from "../data";

const quickLinks = [
  { id: "kb", label: "База знаний", caption: "Стандарты", icon: BookOpen },
  { id: "chat", label: "Чат смены", caption: "Команда", icon: MessageCircle },
];

export function SupportPanel() {
  return (
    <section className="w-full min-w-0 rounded-3xl border border-border bg-card/80 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <LifeBuoy className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Вы не одни</h2>
          <p className="text-xs text-muted-foreground">Наставник и быстрые ссылки</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          aria-hidden="true"
        >
          {newcomer.mentor.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{newcomer.mentor.name}</p>
          <p className="truncate text-xs text-muted-foreground">{newcomer.mentor.role}</p>
        </div>
        <button
          type="button"
          className="cursor-pointer rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
        >
          Написать
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {quickLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            className="group flex cursor-pointer items-center gap-2 rounded-2xl border border-border bg-card p-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
          >
            <link.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium text-foreground">{link.label}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{link.caption}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
