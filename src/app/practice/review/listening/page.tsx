import PracticeReviewListening from "@/components/features/practice/review/listening/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xem lại bài luyện nghe",
  description: "Xem lại bài luyện nghe",
};

type PracticeReviewListeningPageProps = {};

const PracticeReviewListeningPage = (_: PracticeReviewListeningPageProps) => {
  return <PracticeReviewListening />;
};

export default PracticeReviewListeningPage;
