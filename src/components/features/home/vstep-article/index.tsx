"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicContainer from "@/components/base/MaterialUI-Basic/Container";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import LoadingPageOverlay from "@/components/common/Overlay/LoadingPageOverlay";
import { useGetBlogPostsQuery } from "@/services/apis/blog-posts";
import { BlogPostFilters } from "@/services/types/blog-posts";
import { useCallback, useState } from "react";
import ArticleCard from "./components/ArticleCard";
import ArticlePagination from "./components/ArticlePagination";
import ArticleSearchBar from "./components/ArticleSearchBar";

type VstepArticleProps = {};

const VstepArticle = (_: VstepArticleProps) => {
  const [filters, setFilters] = useState<BlogPostFilters>({
    search: "",
    page: 1,
    limit: 12,
  });

  // Use real API data
  const { data, isLoading, error } = useGetBlogPostsQuery(filters);

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1, // Reset to first page when searching
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
        <BasicContainer maxWidth="lg">
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

  const blogPosts = data?.data?.posts || [];
  const totalPages = data?.data?.totalPages || 0;
  const currentPage = data?.data?.page || 1;
  const totalPosts = data?.data?.total || 0;

  return (
    <BasicBox
      sx={{
        minHeight: "100vh",
        background: "rgb(18, 38, 63)",
        py: 6,
      }}
    >
      <BasicContainer maxWidth="lg">
        <BasicStack spacing={6}>
          {/* Header */}
          <BasicStack spacing={4} alignItems="center">
            <BasicTypography
              variant="h3"
              component="h1"
              sx={{
                color: "white",
                fontWeight: 700,
                textAlign: "center",
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Tất cả bài viết về VSTEP
            </BasicTypography>

            {/* Search Bar */}
            <ArticleSearchBar onSearch={handleSearch} />
          </BasicStack>

          {/* Articles Grid */}
          {blogPosts.length > 0 ? (
            <BasicGrid container spacing={4}>
              {blogPosts.map((article) => (
                <BasicGrid key={article.id} size={{ xs: 12 }}>
                  <ArticleCard article={article} />
                </BasicGrid>
              ))}
            </BasicGrid>
          ) : (
            <BasicBox
              sx={{
                py: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BasicStack spacing={2} alignItems="center">
                <BasicTypography
                  variant="h6"
                  sx={{ color: "white", opacity: 0.8 }}
                >
                  {filters.search
                    ? "Không tìm thấy bài viết nào"
                    : "Chưa có bài viết nào"}
                </BasicTypography>
                <BasicTypography
                  variant="body2"
                  sx={{ color: "white", opacity: 0.6 }}
                >
                  {filters.search
                    ? "Thử thay đổi từ khóa tìm kiếm của bạn"
                    : "Bài viết sẽ được cập nhật sớm nhất"}
                </BasicTypography>
              </BasicStack>
            </BasicBox>
          )}

          {/* Pagination */}
          <ArticlePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {/* Article Count Info */}
          {totalPosts > 0 && (
            <BasicBox sx={{ textAlign: "center" }}>
              <BasicTypography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Hiển thị {(currentPage - 1) * (filters.limit || 12) + 1}-
                {Math.min(currentPage * (filters.limit || 12), totalPosts)}{" "}
                trong tổng số {totalPosts} bài viết
              </BasicTypography>
            </BasicBox>
          )}
        </BasicStack>
      </BasicContainer>
    </BasicBox>
  );
};

export default VstepArticle;
