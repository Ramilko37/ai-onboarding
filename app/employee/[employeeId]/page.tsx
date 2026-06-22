import { MvpOnboardingPage } from "@/modules/onboarding-agent/ui/MvpOnboardingPage";
import { demoEmployees } from "@/modules/onboarding-agent/model/mvpDemoData";

export function generateStaticParams() {
  return demoEmployees.map((employee) => ({
    employeeId: employee.id
  }));
}

export default async function EmployeeOnboardingPage({
  params
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const { employeeId } = await params;

  return <MvpOnboardingPage initialEmployeeId={employeeId} allowModeSwitch={false} />;
}
