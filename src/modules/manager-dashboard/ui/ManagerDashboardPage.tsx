"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Coffee,
  Filter,
  HelpCircle,
  ListChecks,
  RefreshCw,
  UserCheck,
  UsersRound
} from "lucide-react";
import {
  MayakBadge,
  MayakActionBar,
  MayakButton,
  MayakLinkButton,
  MayakPanel,
  MayakProgressBar,
  MayakSectionHeader,
  MayakShell,
  MayakTopBar,
  cn
} from "@/shared/ui/mayak";
import { getGradeLabel } from "../../onboarding-agent/lib/getGradeLabel";
import {
  demoManagerRecords,
  getAttentionSummary,
  getTopicAnalytics,
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
  high: "border-danger/35 bg-[color-mix(in_oklch,var(--danger)_8%,var(--card))]",
  medium: "border-warning/40 bg-[color-mix(in_oklch,var(--warning)_10%,var(--card))]",
  low: "border-success/30 bg-[color-mix(in_oklch,var(--success)_7%,var(--card))]"
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
  const attention = getAttentionSummary(records);
  const topicAnalytics = getTopicAnalytics(records);
  const liveCount = records.filter((record) => !record.id.startsWith("demo-")).length;

  return (
    <MayakShell
      scrollable
      contentClassName="grid gap-3 pb-6"
      topBar={<MayakTopBar
        brand="Valle Sanchez"
        subtitle="дашборд руководителя"
        icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
        meta={
          <>
            <UsersRound className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {records.length} бариста
          </>
        }
        userName="Руководитель"
      />}
    >
        <MayakPanel padding="lg" className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <MayakSectionHeader
            className="mb-0"
            kicker={
              <>
                <Coffee className="h-3 w-3 text-primary" aria-hidden="true" />
                прошедшие тестирование
              </>
            }
            title="Дашборд входного тестирования"
            description="Руководитель видит готовность бариста, критичные темы и следующие управленческие действия на День 1, День 7 и День 14."
          />

          <MayakActionBar className="mt-0 justify-start lg:justify-end">
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
          </MayakActionBar>
        </MayakPanel>

        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard label="Бариста" value={records.length} caption="пример + прохождения в этом браузере" />
          <MetricCard label="Средний балл" value={`${stats.average}%`} caption="по диагностике" />
          <MetricCard label="Высокий риск" value={stats.highRisk} caption="нужен наставник" />
          <MetricCard label="Готовы" value={stats.ready} caption="обычный контроль" />
        </section>

        <section className="grid gap-3 lg:grid-cols-[1fr_0.9fr]">
          <TodayAttentionPanel attention={attention} />
          <TopicAnalyticsPanel items={topicAnalytics} liveCount={liveCount} />
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
                      "min-h-11 cursor-pointer rounded-xl border px-3 py-1.5 text-sm font-medium transition",
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

            {filteredRecords.length === 0 ? (
              <EmptyState text="В этом фильтре нет бариста. Попробуйте другой риск." />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border">
                <div className="hidden grid-cols-[1.25fr_1fr_0.8fr_0.55fr_0.72fr_1fr_0.9fr] gap-3 border-b border-border bg-secondary/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:grid">
                  <span>Бариста</span>
                  <span>Точка</span>
                  <span>Грейд</span>
                  <span>Балл</span>
                  <span>Риск</span>
                  <span>Следующее действие</span>
                  <span>Статус руководителя</span>
                </div>
                <div className="grid gap-2 bg-card p-2 lg:gap-0 lg:p-0">
                  {filteredRecords.map((record) => (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => setSelectedId(record.id)}
                      className={cn(
                        "grid cursor-pointer gap-3 rounded-2xl border p-3 text-left transition lg:grid-cols-[1.25fr_1fr_0.8fr_0.55fr_0.72fr_1fr_0.9fr] lg:items-center lg:rounded-none lg:border-x-0 lg:border-t-0",
                        riskTone[record.riskLevel],
                        selectedRecord?.id === record.id && "ring-2 ring-primary/35 lg:ring-inset"
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {record.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground lg:hidden">
                          {record.location} · {getGradeLabel(record.grade)}
                        </span>
                      </span>
                      <TableCell>{record.location}</TableCell>
                      <TableCell>{getGradeLabel(record.grade)}</TableCell>
                      <span className="font-mono text-lg font-semibold text-foreground">
                        {record.totalScorePercent}%
                      </span>
                      <RiskBadge riskLevel={record.riskLevel} />
                      <TableCell>{record.nextAction}</TableCell>
                      <PlanStatusBadge status={record.routeStatus} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </MayakPanel>

          {selectedRecord && <ManagerDetailPanel record={selectedRecord} />}
        </div>
    </MayakShell>
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

function TodayAttentionPanel({
  attention
}: {
  attention: ReturnType<typeof getAttentionSummary>;
}) {
  return (
    <MayakPanel padding="sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--warning)_16%,transparent)] text-warning">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Сегодня требует внимания
          </h2>
          <p className="text-xs text-muted-foreground">Короткий список для старта смены</p>
        </div>
      </div>
      <ul className="grid gap-2 text-sm text-foreground">
        <AttentionItem value={attention.highRiskCount} label="бариста с высоким риском" />
        <AttentionItem value={attention.milkCriticalCount} label="критичные темы по молоку" />
        <AttentionItem value={attention.day7RetestCount} label="повторные проверки на День 7" />
      </ul>
    </MayakPanel>
  );
}

function TopicAnalyticsPanel({
  items,
  liveCount
}: {
  items: ReturnType<typeof getTopicAnalytics>;
  liveCount: number;
}) {
  return (
    <MayakPanel padding="sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
          <BarChart3 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Частые зоны развития
          </h2>
          <p className="text-xs text-muted-foreground">
            {liveCount > 0
              ? "По примерам и прохождениям в этом браузере"
              : "Пока нет новых прохождений в этом браузере. Ниже показаны примерные сотрудники для показа."}
          </p>
        </div>
      </div>
      {items.length > 0 ? (
        <ol className="grid gap-2">
          {items.map((item) => (
            <li
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-xs"
              key={item.title}
            >
              <span className="font-medium text-foreground">{item.title}</span>
              <span className="font-mono text-sm font-semibold text-primary">
                {item.count}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState text="Зоны развития появятся после первых прохождений." />
      )}
    </MayakPanel>
  );
}

function AttentionItem({ value, label }: { value: number; label: string }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-lg font-semibold text-foreground">{value}</span>
    </li>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-dashed border-border bg-secondary/35 p-3 text-xs leading-relaxed text-muted-foreground">
      <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      {text}
    </div>
  );
}

function TableCell({ children }: { children: ReactNode }) {
  return (
    <span className="hidden min-w-0 truncate text-xs text-foreground/85 lg:block">
      {children}
    </span>
  );
}

function ManagerDetailPanel({ record }: { record: ManagerDashboardRecord }) {
  const [fixedAction, setFixedAction] = useState<string | null>(null);

  useEffect(() => {
    setFixedAction(null);
  }, [record.id]);

  const actions = getManagerActions(record.riskLevel);

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

      <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/5 p-3">
        <div className="mb-3 flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-foreground">Следующее действие</h3>
        </div>
        <div className="grid gap-2">
          {actions.map((action) => (
            <button
              className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2 text-left text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
              key={action}
              onClick={() => setFixedAction(action)}
              type="button"
            >
              {action}
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </button>
          ))}
        </div>
        {fixedAction && (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-xs text-secondary-foreground">
            Действие зафиксировано в демо: {fixedAction}.
          </p>
        )}
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
      <TopicList
        title="Нужна помощь наставника"
        items={record.blockedTaskTitles}
        empty="Блокеров по задачам нет"
      />

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

      <div className="mt-4 rounded-2xl border border-border bg-card p-3">
        <div className="mb-3 flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-foreground">Рабочий сценарий</h3>
        </div>
        <div className="grid gap-2 text-xs text-muted-foreground">
          <FactLine label="Наставник" value={record.mentorName} />
          <FactLine label="Проверить руками" value={record.manualCheck} />
          <FactLine label="Повторный тест" value={formatDate(record.retestDate)} />
          <FactLine label="Статус плана" value={getRouteStatusLabel(record.routeStatus)} />
        </div>
        <div className="mt-3 grid gap-2">
          {record.routeHighlights.map((highlight) => {
            const [day, ...rest] = highlight.split(":");
            return (
              <div
                className="grid grid-cols-[72px_1fr] gap-2 rounded-xl bg-secondary/45 px-3 py-2 text-xs"
                key={`timeline-${highlight}`}
              >
                <span className="font-semibold text-primary">{day}</span>
                <span className="text-foreground">{rest.join(":").trim()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </MayakPanel>
  );
}

function FactLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-xl bg-secondary/35 px-3 py-2">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
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
        riskLevel === "high" && "bg-[color-mix(in_oklch,var(--danger)_14%,transparent)] text-danger",
        riskLevel === "medium" && "bg-[color-mix(in_oklch,var(--warning)_16%,transparent)] text-warning",
        riskLevel === "low" && "bg-[color-mix(in_oklch,var(--success)_14%,transparent)] text-success"
      )}
    >
      {label[riskLevel]}
    </span>
  );
}

function PlanStatusBadge({ status }: { status: ManagerDashboardRecord["routeStatus"] }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold",
        status === "has_blockers" && "bg-[color-mix(in_oklch,var(--danger)_14%,transparent)] text-danger",
        status === "in_progress" && "bg-[color-mix(in_oklch,var(--info)_14%,transparent)] text-info",
        status === "completed" && "bg-[color-mix(in_oklch,var(--success)_14%,transparent)] text-success",
        status === "not_started" && "bg-secondary text-secondary-foreground"
      )}
    >
      {getRouteStatusLabel(status)}
    </span>
  );
}

function getRouteStatusLabel(status: ManagerDashboardRecord["routeStatus"]) {
  const labels: Record<ManagerDashboardRecord["routeStatus"], string> = {
    not_started: "не начат",
    in_progress: "в работе",
    has_blockers: "есть блокеры",
    completed: "завершён"
  };

  return labels[status];
}

function getManagerActions(riskLevel: ManagerRiskLevel) {
  const actions: Record<ManagerRiskLevel, string[]> = {
    high: ["Назначить наставника", "Поставить повторную проверку на День 7", "Открыть план развития"],
    medium: ["Допустить с точечным контролем", "Запланировать проверку темы", "Открыть план развития"],
    low: ["Подтвердить готовность", "Оставить обычный контроль", "Открыть план развития"]
  };

  return actions[riskLevel];
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}
