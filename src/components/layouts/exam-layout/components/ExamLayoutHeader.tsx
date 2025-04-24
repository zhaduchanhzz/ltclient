import BasicAvatar from "@/components/base/MaterialUI-Basic/Avatar";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import ConfirmDialog from "@/components/common/Dialog/ConfirmDialog";
import { APP_ROUTE } from "@/consts/app-route";
import { useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ExamLayoutHeaderProps = {};

const ExamLayoutHeader = (_: ExamLayoutHeaderProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [seconds, setSeconds] = useState<number>(5 * 60);
  const [openSubmitDialog, setOpenSubmitDialog] = useState<boolean>(false);

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const onClickSubmit = () => {
    setOpenSubmitDialog(true);
  };

  const handleConfirmSubmit = () => {
    router.push(APP_ROUTE.EXAM_SCORE + "/" + "exam-code");
    setOpenSubmitDialog(false);
  };

  return (
    <BasicStack
      spacing={2}
      sx={{
        width: 1,
        minHeight: 111,
        p: 2,
        pb: 0.5,
        borderBottom:
          "2px solid" + theme.palette.customStyle.borderColor.primary,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <BasicStack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BasicStack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <BasicAvatar />
          <BasicTypography
            variant="h6"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            Duong Cong Chien
          </BasicTypography>
        </BasicStack>
        <BasicBox
          sx={{
            width: 80,
            backgroundColor: theme.palette.customStyle.link.primary,
            px: 1,
            py: 0.2,
            borderRadius: 1,
          }}
        >
          <BasicTypography
            variant="h4"
            align="center"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {formatTime(seconds)}
          </BasicTypography>
        </BasicBox>
        <BasicBox>
          <BasicButton
            size="small"
            color="info"
            variant="contained"
            onClick={onClickSubmit}
          >
            Nộp bài
          </BasicButton>
        </BasicBox>
      </BasicStack>
      <BasicBox>
        {Array.from({ length: 24 }).map((_, index) => (
          <BasicBox key={index} sx={{ display: "inline-block" }}>
            <BasicBox
              sx={{
                borderRadius: 1,
                p: 0,
                mr: 0.5,
                mb: 0.5,
                minWidth: 32,
                minHeight: 25,
                cursor: "default",
                border: "1px solid" + theme.palette.info.main,
              }}
            >
              <BasicTypography variant="body2" align="center" color="info">
                {index + 1}
              </BasicTypography>
            </BasicBox>
          </BasicBox>
        ))}
      </BasicBox>
      <ConfirmDialog
        open={openSubmitDialog}
        title="Nộp bài thi"
        description="Bạn có chắc chắn muốn nộp bài thi không?"
        onConfirm={handleConfirmSubmit}
        onClose={() => setOpenSubmitDialog(false)}
        confirmText="Nộp bài"
        cancelText="Không"
      />
    </BasicStack>
  );
};

export default ExamLayoutHeader;
