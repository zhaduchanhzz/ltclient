export type ExamDetailRequest = {
  examId: string;
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
