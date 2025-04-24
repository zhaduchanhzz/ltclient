import PracticeSpeaking from "@/components/features/practice/skills/speaking";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luyện đề nói",
  description: "Luyện đề nói",
};

type PracticeSpeakingPageProps = {};

const PracticeSpeakingPage = (_: PracticeSpeakingPageProps) => {
  return <PracticeSpeaking />;
};

export default PracticeSpeakingPage;
