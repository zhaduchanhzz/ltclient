"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicContainer from "@/components/base/MaterialUI-Basic/Container";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import LoadingPageOverlay from "@/components/common/Overlay/LoadingPageOverlay";
import { useGetBlogPostsQuery } from "@/services/apis/blog-posts";
import { useState, useMemo, useEffect } from "react";
import ArticleCard from "./components/ArticleCard";
import BlogPagination from "./components/BlogPagination";
import BlogSearchBar from "./components/BlogSearchBar";
import { LinearProgress } from "@mui/material";

const BlogList = () => {
  // const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPage, setFilteredPage] = useState(0);
  const pageSize = 100; // Load more posts for client-side filtering
  const displayPageSize = 12;

  const { data, isLoading, error, isFetching } = useGetBlogPostsQuery({
    page: 0,
    size: pageSize,
    sort: ["createdAt,desc"],
  });

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!data?.content) return [];

    if (!searchTerm) return data.content;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.content.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerSearchTerm) ||
        (post.summary && post.summary.toLowerCase().includes(lowerSearchTerm)),
    );
  }, [data?.content, searchTerm]);

  // Paginate filtered results
  const paginatedPosts = useMemo(() => {
    const start = filteredPage * displayPageSize;
    const end = start + displayPageSize;
    return filteredPosts.slice(start, end);
  }, [filteredPosts, filteredPage]);

  const totalFilteredPages = Math.ceil(filteredPosts.length / displayPageSize);

  // Reset page when search term changes
  useEffect(() => {
    setFilteredPage(0);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    setFilteredPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
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

  if (error) {
    return (
      <BasicBox
        sx={{
          minHeight: "100vh",
          background: "rgb(18, 38, 63)",
          py: 6,
        }}
      >
        <BasicContainer maxWidth="lg_1200">
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

  return (
    <BasicBox
      sx={{
        minHeight: "100vh",
        background: "rgb(18, 38, 63)",
        py: 6,
      }}
    >
      <BasicContainer maxWidth="lg_1200">
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
            <BlogSearchBar onSearch={handleSearch} initialValue={searchTerm} />
          </BasicStack>

          {/* Loading indicator for fetching */}
          {isFetching && !isLoading && (
            <LinearProgress
              sx={{
                width: "100%",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "primary.main",
                },
              }}
            />
          )}

          {/* Articles List */}
          {paginatedPosts.length > 0 ? (
            <BasicBox>
              {paginatedPosts.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </BasicBox>
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
                  {searchTerm
                    ? "Không tìm thấy bài viết nào"
                    : "Chưa có bài viết nào"}
                </BasicTypography>
                {searchTerm && (
                  <BasicTypography
                    variant="body2"
                    sx={{ color: "white", opacity: 0.6 }}
                  >
                    Thử thay đổi từ khóa tìm kiếm của bạn
                  </BasicTypography>
                )}
              </BasicStack>
            </BasicBox>
          )}

          {/* Pagination */}
          {totalFilteredPages > 1 && (
            <BlogPagination
              currentPage={filteredPage + 1}
              totalPages={totalFilteredPages}
              onPageChange={(page) => handlePageChange(page - 1)}
            />
          )}
        </BasicStack>
      </BasicContainer>
    </BasicBox>
  );
};

export default BlogList;
