import { PersonalSpace } from "@/modules/personal-space";
import { getGradeLabel } from "../../lib/getGradeLabel";
import { getRoleLabel } from "../../lib/getRoleLabel";
import type { EmployeeProfile } from "../../model/types";
import type {
  LearningRoute,
  LearningTaskStatus,
} from "../../model/learningRouteTypes";
import type { WorkspaceRouteView } from "@/modules/personal-space/lib/workspaceRoute";

export function LearningRouteStep({
  employee,
  route,
  onUpdateTaskStatus,
  onCreateEscalation,
  initialView,
  initialTaskId,
}: {
  employee: EmployeeProfile;
  route: LearningRoute;
  onBack: () => void;
  onUpdateTaskStatus: (taskId: string, status: LearningTaskStatus) => void;
  onCreateEscalation: (question: string) => void;
  initialView?: WorkspaceRouteView;
  initialTaskId?: string;
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
      onUpdateTaskStatus={onUpdateTaskStatus}
      onCreateEscalation={onCreateEscalation}
      initialView={initialView}
      initialTaskId={initialTaskId}
    />
  );
}
