import PracticeReviewWriting from "@/components/features/practice/review/writing/page";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch sử bài luyện viết",
  description: "Lịch sử bài luyện viết",
};

type PracticeReviewWritingPageProps = {};

const PracticeReviewWritingPage = (_: PracticeReviewWritingPageProps) => {
  return <PracticeReviewWriting />;
};

export default PracticeReviewWritingPage;
