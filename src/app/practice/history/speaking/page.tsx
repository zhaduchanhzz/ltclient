import PracticeHistorySpeaking from "@/components/features/practice/history/speaking/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch sử bài luyện nói",
  description: "Lịch sử bài luyện nói",
};

type PracticeHistorySpeakingPageProps = {};

const PracticeHistorySpeakingPage = (_: PracticeHistorySpeakingPageProps) => {
  return <PracticeHistorySpeaking />;
};

export default PracticeHistorySpeakingPage;
