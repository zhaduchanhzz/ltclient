"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicCard from "@/components/base/MaterialUI-Basic/Card/Index";
import BasicCardContent from "@/components/base/MaterialUI-Basic/Card/BasicCardContent";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import BasicNextImage from "@/components/base/MaterialUI-Basic/Image/BasicNextImage";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import { BlogPost } from "@/services/types/blog-posts";
import { useTheme } from "@mui/material";
// Removed date-fns dependency

type ArticleCardProps = {
  article: BlogPost;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <BasicCard
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <BasicNextLink href={`/vstep-article/${article.slug}`} passHref>
        <BasicCardContent sx={{ p: 3 }}>
          <BasicStack direction="row" spacing={3} alignItems="flex-start">
            {/* Thumbnail */}
            <BasicBox
              sx={{
                flexShrink: 0,
                width: 120,
                height: 120,
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "grey.100",
              }}
            >
              {article.thumbnail ? (
                <BasicNextImage
                  src={article.thumbnail}
                  alt={article.title}
                  width={120}
                  height={120}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <BasicBox
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BasicTypography variant="caption" color="text.secondary">
                    Không có ảnh
                  </BasicTypography>
                </BasicBox>
              )}
            </BasicBox>

            {/* Content */}
            <BasicStack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
              {/* Title */}
              <BasicTypography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.customStyle.link.primary,
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  "&:hover": {
                    color: theme.palette.customStyle.link.secondary,
                  },
                }}
              >
                {article.title}
              </BasicTypography>

              {/* Description */}
              <BasicTypography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {article.description}
              </BasicTypography>

              {/* Category and Date */}
              <BasicStack direction="row" spacing={2} alignItems="center">
                <BasicTypography
                  variant="caption"
                  sx={{
                    backgroundColor: theme.palette.customStyle.link.primary,
                    color: "white",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 500,
                  }}
                >
                  {article.category}
                </BasicTypography>
                <BasicTypography variant="caption" color="text.secondary">
                  {formatDate(article.createdAt)}
                </BasicTypography>
              </BasicStack>
            </BasicStack>
          </BasicStack>
        </BasicCardContent>
      </BasicNextLink>
    </BasicCard>
  );
};

export default ArticleCard;
