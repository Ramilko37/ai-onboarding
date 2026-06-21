export type EmployeeRole = "cook" | "admin";

export type EmployeeGrade =
  | "no_experience"
  | "horeca_experience"
  | "network_experience";

export type Importance = "high" | "medium" | "low";

export type Skippable = boolean | "partial";

export type QuestionDifficulty = "basic" | "intermediate" | "advanced";

export type QuestionType = "single_choice";

export type TopicStatus =
  | "strong"
  | "good"
  | "medium_gap"
  | "critical_gap";

export type TopicRecommendation =
  | "skip_detailed_module"
  | "short_summary"
  | "short_module"
  | "full_module"
  | "full_module_with_mentor";

export type EmployeeProfile = {
  id: string;
  name: string;
  role: EmployeeRole;
  grade: EmployeeGrade;
  location: string;
  startDate: string;
};

export type CompetencyTopic = {
  id: string;
  title: string;
  role: EmployeeRole;
  importance: Importance;
  skippable: Skippable;
  required: boolean;
  description?: string;
};

export type CompetencyMilestone = {
  day: 1 | 7 | 14;
  role: EmployeeRole;
  goal: string;
  competencies: string[];
};

export type DiagnosticQuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type DiagnosticQuestion = {
  id: string;
  role: EmployeeRole;
  topicId: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  question: string;
  options: DiagnosticQuestionOption[];
  explanation: string;
  source?: string;
  weight: number;
};

export type DiagnosticAnswer = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  topicId: string;
  weight: number;
};

export type TopicScore = {
  topicId: string;
  topicTitle: string;
  role: EmployeeRole;
  scorePercent: number;
  correctAnswers: number;
  totalQuestions: number;
  totalWeight: number;
  earnedWeight: number;
  importance: Importance;
  required: boolean;
  skippable: Skippable;
  status: TopicStatus;
  recommendation: TopicRecommendation;
};

export type DiagnosticResult = {
  employeeId: string;
  role: EmployeeRole;
  grade: EmployeeGrade;
  totalScorePercent: number;
  topicScores: TopicScore[];
  strongTopics: TopicScore[];
  weakTopics: TopicScore[];
  criticalTopics: TopicScore[];
  requiredTopics: TopicScore[];
  completedAt: string;
};

export type LearningModuleFormat =
  | "summary"
  | "short_module"
  | "full_module"
  | "practice"
  | "mentor_task"
  | "check";

export type LearningPriority = "high" | "medium" | "low";

export type LearningModule = {
  id: string;
  role: EmployeeRole;
  topicId: string;
  title: string;
  format: LearningModuleFormat;
  durationMinutes: number;
  description: string;
  content: string;
  task?: string;
  required: boolean;
};

export type LearningPathSource = {
  documentId: string;
  title: string;
  sourceType?: string;
};

export type LearningPathModule = {
  id: string;
  moduleId: string;
  topicId: string;
  title: string;
  format: LearningModuleFormat;
  durationMinutes: number;
  priority: LearningPriority;
  required: boolean;
  reason: string;
  sources: LearningPathSource[];
};

export type LearningPathCheckpoint = {
  title: string;
  description: string;
};

export type LearningPathDayNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14;

export type LearningPathDay = {
  day: LearningPathDayNumber;
  title: string;
  focus: string;
  modules: LearningPathModule[];
  checkpoint?: LearningPathCheckpoint;
};

export type LearningPathTopicSummary = {
  topicId: string;
  title: string;
  scorePercent: number;
  reason: string;
};

export type ManagerRecommendation = {
  id: string;
  employeeId: string;
  topicId: string;
  title: string;
  text: string;
  priority: LearningPriority;
  suggestedDay: 1 | 7 | 14;
  sources: LearningPathSource[];
};

export type LearningPath = {
  id: string;
  employeeId: string;
  role: EmployeeRole;
  grade: EmployeeGrade;
  basedOnDiagnosticResultId?: string;
  summary: string;
  totalStandardMinutes: number;
  totalPersonalizedMinutes: number;
  savedMinutes: number;
  savedPercent: number;
  shortenedTopics: LearningPathTopicSummary[];
  strengthenedTopics: LearningPathTopicSummary[];
  criticalTopics: LearningPathTopicSummary[];
  days: LearningPathDay[];
  managerRecommendations: ManagerRecommendation[];
  createdAt: string;
};

export type OnboardingStep =
  | "welcome"
  | "employee_profile"
  | "competency_map"
  | "diagnostic_intro"
  | "diagnostic"
  | "diagnostic_result"
  | "learning_path";

export type OnboardingState = {
  employee: EmployeeProfile | null;
  selectedRole: EmployeeRole | null;
  selectedGrade: EmployeeGrade | null;
  currentStep: OnboardingStep;
  diagnosticQuestions: DiagnosticQuestion[];
  diagnosticAnswers: DiagnosticAnswer[];
  diagnosticResult: DiagnosticResult | null;
  learningPath: LearningPath | null;
  currentQuestionIndex: number;
};
