import type { EmployeeGrade } from "../model/types";

const gradeLabels: Record<EmployeeGrade, string> = {
  no_experience: "Без опыта",
  horeca_experience: "Есть опыт в HORECA",
  network_experience: "Опытный сотрудник сети"
};

export function getGradeLabel(grade: EmployeeGrade) {
  return gradeLabels[grade];
}
