"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import { Metadata } from "next";
import ExamInfomation from "./components/ExamInfomation";
import UserInfomation from "./components/UserInfomation";

export const metadata: Metadata = {
  title: "Kết quả thi",
  description: "Kết quả thi",
};

type ExamScoreProps = {};

const ExamScore = (_: ExamScoreProps) => {
  const theme = useTheme();
  const isUpMdScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <BasicBox sx={{ maxWidth: 1200, margin: "0 auto" }}>
      <BasicBox sx={{ mb: 3 }}>
        <BasicTypography variant="h6">Bạn đang truy cập</BasicTypography>
        <BasicTypography variant="h5">Kết quả thi</BasicTypography>
        <BasicDivider variant="fullWidth" sx={{ mt: 2, mb: 4 }} />
      </BasicBox>
      <BasicStack
        direction={isUpMdScreen ? "row" : "column"}
        spacing={10}
        sx={{
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ExamInfomation />
        <UserInfomation />
      </BasicStack>
    </BasicBox>
  );
};

export default ExamScore;
