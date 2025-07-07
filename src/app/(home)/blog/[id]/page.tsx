import BlogDetail from "@/components/features/home/blog-detail";
import { API_PATH } from "@/consts/api-path";
import HttpClient from "@/utils/axios-config";
import { BlogPost } from "@/services/types/blog-posts";
import { Metadata } from "next";

type BlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const blogId = parseInt(resolvedParams.id, 10);

  if (isNaN(blogId)) {
    return {
      title: "Bài viết không tồn tại | VSTEP Luyện Thi",
      description: "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }

  try {
    // Fetch blog post data for metadata
    const blogPost = await HttpClient.get<null, BlogPost>(
      `${API_PATH.BLOG_POSTS}/${blogId}`,
    );

    // Generate description from summary or content
    const description =
      blogPost.summary ||
      blogPost.content
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .slice(0, 160)
        .trim() + "...";

    // Generate keywords from title and content
    const keywords = [
      "VSTEP",
      "luyện thi VSTEP",
      "tiếng Anh",
      "B1",
      "B2",
      "C1",
      ...blogPost.title.split(" ").filter((word) => word.length > 3),
    ].join(", ");

    return {
      title: `${blogPost.title} | VSTEP Luyện Thi`,
      description,
      keywords,
      authors: [{ name: "VSTEP Luyện Thi" }],
      openGraph: {
        title: blogPost.title,
        description,
        type: "article",
        publishedTime: blogPost.createdAt,
        modifiedTime: blogPost.updatedAt,
        authors: ["VSTEP Luyện Thi"],
        siteName: "VSTEP Luyện Thi",
        locale: "vi_VN",
        url: `https://vstep.vn/blog/${blogId}`,
        images: [
          {
            url: "/images/vstep-og-image.jpg", // Default OG image
            width: 1200,
            height: 630,
            alt: blogPost.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: blogPost.title,
        description,
        images: ["/images/vstep-og-image.jpg"],
      },
      alternates: {
        canonical: `https://vstep.vn/blog/${blogId}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch {
    // Fallback metadata if API call fails
    return {
      title: "Bài viết | VSTEP Luyện Thi",
      description:
        "Khám phá các bài viết hữu ích về luyện thi VSTEP, mẹo làm bài, và kinh nghiệm ôn thi hiệu quả.",
    };
  }
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const resolvedParams = await params;
  const blogId = parseInt(resolvedParams.id, 10);

  if (isNaN(blogId)) {
    return <div>Invalid blog ID</div>;
  }

  return <BlogDetail blogId={blogId} />;
};

export default BlogDetailPage;