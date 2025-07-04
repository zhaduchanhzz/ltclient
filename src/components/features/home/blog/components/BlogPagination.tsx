"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicPagination from "@/components/base/MaterialUI-Basic/Pagination";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const BlogPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: BlogPaginationProps) => {
  return (
    <BasicBox sx={{ display: "flex", justifyContent: "center" }}>
      <BasicPagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        size="large"
        sx={{
          "& .MuiPaginationItem-root": {
            color: "rgba(255, 255, 255, 0.7)",
            borderColor: "rgba(255, 255, 255, 0.3)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            },
          },
        }}
      />
    </BasicBox>
  );
};

export default BlogPagination;