"use client";
import BasicTextField from "@/components/base/MaterialUI-Basic/TextField";
import { useState, useEffect, useRef } from "react";
import { useTheme, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

type BlogSearchBarProps = {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  initialValue?: string;
};

const BlogSearchBar = ({
  onSearch,
  placeholder = "Tìm kiếm bài viết...",
  initialValue = "",
}: BlogSearchBarProps) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with parent's initial value changes
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <BasicTextField
      inputRef={inputRef}
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleChange}
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
            borderColor: theme.palette.primary.main,
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
        endAdornment: searchTerm && (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default BlogSearchBar;