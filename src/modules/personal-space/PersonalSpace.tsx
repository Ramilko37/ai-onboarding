import { MayakShell } from "@/shared/ui/mayak";
import type {
  LearningRoute,
  LearningTaskStatus
} from "../onboarding-agent/model/learningRouteTypes";
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
  onReset,
  onUpdateTaskStatus,
}: {
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
  onReset?: () => void;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
}) {
  return (
    <div className="grid w-full min-w-0 gap-3">
      <HeroGreeting profile={profile} route={route} />
      {route && <ManagerSavedBlock onReset={onReset} />}

      <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
        <div className="grid min-w-0 gap-3">
          <JourneyMap route={route} onUpdateTaskStatus={onUpdateTaskStatus} />
          <KnowledgeConstellation roleLabel={profile?.roleLabel} route={route} />
        </div>
        <div className="grid min-w-0 gap-3">
          <Assistant profile={profile} route={route} />
          <TodayFocus route={route} />
          <SupportPanel />
        </div>
      </div>

      <footer className="shrink-0 text-center text-[11px] text-muted-foreground">
        Valle Sanchez ведёт развитие спокойно: один экран, один следующий шаг.
      </footer>
    </div>
  );
}

export function PersonalSpace({
  embedded = false,
  profile,
  route,
  onReset,
  onUpdateTaskStatus,
}: {
  embedded?: boolean;
  profile?: PersonalSpaceProfile;
  route?: LearningRoute;
  onReset?: () => void;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
}) {
  if (embedded) {
    return (
      <PersonalSpaceContent
        profile={profile}
        route={route}
        onReset={onReset}
        onUpdateTaskStatus={onUpdateTaskStatus}
      />
    );
  }

  return (
    <MayakShell scrollable topBar={<TopBar />}>
      <PersonalSpaceContent
        profile={profile}
        route={route}
        onReset={onReset}
        onUpdateTaskStatus={onUpdateTaskStatus}
      />
    </MayakShell>
  );
}

function ManagerSavedBlock({ onReset }: { onReset?: () => void }) {
  return (
    <section className="grid gap-3 rounded-3xl border border-primary/25 bg-primary/5 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-sm font-semibold tracking-tight text-foreground">
          Результат сохранён для руководителя
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          В дашборде видны итоговый балл, критичные темы, статус задач и план развития.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <a
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          href="/manager"
        >
          Открыть дашборд руководителя
        </a>
        {onReset && (
          <button
            className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
            onClick={onReset}
            type="button"
          >
            Начать новое тестирование
          </button>
        )}
        <a
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"
          href="#route-plan"
        >
          Вернуться к результату
        </a>
      </div>
    </section>
  );
}
