import ExamScore from "@/components/features/exam/score";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kết quả thi",
  description: "Kết quả thi",
};

type ExamScorePageProps = {};

const ExamScorePage = (_: ExamScorePageProps) => {
  return <ExamScore />;
};

export default ExamScorePage;
