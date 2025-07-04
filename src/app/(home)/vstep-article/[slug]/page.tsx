import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicBreadcrumbs from "@/components/base/MaterialUI-Basic/BreadCrumb";
import BasicContainer from "@/components/base/MaterialUI-Basic/Container";
import BasicNextImage from "@/components/base/MaterialUI-Basic/Image/BasicNextImage";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { API_PATH } from "@/consts/api-path";
import { BlogPost } from "@/services/types/blog-posts";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Fetch blog post by slug
// Since the API doesn't have a direct slug endpoint, we'll fetch all posts and find by slug
// In a production environment, you should implement a proper slug endpoint on the backend
async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // First, try to fetch from a paginated endpoint to find the post
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${API_PATH.BLOG_POSTS}?limit=100`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
        cache: "no-store", // For development, ensure fresh data
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch blog posts:", response.status);
      return null;
    }

    const data = await response.json();
    const posts = data.data?.posts || data.content || [];

    // Find the post with matching slug
    const article = posts.find((post: BlogPost) => post.slug === slug);

    if (!article) {
      // If not found in first page, you might need to implement pagination
      // or better yet, implement a proper slug endpoint on the backend
      return null;
    }

    // If we need to fetch the full article by ID (if the list doesn't include full content)
    if (article.id && !article.content) {
      const fullArticleResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${API_PATH.BLOG_POSTS}/${article.id}`,
        {
          next: { revalidate: 60 },
        },
      );

      if (fullArticleResponse.ok) {
        const fullArticleData = await fullArticleResponse.json();
        return fullArticleData.data || fullArticleData || article;
      }
    }

    return article;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${API_PATH.BLOG_POSTS}?limit=100`,
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (
      data.data?.posts?.map((article: BlogPost) => ({
        slug: article.slug,
      })) || []
    );
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getBlogPostBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: "Bài viết không tìm thấy | Luyện thi VSTEP",
      description: "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://luyenthi.vstep.edu.vn";
  const articleUrl = `${baseUrl}/vstep-article/${article.slug}`;

  return {
    title: `${article.title} | Luyện thi VSTEP`,
    description: article.description || article.title,
    keywords: `VSTEP, ${article.category}, ${article.title}, luyện thi VSTEP, thi thử VSTEP`,
    authors: [{ name: "Luyện thi VSTEP" }],
    openGraph: {
      title: article.title,
      description: article.description || article.title,
      type: "article",
      url: articleUrl,
      siteName: "Luyện thi VSTEP",
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      images: article.thumbnail
        ? [
            {
              url: article.thumbnail,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || article.title,
      images: article.thumbnail ? [article.thumbnail] : undefined,
    },
    alternates: {
      canonical: articleUrl,
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
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const resolvedParams = await params;
  const article = await getBlogPostBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatISODate = (dateString: string) => {
    return new Date(dateString).toISOString();
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Bài viết VSTEP", href: "/vstep-article" },
    { label: article.title, href: "#" },
  ];

  // Structured data for SEO
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://luyenthi.vstep.edu.vn";
  const articleUrl = `${baseUrl}/vstep-article/${article.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description || article.title,
    image: article.thumbnail ? [article.thumbnail] : undefined,
    datePublished: formatISODate(article.createdAt),
    dateModified: formatISODate(article.updatedAt),
    author: {
      "@type": "Organization",
      name: "Luyện thi VSTEP",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Luyện thi VSTEP",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    articleSection: article.category,
    keywords: `VSTEP, ${article.category}, ${article.title}, luyện thi VSTEP`,
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <BasicBox
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)",
          py: 6,
        }}
      >
        <BasicContainer maxWidth="md">
          <BasicStack spacing={4}>
            {/* Breadcrumb Navigation */}
            <BasicBreadcrumbs
              aria-label="breadcrumb"
              sx={{
                "& .MuiBreadcrumbs-ol": {
                  color: "white",
                },
                "& .MuiBreadcrumbs-separator": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            >
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return isLast ? (
                  <BasicTypography
                    key={item.label}
                    color="rgba(255, 255, 255, 0.7)"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {item.label}
                  </BasicTypography>
                ) : (
                  <BasicNextLink
                    key={item.label}
                    href={item.href}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                    }}
                  >
                    {item.label}
                  </BasicNextLink>
                );
              })}
            </BasicBreadcrumbs>

            {/* Article Header */}
            <BasicBox
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 3,
                p: 4,
                boxShadow: 3,
              }}
            >
              <BasicStack spacing={3}>
                {/* Category Badge */}
                <BasicTypography
                  variant="caption"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    fontWeight: 600,
                    alignSelf: "flex-start",
                  }}
                >
                  {article.category}
                </BasicTypography>

                {/* Title */}
                <BasicTypography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: "text.primary",
                  }}
                >
                  {article.title}
                </BasicTypography>

                {/* Date */}
                <BasicTypography variant="body2" color="text.secondary">
                  Ngày đăng: {formatDate(article.createdAt)}
                  {article.updatedAt !== article.createdAt && (
                    <> • Cập nhật: {formatDate(article.updatedAt)}</>
                  )}
                </BasicTypography>

                {/* Thumbnail */}
                {article.thumbnail && (
                  <BasicBox
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      mt: 2,
                    }}
                  >
                    <BasicNextImage
                      src={article.thumbnail}
                      alt={article.title}
                      width={800}
                      height={400}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "400px",
                        objectFit: "cover",
                      }}
                      priority
                    />
                  </BasicBox>
                )}
              </BasicStack>
            </BasicBox>

            {/* Article Content */}
            <BasicBox
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 3,
                p: 4,
                boxShadow: 3,
              }}
            >
              <BasicStack spacing={3}>
                {/* Description */}
                {article.description && (
                  <BasicTypography
                    variant="h6"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                      fontStyle: "italic",
                    }}
                  >
                    {article.description}
                  </BasicTypography>
                )}

                {/* Content */}
                <BasicBox>
                  {article.content ? (
                    <BasicTypography
                      variant="body1"
                      component="div"
                      sx={{
                        lineHeight: 1.8,
                        "& p": { mb: 2 },
                        "& h1, & h2, & h3, & h4, & h5, & h6": {
                          mt: 3,
                          mb: 2,
                          fontWeight: 600,
                        },
                        "& ul, & ol": {
                          pl: 3,
                          mb: 2,
                        },
                        "& li": {
                          mb: 1,
                        },
                        "& img": {
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: 1,
                          my: 2,
                        },
                        "& blockquote": {
                          borderLeft: "4px solid",
                          borderLeftColor: "primary.main",
                          pl: 2,
                          ml: 0,
                          my: 2,
                          fontStyle: "italic",
                          color: "text.secondary",
                        },
                        "& pre": {
                          backgroundColor: "grey.100",
                          p: 2,
                          borderRadius: 1,
                          overflowX: "auto",
                        },
                        "& code": {
                          backgroundColor: "grey.100",
                          px: 0.5,
                          borderRadius: 0.5,
                          fontSize: "0.875em",
                        },
                        "& a": {
                          color: "primary.main",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        },
                      }}
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  ) : (
                    <BasicStack spacing={2}>
                      <BasicTypography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Nội dung bài viết đang được cập nhật.
                      </BasicTypography>
                      <BasicTypography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Vui lòng quay lại sau để xem nội dung đầy đủ.
                      </BasicTypography>
                    </BasicStack>
                  )}
                </BasicBox>
              </BasicStack>
            </BasicBox>

            {/* Related Articles Section */}
            <BasicBox
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 3,
                p: 4,
                boxShadow: 3,
              }}
            >
              <BasicTypography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: "text.primary",
                }}
              >
                Bài viết liên quan
              </BasicTypography>
              <BasicTypography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontStyle: "italic",
                }}
              >
                Đang cập nhật...
              </BasicTypography>
            </BasicBox>
          </BasicStack>
        </BasicContainer>
      </BasicBox>
    </>
  );
};

export default ArticlePage;
