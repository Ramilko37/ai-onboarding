import { MayakShell } from "@/shared/ui/mayak";
import type {
  LearningRoute,
  LearningTaskStatus
} from "../onboarding-agent/model/learningRouteTypes";
import { HeroGreeting } from "./ui/HeroGreeting";
import { PersonalSpaceWorkspace } from "./ui/PersonalSpaceWorkspace";
import { TopBar } from "./ui/TopBar";

export type PersonalSpaceProfile = {
  name: string;
  roleLabel: string;
  gradeLabel?: string;
  location: string;
};

function PersonalSpaceContent({
  profile,
  route,
  onUpdateTaskStatus,
  onCreateEscalation,
}: {
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
  onCreateEscalation?: (question: string) => void;
}) {
  return (
    <div className="grid w-full min-w-0 gap-3">
      {!route && <HeroGreeting profile={profile} route={route} />}
      <PersonalSpaceWorkspace
        profile={profile}
        route={route}
        onUpdateTaskStatus={onUpdateTaskStatus}
        onCreateEscalation={onCreateEscalation}
      />
    </div>
  );
}

export function PersonalSpace({
  embedded = false,
  profile,
  route,
  onUpdateTaskStatus,
  onCreateEscalation,
}: {
  embedded?: boolean;
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
  onCreateEscalation?: (question: string) => void;
}) {
  if (embedded) {
    return (
      <PersonalSpaceContent
        profile={profile}
        route={route}
        onUpdateTaskStatus={onUpdateTaskStatus}
        onCreateEscalation={onCreateEscalation}
      />
    );
  }

  return (
    <MayakShell scrollable topBar={<TopBar />}>
      <PersonalSpaceContent
        profile={profile}
        route={route}
        onUpdateTaskStatus={onUpdateTaskStatus}
        onCreateEscalation={onCreateEscalation}
      />
    </MayakShell>
  );
}
