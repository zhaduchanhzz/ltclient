import Subcription from "@/components/features/home/subcription";
import { constructMetadata } from "@/utils/metadata";

export const metadata = constructMetadata({
  title: "Gói ôn luyện và chấm thi VSTEP",
  description: "Các gói ôn luyện VSTEP từ cơ bản đến nâng cao. Chấm thi Speaking & Writing bằng AI. Cam kết đạu chứng chỉ hoặc hoàn tiền.",
});

type SubcriptionPageProps = {};

const SubcriptionPage = (_: SubcriptionPageProps) => {
  return <Subcription />;
};

export default SubcriptionPage;
