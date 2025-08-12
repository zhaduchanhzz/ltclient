export interface UserResponse {
  questionId: number;
  questionText: string;
  content: string;
  score: number | null;
  submittedAt: string;
  userId: number;
  userName?: string;
  termId: number;
  examId: number;
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
}

export interface UserResponsesPage {
  content: UserResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export interface UserResponsesParams {
  page?: number;
  size?: number;
  userId?: number;
  questionId?: number;
  termId?: number;
}

export interface GradeRequest {
  responseId: number;
  score: number;
  feedback?: string;
}

export interface GradeResponse {
  id: number;
  responseId: number;
  score: number;
  feedback: string;
  gradedAt: string;
  gradedBy: string;
}

export interface DashboardStats {
  graded: number;
  inGrading: number;
  ungraded: number;
  totalResponses: number;
}