"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicChip from "@/components/base/MaterialUI-Basic/Chip";
import BasicContainer from "@/components/base/MaterialUI-Basic/Container";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import LoadingPageOverlay from "@/components/common/Overlay/LoadingPageOverlay";
import { APP_ROUTE } from "@/consts/app-route";
import { useGetBlogPostByIdQuery } from "@/services/apis/blog-posts";
import { ArrowBack, PushPin } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

type BlogDetailProps = {
  blogId: number;
};

const BlogDetail = ({ blogId }: BlogDetailProps) => {
  const router = useRouter();
  const { data: article, isLoading, error } = useGetBlogPostByIdQuery(blogId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <BasicBox
        sx={{
          minHeight: "100vh",
          background: "rgb(18, 38, 63)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingPageOverlay />
      </BasicBox>
    );
  }

  if (error || !article) {
    return (
      <BasicBox
        sx={{
          minHeight: "100vh",
          background: "rgb(18, 38, 63)",
          py: 6,
        }}
      >
        <BasicContainer maxWidth="lg">
          <BasicStack spacing={4} alignItems="center">
            <BasicTypography
              variant="h4"
              sx={{ color: "white", textAlign: "center" }}
            >
              Không tìm thấy bài viết
            </BasicTypography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => router.push(APP_ROUTE.BLOG)}
            >
              Quay lại danh sách
            </Button>
          </BasicStack>
        </BasicContainer>
      </BasicBox>
    );
  }

  return (
    <BasicBox
      sx={{
        minHeight: "100vh",
        background: "rgb(18, 38, 63)",
        py: 6,
      }}
    >
      <BasicContainer maxWidth="md">
        <BasicStack spacing={4}>
          {/* Back button */}
          <BasicNextLink
            href={APP_ROUTE.BLOG}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255, 255, 255, 0.7)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            <ArrowBack fontSize="small" />
            <BasicTypography variant="body2">
              Quay lại danh sách bài viết
            </BasicTypography>
          </BasicNextLink>

          {/* Article content */}
          <BasicBox
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              p: { xs: 3, md: 5 },
            }}
          >
            <BasicStack spacing={3}>
              {/* Title and metadata */}
              <BasicStack spacing={2}>
                {article.pinned && (
                  <BasicChip
                    icon={<PushPin />}
                    label="Bài viết được ghim"
                    color="primary"
                    size="small"
                  />
                )}
                <BasicTypography
                  variant="h3"
                  component="h1"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: { xs: "1.75rem", md: "2.5rem" },
                  }}
                >
                  {article.title}
                </BasicTypography>
                <BasicTypography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                >
                  {formatDate(article.createdAt)}
                </BasicTypography>
              </BasicStack>

              <BasicDivider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

              {/* Summary */}
              {article.summary && (
                <>
                  <BasicTypography
                    variant="h6"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontStyle: "italic",
                    }}
                  >
                    {article.summary}
                  </BasicTypography>
                  <BasicDivider
                    sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                  />
                </>
              )}

              {/* Content */}
              <BasicBox
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  "& p": {
                    marginBottom: 2,
                    lineHeight: 1.8,
                  },
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    color: "white",
                    marginTop: 3,
                    marginBottom: 2,
                  },
                  "& ul, & ol": {
                    paddingLeft: 3,
                    marginBottom: 2,
                  },
                  "& li": {
                    marginBottom: 1,
                  },
                  "& blockquote": {
                    borderLeft: "4px solid",
                    borderLeftColor: "primary.main",
                    paddingLeft: 2,
                    marginLeft: 0,
                    marginTop: 2,
                    marginBottom: 2,
                    fontStyle: "italic",
                    color: "rgba(255, 255, 255, 0.8)",
                  },
                  "& code": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    padding: "2px 6px",
                    borderRadius: 1,
                    fontSize: "0.875em",
                  },
                  "& pre": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: 2,
                    borderRadius: 1,
                    overflowX: "auto",
                    marginBottom: 2,
                  },
                  "& a": {
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  },
                  "& img": {
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: 1,
                    marginTop: 2,
                    marginBottom: 2,
                  },
                  "& table": {
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: 2,
                  },
                  "& th, & td": {
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    padding: 1.5,
                    textAlign: "left",
                  },
                  "& th": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    fontWeight: 600,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Related posts */}
              {article.relatedBlogPosts && article.relatedBlogPosts.length > 0 && (
                <>
                  <BasicDivider
                    sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mt: 4 }}
                  />
                  <BasicStack spacing={2}>
                    <BasicTypography
                      variant="h5"
                      sx={{ color: "white", fontWeight: 600 }}
                    >
                      Bài viết liên quan
                    </BasicTypography>
                    <BasicStack spacing={1}>
                      {article.relatedBlogPosts.map((post) => (
                        <BasicNextLink
                          key={post.id}
                          href={`/blog/${post.id}`}
                          style={{
                            display: "block",
                            padding: "12px 16px",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderRadius: 8,
                            textDecoration: "none",
                            transition: "all 0.2s",
                          }}
                        >
                          <BasicTypography
                            variant="body1"
                            sx={{
                              color: "rgba(255, 255, 255, 0.9)",
                              "&:hover": {
                                color: "primary.main",
                              },
                            }}
                          >
                            {post.title}
                          </BasicTypography>
                        </BasicNextLink>
                      ))}
                    </BasicStack>
                  </BasicStack>
                </>
              )}
            </BasicStack>
          </BasicBox>
        </BasicStack>
      </BasicContainer>
    </BasicBox>
  );
};

export default BlogDetail;