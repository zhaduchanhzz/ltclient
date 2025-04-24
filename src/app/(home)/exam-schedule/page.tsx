import ExamSchedule from "@/components/features/home/exam-schedule";
import { Metadata } from "next";

type ExamSchedulePageProps = {};

export const metadata: Metadata = {
  title: "Lịch thi VSTEP",
  description: "Lịch thi VSTEP",
};

const ExamSchedulePage = (_: ExamSchedulePageProps) => {
  return <ExamSchedule />;
};

export default ExamSchedulePage;
