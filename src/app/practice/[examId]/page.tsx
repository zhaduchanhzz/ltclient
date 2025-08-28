import PracticeExam from "@/components/features/practice/PracticeExam";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Exam",
  description: "Practice exam page",
};

type PracticeExamPageProps = {
  params: Promise<{
    examId: string;
  }>;
};

const PracticeExamPage = async ({ params }: PracticeExamPageProps) => {
  const { examId } = await params;
  return <PracticeExam examId={examId} />;
};

export default PracticeExamPage;