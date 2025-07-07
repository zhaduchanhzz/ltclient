import Home from "@/components/features/home/home-page";
import { constructMetadata } from "@/utils/metadata";

export const metadata = constructMetadata({
  title: "Luyện Thi VSTEP Online - Hệ Thống Ôn Thi VSTEP Hàng Đầu Việt Nam",
  description: "Luyện thi VSTEP online với hơn 10,000 câu hỏi, chấm thi tự động Speaking & Writing. Cam kết đạt chứng chỉ VSTEP B1, B2, C1. Học thử miễn phí ngay!",
});

const HomePage = () => {
  return <Home />;
};

export default HomePage;
