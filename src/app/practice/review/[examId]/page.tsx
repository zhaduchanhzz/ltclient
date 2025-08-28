import PracticeReview from "@/components/features/practice/PracticeReview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Practice Exam",
  description: "Review your practice exam answers",
};

type PracticeReviewPageProps = {
  params: Promise<{
    examId: string;
  }>;
};

const PracticeReviewPage = async ({ params }: PracticeReviewPageProps) => {
  const { examId } = await params;
  return <PracticeReview examId={examId} />;
};

export default PracticeReviewPage;