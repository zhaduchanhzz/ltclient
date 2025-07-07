"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicContainer from "@/components/base/MaterialUI-Basic/Container";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import LoadingPageOverlay from "@/components/common/Overlay/LoadingPageOverlay";
import { useGetBlogPostsQuery } from "@/services/apis/blog-posts";
import { BlogPost, Pageable } from "@/services/types/blog-posts";
import { LinearProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ArticleSearchBar from "./components/ArticleSearchBar";
import ArticleCard from "../blog/components/ArticleCard";
import ArticlePagination from "./components/ArticlePagination";

type VstepArticleProps = {};

const VstepArticle = (_: VstepArticleProps) => {
  const [filters, setFilters] = useState<Pageable>({
    page: 0,
    size: 10,
    searchTerm: "",
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Main data for the grid
  const { data, isLoading, error, isFetching } = useGetBlogPostsQuery(
    filters,
    true,
  );

  // Mark initial load as complete when data is first loaded
  useEffect(() => {
    if (data && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [data, isInitialLoad]);

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters((prev: Pageable) => ({
      ...prev,
      searchTerm: searchTerm,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev: Pageable) => ({
      ...prev,
      page,
    }));

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Only show full loading overlay on initial load
  if (isLoading && isInitialLoad) {
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

  // Error state
  if (error) {
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

  const blogPosts = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.number || 1;
  const totalPosts = data?.totalElements || 0;

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
            <ArticleSearchBar
              onSearch={handleSearch}
              initialValue={filters.searchTerm || ""}
            />
          </BasicStack>

          {/* Loading indicator for search/pagination */}
          {isFetching && !isInitialLoad && (
            <LinearProgress
              sx={{
                width: "100%",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "primary.main",
                },
              }}
            />
          )}

          {/* Articles Grid */}
          {blogPosts.length > 0 ? (
            <BasicGrid container spacing={4}>
              {blogPosts.map((article: BlogPost) => (
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
                  {filters.searchTerm
                    ? "Không tìm thấy bài viết nào"
                    : "Chưa có bài viết nào"}
                </BasicTypography>
                <BasicTypography
                  variant="body2"
                  sx={{ color: "white", opacity: 0.6 }}
                >
                  {filters.searchTerm
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
                Hiển thị {(currentPage - 1) * (filters.size || 12) + 1}-
                {Math.min(currentPage * (filters.size || 12), totalPosts)}{" "}
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
