export type WelcomeDiagnosticAction = {
  label: string;
  mode: "start" | "continue";
};

export function getWelcomeDiagnosticAction(params: {
  currentQuestionIndex: number;
  hasDiagnosticResult: boolean;
  questionsCount: number;
}): WelcomeDiagnosticAction {
  const hasActiveProgress = params.questionsCount > 0 && !params.hasDiagnosticResult;

  if (!hasActiveProgress) {
    return {
      label: "Начать — около 4 минут",
      mode: "start",
    };
  }

  const nextQuestionNumber = Math.min(
    Math.max(params.currentQuestionIndex + 1, 1),
    params.questionsCount,
  );

  return {
    label: `Продолжить с вопроса ${nextQuestionNumber} из ${params.questionsCount}`,
    mode: "continue",
  };
}
