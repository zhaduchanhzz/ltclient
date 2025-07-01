import { Metadata } from "next";
import VstepArticle from "@/components/features/home/vstep-article";

export const metadata: Metadata = {
  title: "Tất cả bài viết về VSTEP | Luyện thi VSTEP",
  description:
    "Tổng hợp tất cả bài viết về VSTEP, hướng dẫn thi thử, lịch thi các trường đại học, kiến thức và mẹo thi VSTEP. Cập nhật thông tin mới nhất về kỳ thi VSTEP.",
  keywords:
    "VSTEP, bài viết VSTEP, lịch thi VSTEP, hướng dẫn thi VSTEP, kiến thức VSTEP, mẹo thi VSTEP",
  openGraph: {
    title: "Tất cả bài viết về VSTEP | Luyện thi VSTEP",
    description:
      "Tổng hợp tất cả bài viết về VSTEP, hướng dẫn thi thử, lịch thi các trường đại học, kiến thức và mẹo thi VSTEP.",
    type: "website",
    siteName: "Luyện thi VSTEP",
  },
};

type VstepArticlePageProps = {};

const VstepArticlePage = (_: VstepArticlePageProps) => {
  return <VstepArticle />;
};

export default VstepArticlePage;
