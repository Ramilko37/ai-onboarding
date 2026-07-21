"use client";

import { AlertCircle, BarChart3, CheckCircle2, Coffee, RefreshCw, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MayakActionBar, MayakButton, MayakPanel, MayakProgressBar, MayakSectionHeader, MayakShell, MayakTopBar } from "@/shared/ui/mayak";
import { getGradeLabel } from "../../onboarding-agent/lib/getGradeLabel";
import { demoManagerRecords, mergeManagerRecords, readLiveManagerRecords, type ManagerDashboardRecord } from "../model/managerDashboardData";

export function ManagerDashboardPage() {
  const [records, setRecords] = useState<ManagerDashboardRecord[]>(() => mergeManagerRecords([]));
  const [selectedId, setSelectedId] = useState(demoManagerRecords[0]?.id ?? "");

  const refresh = () => {
    const next = mergeManagerRecords(readLiveManagerRecords());
    setRecords(next);
    setSelectedId((current) => next.some((record) => record.id === current) ? current : next[0]?.id ?? "");
  };

  useEffect(refresh, []);
  const selected = records.find((record) => record.id === selectedId) ?? records[0];
  const stats = useMemo(() => ({
    completed: records.filter((record) => record.routeStatus === "completed").length,
    inProgress: records.filter((record) => record.routeStatus === "in_progress").length,
    blocked: records.filter((record) => record.taskStatusSummary.blocked > 0 || record.openEscalations.length > 0).length,
  }), [records]);

  return (
    <MayakShell scrollable contentClassName="grid gap-4 pb-8" topBar={<MayakTopBar brand="Valle Sanchez" subtitle="команда · demo" icon={<BarChart3 className="h-5 w-5" />} meta={<><UsersRound className="h-3.5 w-3.5 text-primary" />{records.length} сотрудников</>} userName="Руководитель" />}>
      <MayakPanel padding="lg" className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <MayakSectionHeader className="mb-0" kicker={<><Coffee className="h-3 w-3 text-primary" />Команда</>} title="Прогресс адаптации" description="Здесь видны только учебные задачи, блокеры и вопросы, которые стоит взять в работу человеку." />
        <MayakActionBar className="mt-0"><MayakButton variant="secondary" onClick={refresh}><RefreshCw className="h-4 w-4" />Обновить</MayakButton></MayakActionBar>
      </MayakPanel>

      <section className="grid gap-3 sm:grid-cols-3">
        <Metric label="Сотрудников" value={records.length} />
        <Metric label="В маршруте" value={stats.inProgress} />
        <Metric label="Нужна помощь" value={stats.blocked} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <MayakPanel padding="md">
          <h2 className="text-base font-semibold text-foreground">Команда</h2>
          <div className="mt-3 grid gap-2">
            {records.map((record) => {
              const total = Object.values(record.taskStatusSummary).reduce((sum, value) => sum + value, 0);
              const percent = total === 0 ? 0 : Math.round((record.taskStatusSummary.done / total) * 100);
              return <button className={`grid w-full cursor-pointer gap-2 rounded-2xl border p-3 text-left transition hover:border-primary/45 ${selected?.id === record.id ? "border-primary/50 bg-primary/5" : "border-border bg-card"}`} key={record.id} onClick={() => setSelectedId(record.id)} type="button">
                <div className="flex items-start justify-between gap-3"><span><b className="block text-sm text-foreground">{record.name}</b><span className="text-xs text-muted-foreground">{record.location} · {getGradeLabel(record.grade)}</span></span><Status status={record.routeStatus} /></div>
                <div className="flex items-center gap-3"><MayakProgressBar className="flex-1" value={percent} /><span className="font-mono text-xs text-muted-foreground">{percent}%</span></div>
                {record.blockedTaskTitles.length > 0 && <span className="text-xs text-primary"><AlertCircle className="mr-1 inline h-3.5 w-3.5" />{record.blockedTaskTitles.length} задача требует помощи</span>}
              </button>;
            })}
          </div>
        </MayakPanel>

        {selected && <EmployeeDetail record={selected} />}
      </section>
    </MayakShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <MayakPanel padding="sm"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 font-mono text-3xl font-semibold text-foreground">{value}</p></MayakPanel>;
}

function Status({ status }: { status: ManagerDashboardRecord["routeStatus"] }) {
  const labels = { not_started: "Не начат", in_progress: "В маршруте", has_blockers: "Нужна помощь", completed: "Завершён" };
  return <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">{labels[status]}</span>;
}

function EmployeeDetail({ record }: { record: ManagerDashboardRecord }) {
  return <MayakPanel padding="md" className="lg:sticky lg:top-20"><h2 className="text-lg font-semibold text-foreground">{record.name}</h2><p className="mt-1 text-xs text-muted-foreground">{record.location}</p><div className="mt-4 rounded-2xl bg-secondary/55 p-3"><p className="text-xs font-semibold text-foreground">Текущий этап</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{record.nextAction}</p></div><TopicList title="На этом сфокусирован маршрут" items={record.weakTopicTitles} empty="Только обязательные темы маршрута" /><TopicList title="Блокеры" items={record.blockedTaskTitles} empty="Открытых блокеров нет" /><TopicList title="Открытые вопросы наставнику" items={record.openEscalations} empty="Открытых вопросов нет" /><div className="mt-4 rounded-2xl border border-border p-3"><p className="flex items-center gap-2 text-sm font-semibold text-foreground"><CheckCircle2 className="h-4 w-4 text-primary" />Как помочь</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Свяжитесь с сотрудником, если задача заблокирована или нужен разбор темы. Решение о допуске к работе всегда остаётся за человеком.</p></div></MayakPanel>;
}

function TopicList({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return <section className="mt-4"><h3 className="text-sm font-semibold text-foreground">{title}</h3><div className="mt-2 flex flex-wrap gap-1.5">{(items.length ? items : [empty]).map((item) => <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground" key={item}>{item}</span>)}</div></section>;
}
