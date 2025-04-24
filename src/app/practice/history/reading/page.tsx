import PracticeHistoryReading from "@/components/features/practice/history/reading/page";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch sử bài luyện đọc",
  description: "Lịch sử bài luyện đọc",
};

type PracticeHistoryReadingPageProps = {};

const PracticeHistoryReadingPage = (_: PracticeHistoryReadingPageProps) => {
  return <PracticeHistoryReading />;
};

export default PracticeHistoryReadingPage;
