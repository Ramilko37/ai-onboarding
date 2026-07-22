import { OnboardingAgentPage } from "@/modules/onboarding-agent";
import { parseWorkspaceSegment } from "@/modules/personal-space/lib/workspaceRoute";

export default async function WorkspaceRoute({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await params;

  return <OnboardingAgentPage initialWorkspaceView={parseWorkspaceSegment(workspace)} />;
}
