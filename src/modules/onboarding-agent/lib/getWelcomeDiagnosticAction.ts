export type WelcomeDiagnosticAction = {
  hint: string;
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
      hint: "8 вопросов · примерно 4 минуты",
      label: "Начать диагностику",
      mode: "start",
    };
  }

  const nextQuestionNumber = Math.min(
    Math.max(params.currentQuestionIndex + 1, 1),
    params.questionsCount,
  );

  return {
    hint: `вопрос ${nextQuestionNumber} из ${params.questionsCount}`,
    label: "Продолжить диагностику",
    mode: "continue",
  };
}
