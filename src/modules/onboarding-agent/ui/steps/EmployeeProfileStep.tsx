"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Coffee, MapPin, Sparkles } from "lucide-react";
import {
  MayakField,
  MayakBadge,
  MayakIconBadge,
  MayakInput,
  MayakInsightCard,
  MayakPanel,
  MayakSectionHeader,
  MayakSectionTitle,
} from "@/shared/ui/mayak";
import { gradeOptions } from "../../model/mockData";
import type { EmployeeGrade, EmployeeRole } from "../../model/types";
import type { EmployeeProfileInput } from "../../model/useOnboardingAgentState";
import { GradeSelector, PrimaryButton } from "../components";

const today = new Date().toISOString().slice(0, 10);

export function EmployeeProfileStep({
  onSubmit,
}: {
  onSubmit: (input: EmployeeProfileInput) => void;
}) {
  const [name, setName] = useState("София Кузнецова");
  const role: EmployeeRole = "barista";
  const [grade, setGrade] = useState<EmployeeGrade>("horeca_experience");
  const [location, setLocation] = useState("Valle Sanchez · Арбат");
  const [startDate, setStartDate] = useState(today);

  const canSubmit = useMemo(
    () => name.trim().length > 1 && location.trim().length > 1 && Boolean(startDate),
    [location, name, startDate],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit({
      name: name.trim(),
      role,
      grade,
      location: location.trim(),
      startDate,
    });
  }

  return (
    <MayakPanel padding="lg" className="h-full min-h-0">
      <form className="grid h-full min-h-0 gap-4 lg:grid-cols-[0.85fr_1.35fr]" onSubmit={handleSubmit}>
        <div className="flex min-h-0 flex-col gap-4">
          <MayakSectionHeader
            className="mb-0"
            kicker="Шаг 1 · профиль"
            title="Профиль бариста"
            description="Минимум данных для входного тестирования: грейд, кофейня и дата выхода на смену."
          />

          <MayakInsightCard
            tone="primary"
            icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
            title="Зачем это Valle Sanchez"
            description="Грейд определяет глубину вопросов. Система покажет, какие кофейные стандарты уже уверенные, а где нужен маршрут развития."
          />

          <div className="grid gap-3">
            <MayakField label="Имя сотрудника">
              <MayakInput
                onChange={(event) => setName(event.target.value)}
                placeholder="Например, Мария Иванова"
                type="text"
                value={name}
              />
            </MayakField>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <MayakField label="Точка">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <MayakInput
                    className="pl-9"
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Valle Sanchez · кофейня"
                    type="text"
                    value={location}
                  />
                </div>
              </MayakField>

              <MayakField label="Дата выхода">
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <MayakInput
                    className="pl-9"
                    onChange={(event) => setStartDate(event.target.value)}
                    type="date"
                    value={startDate}
                  />
                </div>
              </MayakField>
            </div>
          </div>

          <ProfileSubmitBlock canSubmit={canSubmit} className="mt-auto hidden lg:block" />
        </div>

        <div className="grid min-h-0 gap-3 lg:grid-rows-[0.95fr_1fr]">
          <MayakPanel padding="sm" className="min-h-0 shadow-none">
            <MayakSectionTitle
              icon={
                <MayakIconBadge>
                  <Coffee className="h-4 w-4 text-primary" aria-hidden="true" />
                </MayakIconBadge>
              }
              title="Сценарий тестирования"
              description="Роль фиксирована для этой версии"
            />
            <div className="grid h-[calc(100%-2.75rem)] min-h-0 content-center gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <MayakBadge tone="primary">Роль тестирования</MayakBadge>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                    Бариста
                  </h3>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Coffee className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Проверяем эспрессо, молоко, рецептуры, оборудование и работу в потоке.
              </p>
              <ul className="grid gap-2 text-xs text-foreground/85 sm:grid-cols-2 lg:grid-cols-1">
                {["Эспрессо", "Молоко", "Чистка оборудования", "Гостевой поток"].map((item) => (
                  <li className="flex items-center gap-2" key={item}>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </MayakPanel>

          <MayakPanel padding="sm" className="min-h-0 shadow-none">
            <MayakSectionTitle
              title="Грейд"
              description="Чтобы не перегружать опытного сотрудника базой"
            />
            <GradeSelector onChange={setGrade} options={gradeOptions} value={grade} />
          </MayakPanel>
        </div>

        <ProfileSubmitBlock canSubmit={canSubmit} className="lg:hidden" />
      </form>
    </MayakPanel>
  );
}

function ProfileSubmitBlock({
  canSubmit,
  className = "",
}: {
  canSubmit: boolean;
  className?: string;
}) {
  return (
    <div className={`border-t border-border pt-4 ${className}`}>
      <PrimaryButton className="w-full" disabled={!canSubmit} type="submit">
        Сформировать профиль
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </PrimaryButton>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {canSubmit
          ? "Дальше система покажет карту бариста и темы диагностики."
          : "Заполните имя и точку, чтобы продолжить."}
      </p>
    </div>
  );
}
