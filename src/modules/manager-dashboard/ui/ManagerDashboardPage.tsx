"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Coffee,
  Filter,
  ListChecks,
  RefreshCw,
  UsersRound
} from "lucide-react";
import {
  MayakBadge,
  MayakButton,
  MayakLinkButton,
  MayakPanel,
  MayakProgressBar,
  MayakSectionHeader,
  MayakTopBar,
  cn
} from "@/shared/ui/mayak";
import { getGradeLabel } from "../../onboarding-agent/lib/getGradeLabel";
import {
  demoManagerRecords,
  mergeManagerRecords,
  readLiveManagerRecords,
  type ManagerDashboardRecord,
  type ManagerRiskLevel
} from "../model/managerDashboardData";

type RiskFilter = "all" | ManagerRiskLevel;

const riskOrder: Record<ManagerRiskLevel, number> = {
  high: 0,
  medium: 1,
  low: 2
};

const riskLabels: Record<RiskFilter, string> = {
  all: "Все",
  high: "Высокий риск",
  medium: "Средний",
  low: "Низкий"
};

const riskTone: Record<ManagerRiskLevel, string> = {
  high: "border-[color-mix(in_oklch,oklch(0.55_0.17_32)_45%,var(--border))] bg-[color-mix(in_oklch,oklch(0.72_0.15_40)_18%,var(--card))]",
  medium: "border-accent bg-accent/25",
  low: "border-primary/25 bg-primary/5"
};

