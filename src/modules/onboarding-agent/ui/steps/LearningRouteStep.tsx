import { PersonalSpace } from "@/modules/personal-space";
import type { EmployeeProfile } from "../../model/types";
import type {
  LearningRoute,
  LearningTaskStatus,
} from "../../model/learningRouteTypes";

export function LearningRouteStep(_props: {
  employee: EmployeeProfile;
  route: LearningRoute;
  onBack: () => void;
  onReset: () => void;
  onUpdateTaskStatus: (taskId: string, status: LearningTaskStatus) => void;
}) {
  return <PersonalSpace />;
}
