"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { APP_ROUTE } from "@/consts/app-route";
import { useListExamsByTypeQuery } from "@/services/apis/exam";
import { CircularProgress, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type PracticeDashBoardProps = {};

const PracticeDashBoard = (_: PracticeDashBoardProps) => {
  const theme = useTheme();
  const router = useRouter();
  
  // Fetch exams by type
  const { data, isLoading, error } = useListExamsByTypeQuery(true);
  
  // Calculate counts for each exam type
  const examCounts = useMemo(() => {
    if (!data?.data) {
      return {
        LISTENING: 0,
        READING: 0,
        WRITING: 0,
        SPEAKING: 0,
      };
    }
    
    const counts: Record<string, number> = {
      LISTENING: 0,
      READING: 0,
      WRITING: 0,
      SPEAKING: 0,
    };
    
    data.data.forEach((examType) => {
      if (counts[examType.examType] !== undefined) {
        counts[examType.examType] = examType.exams.length;
      }
    });
    
    return counts;
  }, [data]);

  return (
    <BasicBox>
      <BasicBox
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border:
            "1px solid " + theme.palette.customStyle.borderColor.secondary,
        }}
      >
        <BasicTypography variant="body1">
          Dù bầu trời màu xanh hay màu xám, bầu trời có trăng hay có sao, miễn
          là trái tim chân thành, những giấc mơ ngọt ngào sẽ luôn ở bên bạn.
        </BasicTypography>
        <BasicTypography variant="body1" component="span">
          Chúc
        </BasicTypography>
        <BasicTypography variant="h6" component="span">
          {" "}
          Duong Cong Chien
        </BasicTypography>
        <BasicTypography variant="body1" component="span">
          {" "}
          ngủ ngon.
        </BasicTypography>
      </BasicBox>
      <BasicStack
        direction="row"
        sx={{ justifyContent: "space-between", mt: 3 }}
      >
        <BasicStack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border:
              "1px solid " + theme.palette.customStyle.borderColor.secondary,
          }}
        >
          <BasicStack>
            <BasicTypography variant="body1" component="span">
              Đề thi nghe
            </BasicTypography>
            <BasicTypography variant="h6" component="span">
              {isLoading ? <CircularProgress size={20} /> : examCounts.LISTENING}
            </BasicTypography>
          </BasicStack>
          <BasicButton
            variant="outlined"
            size="large"
            onClick={() => router.push(APP_ROUTE.PRACTICE_LISTENING)}
          >
            <BasicTypography variant="body1">LUYỆN ĐỀ</BasicTypography>
          </BasicButton>
        </BasicStack>
        <BasicStack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border:
              "1px solid " + theme.palette.customStyle.borderColor.secondary,
          }}
        >
          <BasicStack>
            <BasicTypography variant="body1" component="span">
              Đề thi đọc
            </BasicTypography>
            <BasicTypography variant="h6" component="span">
              {isLoading ? <CircularProgress size={20} /> : examCounts.READING}
            </BasicTypography>
          </BasicStack>
          <BasicButton
            variant="outlined"
            size="large"
            onClick={() => router.push(APP_ROUTE.PRACTICE_READING)}
          >
            <BasicTypography variant="body1">LUYỆN ĐỀ</BasicTypography>
          </BasicButton>
        </BasicStack>
        <BasicStack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border:
              "1px solid " + theme.palette.customStyle.borderColor.secondary,
          }}
        >
          <BasicStack>
            <BasicTypography variant="body1" component="span">
              Đề thi viết
            </BasicTypography>
            <BasicTypography variant="h6" component="span">
              {isLoading ? <CircularProgress size={20} /> : examCounts.WRITING}
            </BasicTypography>
          </BasicStack>
          <BasicButton
            variant="outlined"
            size="large"
            onClick={() => router.push(APP_ROUTE.PRACTICE_WRITING)}
          >
            <BasicTypography variant="body1">LUYỆN ĐỀ</BasicTypography>
          </BasicButton>
        </BasicStack>{" "}
        <BasicStack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border:
              "1px solid " + theme.palette.customStyle.borderColor.secondary,
          }}
        >
          <BasicStack>
            <BasicTypography variant="body1" component="span">
              Đề thi nói
            </BasicTypography>
            <BasicTypography variant="h6" component="span">
              {isLoading ? <CircularProgress size={20} /> : examCounts.SPEAKING}
            </BasicTypography>
          </BasicStack>
          <BasicButton
            variant="outlined"
            size="large"
            onClick={() => router.push(APP_ROUTE.PRACTICE_SPEAKING)}
          >
            <BasicTypography variant="body1">LUYỆN ĐỀ</BasicTypography>
          </BasicButton>
        </BasicStack>
      </BasicStack>
    </BasicBox>
  );
};

export default PracticeDashBoard;
