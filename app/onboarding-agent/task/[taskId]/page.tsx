import { OnboardingAgentPage } from "@/modules/onboarding-agent";

export default async function TaskRoute({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  return <OnboardingAgentPage initialWorkspaceView="task" initialTaskId={taskId} />;
}
