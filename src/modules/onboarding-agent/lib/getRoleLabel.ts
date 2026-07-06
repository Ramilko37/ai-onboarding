import type { EmployeeRole } from "../model/types";

export function getRoleLabel(role: EmployeeRole) {
  const labels: Record<EmployeeRole, string> = {
    cook: "Повар",
    admin: "Администратор кафе",
    barista: "Бариста"
  };

  return labels[role];
}
