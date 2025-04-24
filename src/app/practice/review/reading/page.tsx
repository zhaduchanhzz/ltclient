import PracticeReviewReading from "@/components/features/practice/review/reading/page";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xem lại bài luyện đọc",
  description: "Xem lại bài luyện đọc",
};

type PracticeReviewReadingPageProps = {};

const PracticeReviewReadingPage = (_: PracticeReviewReadingPageProps) => {
  return <PracticeReviewReading />;
};

export default PracticeReviewReadingPage;
