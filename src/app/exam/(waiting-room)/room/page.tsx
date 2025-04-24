import ExamRoom from "@/components/features/exam/room";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phòng chờ",
  description: "Phòng chờ",
};

type ExamRoomPageProps = {};

const ExamRoomPage = (_: ExamRoomPageProps) => {
  return <ExamRoom />;
};

export default ExamRoomPage;
