"use client";
import BasicTextField from "@/components/base/MaterialUI-Basic/TextField";
import { useCallback, useEffect, useState } from "react";
import { useTheme, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type ArticleSearchBarProps = {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
};

const ArticleSearchBar = ({
  onSearch,
  placeholder = "Tìm kiếm bài viết...",
}: ArticleSearchBarProps) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // Debounced search
  const debouncedSearch = useCallback(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    const cleanup = debouncedSearch();
    return cleanup;
  }, [debouncedSearch]);

  return (
    <BasicTextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{
        maxWidth: 600,
        mx: "auto",
        "& .MuiOutlinedInput-root": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 3,
          fontSize: "1rem",
          color: "white",
          "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.3)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(255, 255, 255, 0.5)",
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.customStyle.link.primary,
          },
          "& input": {
            color: "white",
            "&::placeholder": {
              color: "rgba(255, 255, 255, 0.7)",
              opacity: 1,
            },
          },
        },
        "& .MuiInputAdornment-root": {
          "& .MuiSvgIcon-root": {
            color: "rgba(255, 255, 255, 0.7)",
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default ArticleSearchBar;
