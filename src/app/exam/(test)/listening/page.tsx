import ExamListening from "@/components/features/exam/listening";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thi nghe",
  description: "Thi nghe",
};

type ExamListeningPageProps = {};

const ExamListeningPage = (_: ExamListeningPageProps) => {
  return <ExamListening />;
};

export default ExamListeningPage;
