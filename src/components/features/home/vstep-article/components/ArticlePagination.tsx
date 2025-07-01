"use client";
import BasicPagination from "@/components/base/MaterialUI-Basic/Pagination";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import { useTheme } from "@mui/material";

type ArticlePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const ArticlePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: ArticlePaginationProps) => {
  const theme = useTheme();

  if (totalPages <= 1) return null;

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <BasicBox
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
        mb: 4,
      }}
    >
      <BasicPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        sx={{
          "& .MuiPaginationItem-root": {
            color: "white",
            borderColor: "rgba(255, 255, 255, 0.3)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&.Mui-selected": {
              backgroundColor: theme.palette.customStyle.link.primary,
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.customStyle.link.secondary,
              },
            },
          },
          "& .MuiPaginationItem-ellipsis": {
            color: "rgba(255, 255, 255, 0.7)",
          },
        }}
      />
    </BasicBox>
  );
};

export default ArticlePagination;
