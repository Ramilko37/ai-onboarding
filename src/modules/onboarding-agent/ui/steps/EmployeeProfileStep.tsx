"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Sparkles, UserRound } from "lucide-react";
import {
  MayakField,
  MayakIconBadge,
  MayakInput,
  MayakInsightCard,
  MayakPanel,
  MayakSectionHeader,
  MayakSectionTitle,
} from "@/shared/ui/mayak";
import { gradeOptions, roleOptions } from "../../model/mockData";
import type { EmployeeGrade, EmployeeRole } from "../../model/types";
import type { EmployeeProfileInput } from "../../model/useOnboardingAgentState";
import { GradeSelector, PrimaryButton, RoleCard } from "../components";

const today = new Date().toISOString().slice(0, 10);

const roleRouteFocus: Record<EmployeeRole, string> = {
  cook: "гигиена, техкарты, заготовки, качество",
  admin: "заказы, гости, касса, претензии",
};

export function EmployeeProfileStep({
  onSubmit,
}: {
  onSubmit: (input: EmployeeProfileInput) => void;
}) {
  const [name, setName] = useState("Мария Иванова");
  const [role, setRole] = useState<EmployeeRole>("admin");
  const [grade, setGrade] = useState<EmployeeGrade>("horeca_experience");
  const [location, setLocation] = useState("Франчайзи №12");
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
            title="Соберём профиль адаптации"
            description="Минимум данных, чтобы Маяк собрал релевантную карту: роль, грейд, точка и дата выхода."
          />

          <MayakInsightCard
            tone="primary"
            icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
            title="Зачем это Маяку"
            description="Роль определяет карту и вопросы, грейд — глубину тем. Так маршрут становится персональным, а не общим для всех."
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
                    placeholder="Франчайзи №12"
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

          <div className="mt-auto border-t border-border pt-4">
            <PrimaryButton className="w-full" disabled={!canSubmit} type="submit">
              Сформировать профиль
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </PrimaryButton>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {canSubmit
                ? "Дальше Маяк покажет карту роли и темы для диагностики."
                : "Заполните имя и точку, чтобы продолжить."}
            </p>
          </div>
        </div>

        <div className="grid min-h-0 gap-3 lg:grid-rows-[0.95fr_1fr]">
          <MayakPanel padding="sm" className="min-h-0 shadow-none">
            <MayakSectionTitle
              icon={
                <MayakIconBadge>
                  <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
                </MayakIconBadge>
              }
              title="Роль"
              description="От роли зависит карта и вопросы"
            />
            <div className="grid h-[calc(100%-2.75rem)] min-h-0 gap-2 md:grid-cols-2">
              {roleOptions.map((option) => (
                <RoleCard
                  description={option.description}
                  meta={`В маршруте: ${roleRouteFocus[option.value]}`}
                  key={option.value}
                  onSelect={setRole}
                  selected={option.value === role}
                  title={option.label}
                  value={option.value}
                />
              ))}
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
      </form>
    </MayakPanel>
  );
}
