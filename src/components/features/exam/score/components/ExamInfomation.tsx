import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicPaper from "@/components/base/MaterialUI-Basic/Paper";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { EXAM_SECTION } from "@/consts";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import RegisterForPointingDialog from "../../../../common/Dialog/RegisterForPointingDialog";
import ViewSpeakingWritingExamDialog from "../../../../common/Dialog/ViewSpeakingWritingExamDialog";

type ExamInfomationProps = {};

const ExamInfomation = (_: ExamInfomationProps) => {
  const theme = useTheme();
  const isUpLgScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [openRegisterForSpeakingPoint, setOpenRegisterForSpeakingPoint] =
    useState<boolean>(false);

  const [openRegisterForWritingPoint, setOpenRegisterForWritingPoint] =
    useState<boolean>(false);

  const [openViewSpeakingExamDialog, setOpenViewSpeakingExamDialog] =
    useState<boolean>(false);

  const [openViewWritingExamDialog, setOpenViewWritingExamDialog] =
    useState<boolean>(false);

  const onConfirmRegisterForSpeakingPoint = () => {
    setOpenRegisterForSpeakingPoint(false);
  };

  const onConfirmRegisterForWritingPoint = () => {
    setOpenRegisterForWritingPoint(false);
  };

  return (
    <BasicPaper sx={{ p: 3, width: 1, maxWidth: { xs: 1, lg: 480 } }}>
      <BasicStack spacing={2}>
        <BasicStack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Mã lượt thi</BasicTypography>
          <BasicTypography variant="h6">276826</BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicStack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Điểm nghe</BasicTypography>
          <BasicTypography variant="h6">276826</BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicStack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Điểm đọc</BasicTypography>
          <BasicTypography variant="h6">276826</BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicStack
          spacing={2}
          direction={isUpLgScreen ? "row" : "column"}
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1"> Điểm viết</BasicTypography>
          <BasicStack
            spacing={2}
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            <BasicButton
              variant="outlined"
              color="info"
              size="small"
              startIcon={<ContentPasteIcon sx={{ width: 16, height: 16 }} />}
              onClick={() => setOpenRegisterForWritingPoint(true)}
            >
              Đăng ký chấm
            </BasicButton>
            <BasicButton
              variant="outlined"
              color="info"
              size="small"
              startIcon={<VisibilityIcon sx={{ width: 16, height: 16 }} />}
              onClick={() => setOpenViewWritingExamDialog(true)}
            >
              Xem bài
            </BasicButton>
          </BasicStack>
          <BasicTypography variant="body2" sx={{ fontWeight: "bold" }}>
            Chưa chấm
          </BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicStack
          spacing={2}
          direction={isUpLgScreen ? "row" : "column"}
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1"> Điểm nói</BasicTypography>
          <BasicStack
            spacing={2}
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            <BasicButton
              variant="outlined"
              color="info"
              size="small"
              startIcon={<ContentPasteIcon sx={{ width: 16, height: 16 }} />}
              onClick={() => setOpenRegisterForSpeakingPoint(true)}
            >
              Đăng ký chấm
            </BasicButton>
            <BasicButton
              variant="outlined"
              color="info"
              size="small"
              startIcon={<VisibilityIcon sx={{ width: 16, height: 16 }} />}
              onClick={() => setOpenViewSpeakingExamDialog(true)}
            >
              Xem bài
            </BasicButton>
          </BasicStack>
          <BasicTypography variant="body2" sx={{ fontWeight: "bold" }}>
            Chưa chấm
          </BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicStack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Điểm bài thi</BasicTypography>
          <BasicTypography variant="h6">276826</BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicStack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Bậc đạt được</BasicTypography>
          <BasicTypography variant="h6" color="error">
            Không xét
          </BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicStack direction="row" spacing={2}>
          <BasicButton
            variant="contained"
            size={isUpLgScreen ? "medium" : "small"}
            color="info"
            fullWidth
          >
            Xem lại bài thi
          </BasicButton>
          <BasicButton
            variant="contained"
            size={isUpLgScreen ? "medium" : "small"}
            color="info"
            fullWidth
          >
            Thi lại
          </BasicButton>
        </BasicStack>
      </BasicStack>

      <RegisterForPointingDialog
        open={openRegisterForSpeakingPoint}
        onClose={() => setOpenRegisterForSpeakingPoint(false)}
        onConfirm={onConfirmRegisterForSpeakingPoint}
      />
      <RegisterForPointingDialog
        open={openRegisterForWritingPoint}
        onClose={() => setOpenRegisterForWritingPoint(false)}
        onConfirm={onConfirmRegisterForWritingPoint}
      />
      <ViewSpeakingWritingExamDialog
        open={openViewSpeakingExamDialog}
        sectionType={EXAM_SECTION.WRITING}
        onClose={() => setOpenViewSpeakingExamDialog(false)}
      />
      <ViewSpeakingWritingExamDialog
        open={openViewWritingExamDialog}
        sectionType={EXAM_SECTION.SPEAKING}
        onClose={() => setOpenViewWritingExamDialog(false)}
      />
    </BasicPaper>
  );
};

export default ExamInfomation;
