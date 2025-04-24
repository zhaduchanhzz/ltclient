import PracticeDashBoard from "@/components/features/practice/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luyện tập",
  description: "Luyện tập",
};

type PracticeDashBoardPageProps = {};

const PracticeDashBoardPage = (_: PracticeDashBoardPageProps) => {
  return <PracticeDashBoard />;
};

export default PracticeDashBoardPage;
