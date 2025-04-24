"use client";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useState } from "react";
import { vstepExamScheduleSample } from "../utils/data";
import RelateArticleCard from "./RelateArticleCard";

type RelateArticleProps = {};

const RelateArticle = (_: RelateArticleProps) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const onToggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <BasicStack spacing={4}>
      <BasicTypography variant="h6">Các bài viết liên quan:</BasicTypography>
      <BasicGrid container spacing={5}>
        {(showAll
          ? vstepExamScheduleSample
          : vstepExamScheduleSample.slice(0, 3)
        ).map((item) => (
          <BasicGrid key={item.id} size={{ xs: 12, sm: 4 }}>
            <RelateArticleCard item={item} />
          </BasicGrid>
        ))}
      </BasicGrid>
      <BasicStack sx={{ alignItems: "center" }}>
        <BasicButton
          variant="outlined"
          size="medium"
          color="info"
          onClick={onToggleShowAll}
        >
          <BasicTypography variant="body2">
            {showAll
              ? "Ẩn các bài viết liên quan"
              : "Xem thêm các bài viết liên quan"}
          </BasicTypography>
        </BasicButton>
      </BasicStack>
    </BasicStack>
  );
};

export default RelateArticle;
