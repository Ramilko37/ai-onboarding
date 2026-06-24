import { MayakShell } from "@/shared/ui/mayak";
import { Assistant } from "./ui/Assistant";
import { HeroGreeting } from "./ui/HeroGreeting";
import { JourneyMap } from "./ui/JourneyMap";
import { KnowledgeConstellation } from "./ui/KnowledgeConstellation";
import { SupportPanel } from "./ui/SupportPanel";
import { TodayFocus } from "./ui/TodayFocus";
import { TopBar } from "./ui/TopBar";

function PersonalSpaceContent() {
  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_1fr_auto] gap-3">
      <HeroGreeting />

      <div className="grid min-h-0 gap-3 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="grid min-h-0 gap-3 lg:grid-rows-[0.88fr_1.12fr]">
          <JourneyMap />
          <KnowledgeConstellation />
        </div>
        <div className="grid min-h-0 gap-3 lg:grid-rows-[1fr_auto_auto]">
          <Assistant />
          <TodayFocus />
          <SupportPanel />
        </div>
      </div>

      <footer className="shrink-0 text-center text-[11px] text-muted-foreground">
        Маяк сопровождает спокойно: один экран, один следующий шаг.
      </footer>
    </div>
  );
}

export function PersonalSpace({ embedded = false }: { embedded?: boolean }) {
  if (embedded) {
    return <PersonalSpaceContent />;
  }

  return (
    <MayakShell topBar={<TopBar />}>
      <PersonalSpaceContent />
    </MayakShell>
  );
}
