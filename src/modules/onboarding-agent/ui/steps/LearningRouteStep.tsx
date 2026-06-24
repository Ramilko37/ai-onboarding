import { PersonalSpace } from "@/modules/personal-space";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
import type { EmployeeProfile } from "../../model/types";
import type {
  LearningRoute,
  LearningTaskStatus,
} from "../../model/learningRouteTypes";

export function LearningRouteStep({
  employee,
  route,
}: {
  employee: EmployeeProfile;
  route: LearningRoute;
  onBack: () => void;
  onReset: () => void;
  onUpdateTaskStatus: (taskId: string, status: LearningTaskStatus) => void;
}) {
  return (
    <PersonalSpace
      embedded
      profile={{
        name: employee.name,
        roleLabel: getRoleLabel(employee.role),
        gradeLabel: getGradeLabel(employee.grade),
        location: employee.location,
      }}
      route={route}
    />
  );
}
