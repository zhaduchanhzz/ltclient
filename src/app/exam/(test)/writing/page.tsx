import ExamWriting from "@/components/features/exam/writing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thi viết",
  description: "Thi viết",
};

type ExamWritingPageProps = {};

const ExamWritingPage = (_: ExamWritingPageProps) => {
  return <ExamWriting />;
};

export default ExamWritingPage;
