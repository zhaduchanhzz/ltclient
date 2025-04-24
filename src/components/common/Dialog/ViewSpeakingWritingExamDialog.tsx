import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import ViewDialog from "@/components/common/Dialog/ViewDialog";
import { EXAM_SECTION } from "@/consts";

type ViewWritingExamDialogProps = {
  open: boolean;
  onClose: () => void;
  sectionType: keyof typeof EXAM_SECTION;
};

const ViewSpeakingWritingExamDialog = (props: ViewWritingExamDialogProps) => {
  const { open, onClose, sectionType } = props;

  return (
    <ViewDialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Chi tiết bài làm"
      description={
        <>
          {sectionType === EXAM_SECTION.WRITING ? (
            <BasicStack spacing={2}>
              <BasicStack spacing={1}>
                <BasicTypography
                  variant="h6"
                  sx={{ textDecoration: "underline" }}
                >
                  Task 1
                </BasicTypography>
                {false ? (
                  <BasicTypography variant="h6">Load bài thi</BasicTypography>
                ) : (
                  <BasicTypography variant="body2" sx={{ fontStyle: "italic" }}>
                    Thí sinh không làm bài
                  </BasicTypography>
                )}
              </BasicStack>
              <BasicStack spacing={1}>
                <BasicTypography
                  variant="h6"
                  sx={{ textDecoration: "underline" }}
                >
                  Task 2
                </BasicTypography>
                {false ? (
                  <BasicTypography variant="h6">Load bài thi</BasicTypography>
                ) : (
                  <BasicTypography variant="body2" sx={{ fontStyle: "italic" }}>
                    Thí sinh không làm bài
                  </BasicTypography>
                )}
              </BasicStack>
            </BasicStack>
          ) : (
            <BasicStack spacing={2}>
              <BasicStack spacing={1}>
                <BasicTypography
                  variant="h6"
                  sx={{ textDecoration: "underline" }}
                >
                  Bài thu âm số 1
                </BasicTypography>
                {false ? (
                  <BasicTypography variant="h6">Load bài thi</BasicTypography>
                ) : (
                  <BasicTypography variant="body2" sx={{ fontStyle: "italic" }}>
                    Thí sinh không làm bài
                  </BasicTypography>
                )}
              </BasicStack>
              <BasicStack spacing={1}>
                <BasicTypography
                  variant="h6"
                  sx={{ textDecoration: "underline" }}
                >
                  Bài thu âm số 2
                </BasicTypography>
                {false ? (
                  <BasicTypography variant="h6">Load bài thi</BasicTypography>
                ) : (
                  <BasicTypography variant="body2" sx={{ fontStyle: "italic" }}>
                    Thí sinh không làm bài
                  </BasicTypography>
                )}
              </BasicStack>
              <BasicStack spacing={1}>
                <BasicTypography
                  variant="h6"
                  sx={{ textDecoration: "underline" }}
                >
                  Bài thu âm số 2
                </BasicTypography>
                {false ? (
                  <BasicTypography variant="h6">Load bài thi</BasicTypography>
                ) : (
                  <BasicTypography variant="body2" sx={{ fontStyle: "italic" }}>
                    Thí sinh không làm bài
                  </BasicTypography>
                )}
              </BasicStack>
            </BasicStack>
          )}
        </>
      }
    />
  );
};

export default ViewSpeakingWritingExamDialog;
