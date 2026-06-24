import { Stars } from "lucide-react";
import {
  knowledgeLinks,
  knowledgeNodes,
  type KnowledgeMastery,
  type KnowledgeNode,
} from "../data";

const nodeById = new Map(knowledgeNodes.map((node) => [node.id, node]));

const masteryStyle: Record<KnowledgeMastery, string> = {
  strong: "bg-primary text-primary-foreground border-transparent shadow-sm",
  learning: "bg-accent text-accent-foreground border-transparent",
  new: "bg-card text-muted-foreground border-border",
};

const legend: Array<{ mastery: KnowledgeMastery; label: string }> = [
  { mastery: "strong", label: "Уверенно" },
  { mastery: "learning", label: "В работе" },
  { mastery: "new", label: "Впереди" },
];

function Dot({ mastery }: { mastery: KnowledgeMastery }) {
  const color =
    mastery === "strong"
      ? "bg-primary"
      : mastery === "learning"
        ? "bg-accent"
        : "bg-muted-foreground/40";
  return <span className={`h-2.5 w-2.5 rounded-full ${color}`} />;
}

export function KnowledgeConstellation() {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-border bg-card/80 p-4 backdrop-blur-sm">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Stars className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Созвездие знаний</h2>
            <p className="text-xs text-muted-foreground">Карта навыков повара</p>
          </div>
        </div>
        <div className="hidden gap-3 sm:flex">
          {legend.map((item) => (
            <span
              key={item.mastery}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Dot mastery={item.mastery} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-secondary/40 to-card">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {knowledgeLinks.map(([from, to]) => {
            const a = nodeById.get(from);
            const b = nodeById.get(to);
            if (!a || !b) return null;
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="color-mix(in oklch, var(--primary) 22%, transparent)"
                strokeWidth="0.4"
              />
            );
          })}
        </svg>

        {knowledgeNodes.map((node: KnowledgeNode, index) => (
          <div
            key={node.id}
            className="animate-float absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-center text-[10px] font-medium leading-tight"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: Math.max(34, node.size - 8),
              height: Math.max(34, node.size - 8),
              animationDelay: `${index * 0.6}s`,
            }}
          >
            <span
              className={`flex h-full w-full items-center justify-center rounded-full border px-1 ${masteryStyle[node.mastery]}`}
            >
              {node.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 line-clamp-2 shrink-0 text-xs leading-relaxed text-muted-foreground">
        После диагностики Маяк подсветит сильные стороны и мягко покажет, что стоит освоить дальше.
      </p>
    </section>
  );
}
