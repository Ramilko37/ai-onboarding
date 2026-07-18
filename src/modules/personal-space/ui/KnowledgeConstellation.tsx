"use client";

import { ArrowRight, Check, CircleDot, Clock3, Sparkles, Stars } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { LearningRoute } from "../../onboarding-agent/model/learningRouteTypes";
import type { KnowledgeMastery } from "../data";
import {
  getKnowledgeConstellationItems,
  getNextConstellationIndex,
} from "../lib/getKnowledgeConstellationItems";

const legend: Array<{ mastery: KnowledgeMastery; label: string }> = [
  { mastery: "strong", label: "Уверенно" },
  { mastery: "learning", label: "В работе" },
  { mastery: "new", label: "Впереди" },
];

const navigationKeys = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

function Dot({ mastery }: { mastery: KnowledgeMastery }) {
  const color =
    mastery === "strong"
      ? "bg-emerald-300"
      : mastery === "learning"
        ? "bg-amber-300"
        : "bg-slate-300";
  return <span className={`h-2.5 w-2.5 rounded-full ring-1 ring-white/60 ${color}`} />;
}

function nodeStyle(mastery: KnowledgeMastery, isSelected: boolean) {
  const base =
    "absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 text-sm font-bold shadow-lg transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80 motion-reduce:transition-none";
  const state =
    mastery === "strong"
      ? "border-emerald-100 bg-emerald-500 text-slate-950"
      : mastery === "learning"
        ? "border-amber-100 bg-amber-400 text-slate-950"
        : "border-slate-100 bg-slate-700 text-white";

  return `${base} ${state} ${isSelected ? "z-20 scale-125 ring-4 ring-white/35" : "z-10 hover:scale-110"}`;
}

function NodeSymbol({ mastery, label }: { mastery: KnowledgeMastery; label: string }) {
  if (mastery === "strong") {
    return <Check className="h-5 w-5" aria-hidden="true" />;
  }

  if (mastery === "learning") {
    return <CircleDot className="h-5 w-5" aria-hidden="true" />;
  }

  return <span aria-hidden="true">{label}</span>;
}

export function KnowledgeConstellation({
  roleLabel,
  route,
  onOpenTask,
}: {
  roleLabel?: string;
  route?: LearningRoute;
  onOpenTask?: (taskId: string) => void;
}) {
  const { items, links } = useMemo(() => getKnowledgeConstellationItems(route), [route]);
  const defaultSelectedIndex = Math.max(
    0,
    items.findIndex((item) => item.mastery === "learning"),
  );
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setSelectedIndex(defaultSelectedIndex);
  }, [defaultSelectedIndex, route]);

  const selectedItem = items[selectedIndex] ?? items[0];
  const nodeById = new Map(items.map((item) => [item.id, item]));

  function selectNode(index: number, focus = false) {
    setSelectedIndex(index);
    if (focus) {
      requestAnimationFrame(() => nodeRefs.current[index]?.focus());
    }
  }

  function handleNodeKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (navigationKeys.has(event.key)) {
      event.preventDefault();
      selectNode(
        getNextConstellationIndex(
          index,
          event.key as "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown" | "Home" | "End",
          items.length,
        ),
        true,
      );
    }
  }

  return (
    <section className="flex w-full min-w-0 flex-col rounded-3xl border border-border bg-card/80 p-4 backdrop-blur-sm">
      <div className="mb-3 flex shrink-0 flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Stars className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Созвездие знаний</h2>
            <p className="text-xs text-muted-foreground">
              Карта навыков {roleLabel?.toLowerCase() ?? "бариста"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Статусы навыков">
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

      <div
        className="relative min-h-[260px] overflow-hidden rounded-2xl border border-primary/25 bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.22)_0_1px,transparent_1.5px),radial-gradient(circle_at_78%_19%,rgba(255,255,255,0.25)_0_1px,transparent_1.5px),radial-gradient(circle_at_72%_79%,rgba(255,255,255,0.18)_0_1px,transparent_1.5px),linear-gradient(145deg,#311c2d_0%,#6e2537_54%,#9f4a42_130%)] sm:min-h-[300px]"
        aria-label="Интерактивная карта навыков"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {links.map(([from, to]) => {
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
                stroke="rgba(255, 248, 224, 0.58)"
                strokeWidth="0.55"
              />
            );
          })}
        </svg>

        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              aria-label={`${item.title}. ${item.statusLabel}`}
              aria-pressed={isSelected}
              className={nodeStyle(item.mastery, isSelected)}
              key={item.id}
              onClick={() => selectNode(index)}
              onKeyDown={(event) => handleNodeKeyDown(event, index)}
              ref={(node) => {
                nodeRefs.current[index] = node;
              }}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              type="button"
            >
              <NodeSymbol mastery={item.mastery} label={item.label} />
            </button>
          );
        })}

        <p className="absolute right-4 bottom-3 left-4 text-center text-[11px] font-medium text-white/80">
          Выберите точку, чтобы увидеть следующий шаг
        </p>
      </div>

      {selectedItem && (
        <section
          aria-live="polite"
          aria-labelledby="selected-topic-title"
          className="mt-3 rounded-2xl border border-primary/20 bg-secondary/40 p-3 sm:p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {selectedItem.statusLabel}
            </p>
            {selectedItem.task && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                {selectedItem.task.estimatedMinutes} мин
              </span>
            )}
          </div>
          <h3 id="selected-topic-title" className="mt-1 text-base font-semibold text-foreground">
            {selectedItem.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {selectedItem.description ?? "Материалы появятся после персонального маршрута."}
          </p>
          {selectedItem.task ? (
            <button
              className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45 motion-reduce:transition-none"
              onClick={() => onOpenTask?.(selectedItem.task!.id)}
              type="button"
            >
              {selectedItem.actionLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              Материалы появятся после персонального маршрута.
            </p>
          )}
        </section>
      )}
    </section>
  );
}
