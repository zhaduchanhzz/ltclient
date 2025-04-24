import PracticeHistoryListening from "@/components/features/practice/history/listening/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch sử bài luyện nghe",
  description: "Lịch sử bài luyện nghe",
};

type PracticeHistoryListeningPageProps = {};

const PracticeHistoryListeningPage = (_: PracticeHistoryListeningPageProps) => {
  return <PracticeHistoryListening />;
};

export default PracticeHistoryListeningPage;
