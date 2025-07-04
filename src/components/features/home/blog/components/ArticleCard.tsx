"use client";
import BasicCard from "@/components/base/MaterialUI-Basic/Card";
import BasicCardContent from "@/components/base/MaterialUI-Basic/Card/BasicCardContent";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import { BlogPost } from "@/services/types/blog-posts";
import { Box } from "@mui/material";

type ArticleCardProps = {
  article: BlogPost;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <BasicCard
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        },
        mb: 3,
      }}
    >
      <BasicCardContent>
        <BasicStack spacing={2}>
          {/* Title */}
          <BasicTypography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {article.title}
          </BasicTypography>

          {/* Summary */}
          {article.summary && (
            <BasicTypography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 1.6,
              }}
            >
              {article.summary}
            </BasicTypography>
          )}

          {/* Link */}
          <Box>
            <BasicTypography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                mb: 0.5,
              }}
            >
              Chuyên mục:{" "}
              <BasicNextLink
                href={`/blog/${article.id}`}
                style={{
                  color: "#4FC3F7",
                  textDecoration: "none",
                }}
              >
                Xem chi tiết bài viết
              </BasicNextLink>
            </BasicTypography>
          </Box>
        </BasicStack>
      </BasicCardContent>
    </BasicCard>
  );
};

export default ArticleCard;