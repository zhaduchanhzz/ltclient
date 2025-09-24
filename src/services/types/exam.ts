type Response = {
  questionId: number;
  questionText: string;
  content: string;
  score: number | null;
};

type ExamList = {
  examId: number;
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  title: string;
  responses: Response[];
  examScore: number | null;
};

export type ExamDetailRequest = {
  examId: string;
};

export type CreateExamRequest = {
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  title: string;
  description: string;
  isNeedVip: boolean;
  questions: CreateExamQuestion[];
  audioFile?: string; // Present only for LISTENING exams
};

export type UpdateExamRequest = {
  id: number;
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  title: string;
  description: string;
  isNeedVip: boolean;
  questions: CreateExamQuestion[];
  audioFile?: string; // Present only for LISTENING exams
};

export type CreateExamQuestion = {
  questionText: string;
  answers?: CreateExamAnswer[]; // Optional - not used for SPEAKING
};

export type CreateExamAnswer = {
  answerText: string;
  isCorrect: boolean;
};

export type ExamResponse = {
  id: number;
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  title: string;
  description: string;
  isNeedVip: boolean;
  audioFile?: string; // Present only for LISTENING exams
  questions: ExamQuestionResponse[];
};

export type ExamQuestionResponse = {
  id: number;
  questionText: string;
  answers?: ExamAnswerResponse[]; // Optional - not used for SPEAKING
};

export type ExamAnswerResponse = {
  id: number;
  answerText: string;
  isCorrect: boolean;
};

export type Exam = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ExamFilterParams = {
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserWriting = {
  id: string;
  examType: string;
  title: string;
  description: string;
};

export type UserHistory = {
  termId: number;
  createdAt: string;
  exams: ExamList[];
  totalScore: number | null;
};

export type UserHistoryResponse = {
  terms: UserHistory[];
};

// Term-specific history detail now matches API: array of summary items per term
export type TermHistoryDetailItem = {
  id: number;
  listeningScore: number;
  readingScore: number;
  speakingScore: number;
  writingScore: number;
  createdAt: string; // e.g., "2025-09-21"
};

export type TermHistoryDetail = TermHistoryDetailItem[];

export type TakeExamRequest = {
  termId: string;
  userId: string;
  createdAt: string;
  exams: {
    id: string;
    examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
    title: string;
    description: string;
    isNeedVip: boolean;
    questions: {
      id: string;
      questionText: string;
      answers: {
        id: string;
        answerText: string;
        isCorrect: boolean;
      }[];
    }[];
  }[];
};

export type TakeExamResponse = {
  termId: string;
};

export type ExamStatusResponse = {
  isActive: boolean;
  isExpired: boolean;
  timeRemaining?: number;
};

export type ExamSection = {
  id: string;
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  title: string;
  description: string;
  isNeedVip: string;
  questions: {
    id: string;
    questionText: string;
    answers: {
      id: string;
      anwserText?: string;
      isCorrect?: boolean;
    }[];
  }[];
};

export type ExamsDetail = {
  id: string;
  examType: string;
  description: string;
  isNeedVip: string;
  title: string;
  questions: {
    id: string;
    questionText: string;
    answers: {
      id: string;
      anwserText: string;
      isCorrect: boolean;
    }[];
  }[];
};

export type SimulationExam = {
  id: number;
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  title: string;
  description: string;
  isNeedVip: boolean;
  audioFile?: string;
  questions: SimulationQuestion[];
};

export type SimulationQuestion = {
  id: number;
  questionText: string;
  answers: SimulationAnswer[];
};

export type SimulationAnswer = {
  id: number;
  answerText: string;
  isCorrect: boolean;
};

export type SimulationSession = {
  exams: SimulationExam[];
  currentExamIndex: number;
  currentQuestionIndex: number;
  answers: Record<number, number[]>; // questionId -> selectedAnswerIds
  startTime: number;
  timeLimit: number; // in minutes
  isCompleted: boolean;
};

export type ExamSubmitRequest = {
  examId: number;
  responses: Record<string, string>;
  termId: number;
  speakingFile?: string;
};

export type ExamSubmitResponse = {
  examId: number;
  examType: string;
  title: string;
  userResponses: {
    questionId: number;
    questionText: string;
    content: string;
    score: number;
  }[];
};

export type ExamTermSession = {
  termId: number;
  examId: number;
  exams: SimulationExam[];
  currentExamType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  currentExamIndex: number; // within the current exam type
  currentQuestionIndex: number;
  answers: Record<number, string[]>; // questionId -> answers
  startTime: number;
  timeLimit: number;
  isCompleted: boolean;
};

export type GradingRequestDto = {
  termId: number;
  examId: number;
};

export type GradingResponseDto = {
  requestId: number;
  termId: number;
  examId: number;
  userId: number;
  status: string;
  requestedAt: string;
};

// Pending grading request list item and page payload for /grading-request/pending
export type PendingGradingRequestItem = {
  requestId: number;
  termId: number;
  examId: number;
  userId: number;
  userName: string;
  status: string;
  requestedAt: string;
};

export type PendingGradingPageData = {
  content: PendingGradingRequestItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page index
};

export type PracticeExam = {
  id: number;
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  title: string;
  description: string;
  isNeedVip: boolean | null;
  questions: null;
};

export type ExamByType = {
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  exams: PracticeExam[];
};

export type ListExamByTypeResponse = ExamByType[];

// Bulk (unified) exam submission types
export type BulkExamSubmitRequest = {
  termId: number;
  exams: {
    examId: number;
    responses: Record<string, string>;
  }[];
};

export type BulkExamSubmitResultItem = {
  id: number;
  userId: number;
  examId: number;
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  content: string;
  score: number;
  selectedTrue: number;
  totalQuestion: number;
};

export type BulkExamSubmitResponseData = {
  termId: number;
  results: BulkExamSubmitResultItem[];
};
