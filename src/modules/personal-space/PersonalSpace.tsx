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
    <>
      <HeroGreeting />

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <JourneyMap />
          <KnowledgeConstellation />
        </div>
        <div className="flex flex-col gap-5">
          <Assistant />
          <TodayFocus />
          <SupportPanel />
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-muted-foreground">
        Маяк сопровождает вас спокойно и без давления. Один понятный шаг за раз.
      </footer>
    </>
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
