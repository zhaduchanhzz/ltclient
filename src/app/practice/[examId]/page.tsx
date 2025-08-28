import PracticeExam from "@/components/features/practice/PracticeExam";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Exam",
  description: "Practice exam page",
};

type PracticeExamPageProps = {
  params: {
    examId: string;
  };
};

const PracticeExamPage = ({ params }: PracticeExamPageProps) => {
  return <PracticeExam examId={params.examId} />;
};

export default PracticeExamPage;