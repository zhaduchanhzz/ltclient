import WhatIsVstep from "@/components/features/home/what-is-vstep";
import { constructMetadata } from "@/utils/metadata";

export const metadata = constructMetadata({
  title: "VSTEP là gì? Tất cả về chứng chỉ tiếng Anh VSTEP",
  description: "Tìm hiểu VSTEP là gì, cấu trúc bài thi, thời gian thi và cách đánh giá. Hướng dẫn chi tiết về chứng chỉ tiếng Anh VSTEP từ B1 đến C1.",
});

type WhatIsVstepPageProps = {};

const WhatIsVstepPage = (_: WhatIsVstepPageProps) => {
  return <WhatIsVstep />;
};

export default WhatIsVstepPage;
