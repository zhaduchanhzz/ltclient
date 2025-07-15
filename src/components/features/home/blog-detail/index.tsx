"use client";
import BasicAvatar from "@/components/base/MaterialUI-Basic/Avatar";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicBreadcrumbs from "@/components/base/MaterialUI-Basic/BreadCrumb";
import BasicCardContent from "@/components/base/MaterialUI-Basic/Card/BasicCardContent";
import BasicCard from "@/components/base/MaterialUI-Basic/Card/Index";
import BasicChip from "@/components/base/MaterialUI-Basic/Chip";
import BasicContainer from "@/components/base/MaterialUI-Basic/Container";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import BasicPaper from "@/components/base/MaterialUI-Basic/Paper";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import LoadingPageOverlay from "@/components/common/Overlay/LoadingPageOverlay";
import { APP_ROUTE } from "@/consts/app-route";
import { useGetBlogPostByIdQuery } from "@/services/apis/blog-posts";
import {
  AccessTime,
  ArrowBack,
  Bookmark,
  BookmarkBorder,
  CalendarToday,
  Person,
  PushPin,
  Share,
} from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BlogDetailProps = {
  blogId: number;
};

const BlogDetail = ({ blogId }: BlogDetailProps) => {
  const router = useRouter();
  const { data: article, isLoading, error } = useGetBlogPostByIdQuery(blogId);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} phút đọc`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <BasicBox
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
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
          backgroundColor: "#f5f5f5",
          py: 6,
        }}
      >
        <BasicContainer maxWidth="lg">
          <BasicStack spacing={4} alignItems="center">
            <BasicTypography
              variant="h4"
              sx={{ color: "#333", textAlign: "center" }}
            >
              Không tìm thấy bài viết
            </BasicTypography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => router.push(APP_ROUTE.BLOG)}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
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
        backgroundColor: "#ffffff",
        py: 4,
      }}
    >
      <BasicContainer maxWidth="lg_1200">
        <BasicStack spacing={4}>
          {/* Breadcrumbs */}
          <BasicBreadcrumbs aria-label="breadcrumb" style={{
            display: "flex",
            alignItems: "center",
            color: "#666",
            gap: 4,
          }}>
            <BasicNextLink
              href={APP_ROUTE.HOME}
              style={{ color: "#666", textDecoration: "none" }}
            >
              Trang chủ
            </BasicNextLink>
            <BasicNextLink
              href={APP_ROUTE.BLOG}
              style={{ color: "#666", textDecoration: "none" }}
            >
              Blog
            </BasicNextLink>
            <BasicTypography color="text.primary">
              {article.title}
            </BasicTypography>
          </BasicBreadcrumbs>

          {/* Main content */}
          <BasicPaper
            elevation={0}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* Article header */}
            <BasicBox sx={{ mb: 4 }}>
              {/* Pinned badge */}
              {article.pinned && (
                <BasicBox sx={{ mb: 2 }}>
                  <BasicChip
                    icon={<PushPin />}
                    label="Bài viết được ghim"
                    color="primary"
                    size="small"
                    sx={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}
                  />
                </BasicBox>
              )}

              {/* Title */}
              <BasicTypography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: "#1a1a1a",
                  mb: 3,
                }}
              >
                {article.title}
              </BasicTypography>

              {/* Summary */}
              {article.summary && (
                <BasicTypography
                  variant="h5"
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 400,
                    color: "#666",
                    lineHeight: 1.6,
                    mb: 3,
                  }}
                >
                  {article.summary}
                </BasicTypography>
              )}

              {/* Author and metadata row */}
              <BasicBox
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                  pb: 3,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <BasicBox
                  sx={{ display: "flex", alignItems: "center", gap: 3 }}
                >
                  {/* Author info */}
                  <BasicBox
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <BasicAvatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: "#1976d2",
                      }}
                    >
                      <Person />
                    </BasicAvatar>
                    <BasicBox>
                      <BasicTypography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1a1a1a" }}
                      >
                        VSTEP Luyện Thi
                      </BasicTypography>
                      <BasicBox
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <BasicTypography
                          variant="caption"
                          sx={{
                            color: "#666",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <CalendarToday sx={{ fontSize: 14 }} />
                          {formatDate(article.createdAt)}
                        </BasicTypography>
                        <BasicTypography
                          variant="caption"
                          sx={{
                            color: "#666",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTime sx={{ fontSize: 14 }} />
                          {calculateReadingTime(article.content)}
                        </BasicTypography>
                      </BasicBox>
                    </BasicBox>
                  </BasicBox>
                </BasicBox>

                {/* Action buttons */}
                <BasicBox sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Lưu bài viết">
                    <IconButton
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      sx={{ color: isBookmarked ? "#1976d2" : "#666" }}
                    >
                      {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chia sẻ">
                    <IconButton onClick={handleShare} sx={{ color: "#666" }}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                </BasicBox>
              </BasicBox>
            </BasicBox>

            {/* Article content */}
            <BasicBox
              sx={{
                "& p": {
                  fontSize: "1.125rem",
                  lineHeight: 1.8,
                  marginBottom: "1.5rem",
                  color: "#333",
                },
                "& h1": {
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  marginTop: "3rem",
                  marginBottom: "1rem",
                  color: "#1a1a1a",
                },
                "& h2": {
                  fontSize: "2rem",
                  fontWeight: 600,
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "#1a1a1a",
                },
                "& h3": {
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginTop: "2rem",
                  marginBottom: "0.75rem",
                  color: "#1a1a1a",
                },
                "& h4, & h5, & h6": {
                  fontWeight: 500,
                  marginTop: "1.5rem",
                  marginBottom: "0.5rem",
                  color: "#1a1a1a",
                },
                "& ul, & ol": {
                  paddingLeft: "2rem",
                  marginBottom: "1.5rem",
                },
                "& li": {
                  fontSize: "1.125rem",
                  lineHeight: 1.8,
                  marginBottom: "0.5rem",
                  color: "#333",
                },
                "& blockquote": {
                  borderLeft: "4px solid #1976d2",
                  paddingLeft: "1.5rem",
                  marginLeft: 0,
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                  color: "#555",
                  backgroundColor: "#f5f5f5",
                  padding: "1rem 1.5rem",
                  borderRadius: "0 8px 8px 0",
                },
                "& code": {
                  backgroundColor: "#f5f5f5",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: "0.9em",
                  color: "#d32f2f",
                  fontFamily: "'Consolas', 'Monaco', monospace",
                },
                "& pre": {
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  padding: "1.5rem",
                  borderRadius: 8,
                  overflowX: "auto",
                  marginBottom: "1.5rem",
                  "& code": {
                    backgroundColor: "transparent",
                    color: "#fff",
                    padding: 0,
                  },
                },
                "& a": {
                  color: "#1976d2",
                  textDecoration: "none",
                  borderBottom: "1px solid transparent",
                  transition: "border-color 0.2s",
                  "&:hover": {
                    borderBottomColor: "#1976d2",
                  },
                },
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 8,
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
                "& table": {
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "1.5rem",
                  fontSize: "1rem",
                },
                "& th, & td": {
                  border: "1px solid #e0e0e0",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                },
                "& th": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: 600,
                  color: "#1a1a1a",
                },
                "& hr": {
                  border: "none",
                  borderTop: "1px solid #e0e0e0",
                  margin: "2rem 0",
                },
              }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Share section */}
            <BasicBox
              sx={{
                mt: 6,
                pt: 4,
                borderTop: "1px solid #e0e0e0",
                textAlign: "center",
              }}
            >
              <BasicTypography variant="h6" sx={{ mb: 2, color: "#1a1a1a" }}>
                Chia sẻ bài viết
              </BasicTypography>
              <BasicBox
                sx={{ display: "flex", justifyContent: "center", gap: 2 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={handleShare}
                  sx={{
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    "&:hover": {
                      borderColor: "#1565c0",
                      backgroundColor: "rgba(25, 118, 210, 0.04)",
                    },
                  }}
                >
                  Chia sẻ
                </Button>
                <Button
                  variant="outlined"
                  startIcon={isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  sx={{
                    borderColor: isBookmarked ? "#1976d2" : "#666",
                    color: isBookmarked ? "#1976d2" : "#666",
                    "&:hover": {
                      borderColor: "#1976d2",
                      backgroundColor: "rgba(25, 118, 210, 0.04)",
                    },
                  }}
                >
                  {isBookmarked ? "Đã lưu" : "Lưu bài viết"}
                </Button>
              </BasicBox>
            </BasicBox>
          </BasicPaper>

          {/* Related articles section */}
          {article.relatedBlogPosts && article.relatedBlogPosts.length > 0 && (
            <BasicBox sx={{ mt: 6 }}>
              <BasicTypography
                variant="h4"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}
              >
                Bài viết liên quan
              </BasicTypography>
              <BasicGrid container spacing={3}>
                {article.relatedBlogPosts.map((post) => (
                  <BasicGrid key={post.id}>
                    <BasicCard
                      sx={{
                        height: "100%",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <BasicCardContent>
                        <BasicNextLink
                          href={`/blog/${post.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <BasicTypography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "#1a1a1a",
                              mb: 1,
                              lineHeight: 1.4,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {post.title}
                          </BasicTypography>
                          {post.summary && (
                            <BasicTypography
                              variant="body2"
                              sx={{
                                color: "#666",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {post.summary}
                            </BasicTypography>
                          )}
                        </BasicNextLink>
                      </BasicCardContent>
                    </BasicCard>
                  </BasicGrid>
                ))}
              </BasicGrid>
            </BasicBox>
          )}

          {/* Back to blog button */}
          <BasicBox sx={{ mt: 6, textAlign: "center" }}>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => router.push(APP_ROUTE.BLOG)}
              size="large"
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
                px: 4,
              }}
            >
              Quay lại danh sách bài viết
            </Button>
          </BasicBox>
        </BasicStack>
      </BasicContainer>
    </BasicBox>
  );
};

export default BlogDetail;
