import { MayakShell } from "@/shared/ui/mayak";
import type { LearningRoute } from "../onboarding-agent/model/learningRouteTypes";
import { Assistant } from "./ui/Assistant";
import { HeroGreeting } from "./ui/HeroGreeting";
import { JourneyMap } from "./ui/JourneyMap";
import { KnowledgeConstellation } from "./ui/KnowledgeConstellation";
import { SupportPanel } from "./ui/SupportPanel";
import { TodayFocus } from "./ui/TodayFocus";
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
}: {
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
}) {
  return (
    <div className="grid w-full min-w-0 gap-3">
      <HeroGreeting profile={profile} route={route} />

      <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
        <div className="grid min-w-0 gap-3">
          <JourneyMap route={route} />
          <KnowledgeConstellation roleLabel={profile?.roleLabel} route={route} />
        </div>
        <div className="grid min-w-0 gap-3">
          <Assistant profile={profile} route={route} />
          <TodayFocus route={route} />
          <SupportPanel />
        </div>
      </div>

      <footer className="shrink-0 text-center text-[11px] text-muted-foreground">
        Маяк сопровождает спокойно: один экран, один следующий шаг.
      </footer>
    </div>
  );
}

export function PersonalSpace({
  embedded = false,
  profile,
  route,
}: {
  embedded?: boolean;
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
}) {
  if (embedded) {
    return <PersonalSpaceContent profile={profile} route={route} />;
  }

  return (
    <MayakShell scrollable topBar={<TopBar />}>
      <PersonalSpaceContent profile={profile} route={route} />
    </MayakShell>
  );
}
