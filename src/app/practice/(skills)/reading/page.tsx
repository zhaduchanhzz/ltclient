import PracticeReading from "@/components/features/practice/skills/reading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luyện đề đọc",
  description: "Luyện đề đọc",
};

type PracticeReadingPageProps = {};

const PracticeReadingPage = (_: PracticeReadingPageProps) => {
  return <PracticeReading />;
};

export default PracticeReadingPage;
