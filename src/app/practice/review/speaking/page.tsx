import PracticeReviewSpeaking from "@/components/features/practice/review/speaking/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xem lại bài luyện nói",
  description: "Xem lại bài luyện nói",
};

type PracticeReviewSpeakingPageProps = {};

const PracticeReviewSpeakingPage = (_: PracticeReviewSpeakingPageProps) => {
  return <PracticeReviewSpeaking />;
};

export default PracticeReviewSpeakingPage;
