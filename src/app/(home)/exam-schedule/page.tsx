import ExamSchedule from "@/components/features/home/exam-schedule";
import { constructMetadata } from "@/utils/metadata";

type ExamSchedulePageProps = {};

export const metadata = constructMetadata({
  title: "Lịch thi VSTEP 2025",
  description: "Cập nhật lịch thi VSTEP mới nhất năm 2025 tại các trường đại học trên toàn quốc. Xem ngày thi, địa điểm và hướng dẫn đăng ký.",
});

const ExamSchedulePage = (_: ExamSchedulePageProps) => {
  return <ExamSchedule />;
};

export default ExamSchedulePage;
