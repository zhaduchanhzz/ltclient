import PracticeWriting from "@/components/features/practice/skills/writing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luyện đề viết",
  description: "Luyện đề viết",
};

type PracticeWritingPageProps = {};

const PracticeWritingPage = (_: PracticeWritingPageProps) => {
  return <PracticeWriting />;
};

export default PracticeWritingPage;
