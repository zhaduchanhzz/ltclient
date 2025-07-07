import BlogList from "@/components/features/home/blog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bài viết VSTEP - Kinh nghiệm và mẹo luyện thi",
  description:
    "Tổng hợp các bài viết về VSTEP, kinh nghiệm luyện thi, mẹo làm bài, phương pháp học hiệu quả cho kỳ thi VSTEP các cấp độ B1, B2, C1.",
  keywords:
    "bài viết VSTEP, kinh nghiệm thi VSTEP, mẹo thi VSTEP, luyện thi VSTEP, VSTEP B1, VSTEP B2, VSTEP C1, phương pháp học VSTEP",
  openGraph: {
    title: "Bài viết VSTEP - Kinh nghiệm và mẹo luyện thi",
    description:
      "Tổng hợp các bài viết về VSTEP, kinh nghiệm luyện thi, mẹo làm bài hiệu quả.",
    type: "website",
    url: "https://luyenthivstep.vn/blog",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Bài viết VSTEP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bài viết VSTEP - Kinh nghiệm và mẹo luyện thi",
    description:
      "Tổng hợp các bài viết về VSTEP, kinh nghiệm luyện thi, mẹo làm bài hiệu quả.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://luyenthivstep.vn/blog",
  },
};

const BlogPage = () => {
  return <BlogList />;
};

export default BlogPage;