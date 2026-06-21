import type { EmployeeRole } from "../model/types";

export function getRoleLabel(role: EmployeeRole) {
  return role === "cook" ? "Повар" : "Администратор кафе";
}
