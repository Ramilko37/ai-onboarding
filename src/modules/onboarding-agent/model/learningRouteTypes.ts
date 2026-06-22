export type LearningTaskStatus =
  | "todo"
  | "in_progress"
  | "done"
  | `${"block"}ed`;

export type LearningTaskType =
  | "intro"
  | "read"
  | "practice"
  | "quiz"
  | "check"
  | "summary";

export type LearningTaskPriority =
  | "required"
  | "recommended"
  | "optional";

export type LearningRouteDayId = "day_1" | "day_7" | "day_14";

export type LearningTask = {
  id: string;
  dayId: LearningRouteDayId;
  topicId?: string;
  title: string;
  description: string;
  type: LearningTaskType;
  priority: LearningTaskPriority;
  status: LearningTaskStatus;
  estimatedMinutes: number;
  source?: string;
  reason: string;
};

export type LearningRouteDay = {
  id: LearningRouteDayId;
  title: string;
  goal: string;
  focus: string;
  tasks: LearningTask[];
};

export type LearningRoute = {
  employeeId: string;
  role: "cook" | "admin";
  grade: "no_experience" | "horeca_experience" | "network_experience";
  generatedAt: string;
  totalScorePercent: number;
  summary: string;
  days: LearningRouteDay[];
};
