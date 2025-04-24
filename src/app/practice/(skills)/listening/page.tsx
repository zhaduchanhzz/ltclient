import PracticeListening from "@/components/features/practice/skills/listening";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luyện đề nghe",
  description: "Luyện đề nghe",
};

type PracticeListeningPageProps = {};

const PracticeListeningPage = (_: PracticeListeningPageProps) => {
  return <PracticeListening />;
};

export default PracticeListeningPage;
