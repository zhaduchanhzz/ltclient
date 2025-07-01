"use client";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicContainer from "@/components/base/MaterialUI-Basic/Container";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import BasicNextImage from "@/components/base/MaterialUI-Basic/Image/BasicNextImage";
import LoadingPageOverlay from "@/components/common/Overlay/LoadingPageOverlay";
import { useGetBlogPostBySlugQuery } from "@/services/apis/blog-posts";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// For static generation, we'll need to implement this when we have the API data
// export async function generateStaticParams() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogposts`);
//     const data = await response.json();
//     return data.data.posts.map((article: any) => ({
//       slug: article.slug,
//     }));
//   } catch {
//     return [];
//   }
// }

// Note: generateMetadata removed due to "use client" directive
// In a real application, you would handle metadata on the server side

const ArticlePage = ({ params }: ArticlePageProps) => {
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  const { data, isLoading, error } = useGetBlogPostBySlugQuery(slug, !!slug);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Loading state
  if (isLoading) {
    return (
      <BasicBox
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingPageOverlay />
      </BasicBox>
    );
  }

  // Error state
  if (error) {
    return (
      <BasicBox
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)",
          py: 6,
        }}
      >
        <BasicContainer maxWidth="md">
          <BasicStack spacing={4} alignItems="center">
            <BasicTypography
              variant="h4"
              sx={{ color: "white", textAlign: "center" }}
            >
              Đã xảy ra lỗi khi tải bài viết
            </BasicTypography>
            <BasicTypography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.8)", textAlign: "center" }}
            >
              Vui lòng thử lại sau ít phút
            </BasicTypography>
          </BasicStack>
        </BasicContainer>
      </BasicBox>
    );
  }

  const article = data?.data;

  if (!article) {
    notFound();
  }

  return (
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
        </BasicStack>
      </BasicContainer>
    </BasicBox>
  );
};

export default ArticlePage;
