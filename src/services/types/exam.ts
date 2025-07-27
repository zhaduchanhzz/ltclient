type Response = {
  questionId: number;
  questionText: string;
  content: string;
  score: number;
};

type ExamList = {
  examId: string;
  examType: string;
  title: string;
  responses: Response[];
  examScore: number;
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
};

export type CreateExamQuestion = {
  questionText: string;
  audioFile?: string; // Base64 audio for LISTENING exams
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
  questions: ExamQuestionResponse[];
};

export type ExamQuestionResponse = {
  id: number;
  questionText: string;
  audioFile?: string; // Base64 audio for LISTENING exams
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
  termId: string;
  createdAt: string;
  exams: ExamList[];
  examType: string;
  title: string;
  description: string;
};

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
