import ExamReading from "@/components/features/exam/reading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thi đọc",
  description: "Thi đọc",
};

type ExamReadingPageProps = {};

const ExamReadingPage = (_: ExamReadingPageProps) => {
  return <ExamReading />;
};

export default ExamReadingPage;
