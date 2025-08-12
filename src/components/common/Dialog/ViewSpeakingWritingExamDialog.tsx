import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import ViewDialog from "@/components/common/Dialog/ViewDialog";
import { EXAM_SECTION } from "@/consts";

type ViewWritingExamDialogProps = {
  open: boolean;
  onClose: () => void;
  sectionType: keyof typeof EXAM_SECTION;
  examData?: any;
};

const ViewSpeakingWritingExamDialog = (props: ViewWritingExamDialogProps) => {
  const { open, onClose, sectionType, examData } = props;

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
                  Bài viết 1
                </BasicTypography>
                {examData && examData[0] ? (
                  <BasicStack spacing={1}>
                    <BasicTypography variant="body2" sx={{ fontWeight: "bold" }}>
                      Câu hỏi: {examData[0].questionText}
                    </BasicTypography>
                    <BasicTypography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {examData[0].content}
                    </BasicTypography>
                  </BasicStack>
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
                  Bài viết 2
                </BasicTypography>
                {examData && examData[1] ? (
                  <BasicStack spacing={1}>
                    <BasicTypography variant="body2" sx={{ fontWeight: "bold" }}>
                      Câu hỏi: {examData[1].questionText}
                    </BasicTypography>
                    <BasicTypography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {examData[1].content}
                    </BasicTypography>
                  </BasicStack>
                ) : (
                  <BasicTypography variant="body2" sx={{ fontStyle: "italic" }}>
                    Thí sinh không làm bài
                  </BasicTypography>
                )}
              </BasicStack>
            </BasicStack>
          ) : (
            <BasicStack spacing={2}>
              {examData && examData.map((item: any, index: number) => (
                <BasicStack spacing={1} key={index}>
                  <BasicTypography
                    variant="h6"
                    sx={{ textDecoration: "underline" }}
                  >
                    Bài thu âm số {index + 1}
                  </BasicTypography>
                  {item ? (
                    <BasicStack spacing={1}>
                      <BasicTypography variant="body2" sx={{ fontWeight: "bold" }}>
                        Câu hỏi: {item.questionText}
                      </BasicTypography>
                      <BasicTypography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                        {item.content ? "Đã thu âm" : "Thí sinh không làm bài"}
                      </BasicTypography>
                    </BasicStack>
                  ) : (
                    <BasicTypography variant="body2" sx={{ fontStyle: "italic" }}>
                      Thí sinh không làm bài
                    </BasicTypography>
                  )}
                </BasicStack>
              ))}
              {(!examData || examData.length === 0) && (
                <BasicTypography variant="body2" sx={{ fontStyle: "italic" }}>
                  Không có dữ liệu bài thi
                </BasicTypography>
              )}
            </BasicStack>
          )}
        </>
      }
    />
  );
};

export default ViewSpeakingWritingExamDialog;