export function ManagerDashboardPage() {
  const [records, setRecords] = useState<ManagerDashboardRecord[]>(() =>
    mergeManagerRecords([])
  );
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [selectedId, setSelectedId] = useState(demoManagerRecords[0]?.id ?? "");

  useEffect(() => {
    const nextRecords = mergeManagerRecords(readLiveManagerRecords());
    setRecords(nextRecords);
    setSelectedId((current) =>
      nextRecords.some((record) => record.id === current)
        ? current
        : nextRecords[0]?.id ?? ""
    );
  }, []);

  const filteredRecords = useMemo(() => {
    const filtered =
      riskFilter === "all"
        ? records
        : records.filter((record) => record.riskLevel === riskFilter);

    return [...filtered].sort(
      (first, second) =>
        riskOrder[first.riskLevel] - riskOrder[second.riskLevel] ||
        second.totalScorePercent - first.totalScorePercent
    );
  }, [records, riskFilter]);
  const selectedRecord =
    records.find((record) => record.id === selectedId) ?? filteredRecords[0] ?? records[0];
  const stats = getStats(records);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground">
      <MayakTopBar
        brand="Valle Sanchez"
        subtitle="manager dashboard"
        icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
        meta={
          <>
            <UsersRound className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {records.length} бариста
          </>
        }
        userName="Руководитель"
      />

      <main className="mx-auto grid max-w-7xl gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <MayakPanel padding="lg" className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <MayakSectionHeader
            className="mb-0"
            kicker={
              <>
                <Coffee className="h-3 w-3 text-primary" aria-hidden="true" />
                barista cohort
              </>
            }
            title="Дашборд входного тестирования"
            description="Руководитель видит бариста, которые прошли диагностику, ключевые риски и персональные планы развития на 1, 7 и 14 дней."
          />

          <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
            <MayakLinkButton href="/onboarding-agent" variant="secondary">
              Новое тестирование
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </MayakLinkButton>
            <MayakButton
              variant="ghost"
              onClick={() => setRecords(mergeManagerRecords(readLiveManagerRecords()))}
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Обновить
            </MayakButton>
          </div>
        </MayakPanel>

        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard label="Бариста" value={records.length} caption="demo + live" />
          <MetricCard label="Средний балл" value={`${stats.average}%`} caption="по диагностике" />
          <MetricCard label="Высокий риск" value={stats.highRisk} caption="нужен наставник" />
          <MetricCard label="Готовы" value={stats.ready} caption="обычный контроль" />
        </section>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)] lg:items-start">
          <MayakPanel padding="md" className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Бариста после тестирования
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {filteredRecords.length} записей в текущем фильтре
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(["all", "high", "medium", "low"] as RiskFilter[]).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setRiskFilter(filter)}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      riskFilter === filter
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {riskLabels[filter]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              {filteredRecords.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => setSelectedId(record.id)}
                  className={cn(
                    "grid cursor-pointer gap-3 rounded-2xl border p-3 text-left transition md:grid-cols-[1.1fr_0.7fr_0.7fr_auto] md:items-center",
                    riskTone[record.riskLevel],
                    selectedRecord?.id === record.id && "ring-2 ring-primary/35"
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {record.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {record.location} · {getGradeLabel(record.grade)}
                    </span>
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                      Готовность
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-foreground">
                      {record.readinessLabel}
                    </span>
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                      Риск
                    </span>
                    <RiskBadge riskLevel={record.riskLevel} />
                  </span>
                  <span className="flex items-center gap-2 md:justify-end">
                    <span className="font-mono text-lg font-semibold text-foreground">
                      {record.totalScorePercent}%
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          </MayakPanel>

          {selectedRecord && <ManagerDetailPanel record={selectedRecord} />}
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  label,
  value,
  caption
}: {
  label: string;
  value: string | number;
  caption: string;
}) {
  return (
    <MayakPanel padding="sm" className="min-h-28">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
    </MayakPanel>
  );
}

function ManagerDetailPanel({ record }: { record: ManagerDashboardRecord }) {
  return (
    <MayakPanel padding="md" className="min-w-0 lg:sticky lg:top-20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <MayakBadge tone="primary">выбранный бариста</MayakBadge>
          <h2 className="mt-2 truncate text-xl font-semibold tracking-tight text-foreground">
            {record.name}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {record.location} · тест завершён {formatDateTime(record.completedAt)}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl bg-secondary px-3 py-2 text-center">
          <p className="font-mono text-2xl font-semibold text-secondary-foreground">
            {record.totalScorePercent}%
          </p>
          <p className="text-[10px] text-muted-foreground">итог</p>
        </div>
      </div>

      <div className="mt-4">
        <MayakProgressBar value={record.totalScorePercent} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <RiskBadge riskLevel={record.riskLevel} />
          <span className="text-xs font-medium text-foreground">{record.readinessLabel}</span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-3">
        <div className="mb-2 flex items-center gap-2">
          {record.riskLevel === "high" ? (
            <AlertTriangle className="h-4 w-4 text-primary" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
          )}
          <h3 className="text-sm font-semibold text-foreground">Рекомендация</h3>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {record.managerRecommendation}
        </p>
      </div>

      <TopicList title="Критичные темы" items={record.criticalTopicTitles} empty="Критичных тем нет" />
      <TopicList title="Зоны развития" items={record.weakTopicTitles} empty="Только контрольные повторы" />

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-foreground">План развития</h3>
        </div>
        <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{record.routeSummary}</p>
        <ol className="grid gap-2">
          {record.routeHighlights.map((highlight) => (
            <li
              key={highlight}
              className="rounded-2xl border border-border bg-secondary/40 px-3 py-2 text-xs leading-relaxed text-foreground"
            >
              {highlight}
            </li>
          ))}
        </ol>
      </div>
    </MayakPanel>
  );
}

function TopicList({
  title,
  items,
  empty
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(items.length > 0 ? items : [empty]).map((item) => (
          <span
            key={item}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function RiskBadge({ riskLevel }: { riskLevel: ManagerRiskLevel }) {
  const label: Record<ManagerRiskLevel, string> = {
    high: "Высокий",
    medium: "Средний",
    low: "Низкий"
  };

  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold",
        riskLevel === "high" && "bg-primary text-primary-foreground",
        riskLevel === "medium" && "bg-accent text-accent-foreground",
        riskLevel === "low" && "bg-secondary text-secondary-foreground"
      )}
    >
      {label[riskLevel]}
    </span>
  );
}

function getStats(records: ManagerDashboardRecord[]) {
  const average =
    records.length === 0
      ? 0
      : Math.round(
          records.reduce((sum, record) => sum + record.totalScorePercent, 0) /
            records.length
        );

  return {
    average,
    highRisk: records.filter((record) => record.riskLevel === "high").length,
    ready: records.filter((record) => record.riskLevel === "low").length
  };
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
