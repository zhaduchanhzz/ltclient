import LearnAboutVstep from "@/components/features/home/learn-about-vstep";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm hiểu về VSTEP",
  description: "Tìm hiểu về VSTEP",
};

type LearnAboutVstepPageProps = {};

const LearnAboutVstepPage = (_: LearnAboutVstepPageProps) => {
  return <LearnAboutVstep />;
};

export default LearnAboutVstepPage;
