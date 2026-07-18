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

      <PersonalSpaceWorkspace
        profile={profile}
        route={route}
        onUpdateTaskStatus={onUpdateTaskStatus}
      />

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
    <section className="grid gap-3 rounded-2xl border border-border bg-card/60 p-3 sm:grid-cols-[1fr_auto] sm:items-center sm:px-4">
      <div>
        <p className="text-sm font-semibold tracking-tight text-foreground">
          Результат сохранён для руководителя
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          Статусы задач и план развития уже доступны в дашборде.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <a
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
          href="/manager"
        >
          Дашборд руководителя
        </a>
        {onReset && (
          <button
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45"
            onClick={onReset}
            type="button"
          >
            Новое тестирование
          </button>
        )}
      </div>
    </section>
  );
}
