"use client";

import { ArrowRight } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { gradeOptions, roleOptions } from "../../model/mockData";
import type { EmployeeGrade, EmployeeRole } from "../../model/types";
import type { EmployeeProfileInput } from "../../model/useOnboardingAgentState";
import { GradeSelector, PrimaryButton, RoleCard } from "../components";
import styles from "../OnboardingAgentPage.module.css";

const today = new Date().toISOString().slice(0, 10);

export function EmployeeProfileStep({
  onSubmit
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
    [location, name, startDate]
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
      startDate
    });
  }

  return (
    <section className={styles.stepPanel}>
      <div className={styles.sectionHeader}>
        <p className={styles.kicker}>Шаг 1</p>
        <h1>Соберём профиль адаптации</h1>
        <p>
          Выберите роль и стартовый уровень сотрудника. На следующем шаге агент
          покажет, какие компетенции важно пройти в первые две недели.
        </p>
      </div>

      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Имя сотрудника</span>
          <input
            onChange={(event) => setName(event.target.value)}
            placeholder="Например, Мария Иванова"
            type="text"
            value={name}
          />
        </label>

        <label className={styles.field}>
          <span>Точка</span>
          <input
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Например, Франчайзи №12"
            type="text"
            value={location}
          />
        </label>

        <label className={styles.field}>
          <span>Дата выхода</span>
          <input
            onChange={(event) => setStartDate(event.target.value)}
            type="date"
            value={startDate}
          />
        </label>

        <div className={styles.fullWidth}>
          <span className={styles.fieldLabel}>Роль</span>
          <div className={styles.roleGrid}>
            {roleOptions.map((option) => (
              <RoleCard
                description={option.description}
                key={option.value}
                onSelect={setRole}
                selected={option.value === role}
                title={option.label}
                value={option.value}
              />
            ))}
          </div>
        </div>

        <div className={styles.fullWidth}>
          <span className={styles.fieldLabel}>Грейд</span>
          <GradeSelector
            onChange={setGrade}
            options={gradeOptions}
            value={grade}
          />
        </div>

        <div className={styles.actions}>
          <PrimaryButton
            disabled={!canSubmit}
            icon={<ArrowRight aria-hidden="true" />}
            type="submit"
          >
            Сформировать профиль адаптации
          </PrimaryButton>
        </div>
      </form>
    </section>
  );
}
