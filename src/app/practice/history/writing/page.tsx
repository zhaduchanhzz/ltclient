import PracticeHistoryWriting from "@/components/features/practice/history/writing/page";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch sử bài luyện viết",
  description: "Lịch sử bài luyện viết",
};

type PracticeHistoryWritingPageProps = {};

const PracticeHistoryWritingPage = (_: PracticeHistoryWritingPageProps) => {
  return <PracticeHistoryWriting />;
};

export default PracticeHistoryWritingPage;
