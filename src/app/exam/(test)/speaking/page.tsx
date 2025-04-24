import ExamSpeaking from "@/components/features/exam/speaking";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thi nói",
  description: "Thi nói",
};

type ExamSpeakingPageProps = {};

const ExamSpeakingPage = (_: ExamSpeakingPageProps) => {
  return <ExamSpeaking />;
};

export default ExamSpeakingPage;
