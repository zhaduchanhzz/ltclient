"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import RelateArticleCard from "../exam-schedule/components/RelateArticleCard";
import { vstepExamScheduleSample } from "../exam-schedule/utils/data";
import { useState } from "react";

type LearnAboutVstepProps = {};

const LearnAboutVstep = (_: LearnAboutVstepProps) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const onToggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <BasicBox sx={{ my: 5 }}>
      <BasicStack spacing={5}>
        <BasicTypography variant="h4" align="center">
          Tất cả bài viết trong mục Tìm hiểu về VSTEP
        </BasicTypography>
        <BasicGrid container spacing={5}>
          {(showAll
            ? vstepExamScheduleSample
            : vstepExamScheduleSample.slice(0, 6)
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
    </BasicBox>
  );
};

export default LearnAboutVstep;
