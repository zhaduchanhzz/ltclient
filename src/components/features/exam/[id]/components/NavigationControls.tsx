import {
  CheckCircle,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Send,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ExamTermSession, SimulationExam } from "@/services/types/exam";

interface NavigationControlsProps {
  session: ExamTermSession;
  currentExam: SimulationExam;
  examsByType: Record<string, SimulationExam[]>;
  examTypes: Array<"LISTENING" | "READING" | "WRITING" | "SPEAKING">;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onCompleteSection: (examType: string) => void;
  onShowExamResults: () => void;
  onSubmitWritingExam?: () => void;
  onSubmitFinalSpeaking?: () => void;
}

export default function NavigationControls({
  session,
  currentExam,
  examsByType,
  examTypes,
  onPreviousQuestion,
  onNextQuestion,
  onCompleteSection,
  onShowExamResults,
  onSubmitWritingExam,
  onSubmitFinalSpeaking,
}: NavigationControlsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const currentTypeIndex = examTypes.indexOf(session.currentExamType);
  const isLastExamType = currentTypeIndex >= examTypes.length - 1;
  const currentTypeExams = examsByType[session.currentExamType] || [];
  const isLastPartInType =
    session.currentExamIndex >= currentTypeExams.length - 1;
  const isLastQuestion =
    session.currentQuestionIndex >= currentExam.questions.length - 1;
  const isLastQuestionOfSection = isLastPartInType && isLastQuestion;

  const isPreviousDisabled =
    session.currentExamType === examTypes[0] &&
    session.currentExamIndex === 0 &&
    session.currentQuestionIndex === 0;

  const renderActionButton = () => {
    if (isLastExamType && isLastQuestionOfSection) {
      // Last question of last section (SPEAKING) - show "Hoàn thành bài thi" instead
      if (session.currentExamType === "SPEAKING" && onSubmitFinalSpeaking) {
        return (
          <Button
            variant="contained"
            color="success"
            onClick={onSubmitFinalSpeaking}
            endIcon={<Send />}
            size={isMobile ? "medium" : "large"}
            fullWidth={isMobile}
            sx={{ px: { xs: 2, md: 4 } }}
          >
            Hoàn thành bài thi
          </Button>
        );
      } else {
        // Fallback for other exam types (shouldn't normally reach here)
        return (
          <Button
            variant="contained"
            color="success"
            onClick={onShowExamResults}
            endIcon={<Send />}
            size={isMobile ? "medium" : "large"}
            fullWidth={isMobile}
            sx={{ px: { xs: 2, md: 4 } }}
          >
            Xem kết quả
          </Button>
        );
      }
    } else if (isLastQuestionOfSection) {
      // Last question of current section - handle differently for WRITING vs others
      if (session.currentExamType === "WRITING" && onSubmitWritingExam) {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmitWritingExam}
            endIcon={<CheckCircle />}
            size={isMobile ? "medium" : "large"}
            fullWidth={isMobile}
            sx={{ px: { xs: 2, md: 4 } }}
          >
            Hoàn thành WRITING
          </Button>
        );
      } else if (session.currentExamType === "SPEAKING") {
        // For speaking (non-final questions), show complete section button
        return (
          <Button
            variant="contained"
            color="success"
            onClick={() => onCompleteSection(session.currentExamType)}
            endIcon={<CheckCircle />}
            size={isMobile ? "medium" : "large"}
            fullWidth={isMobile}
            sx={{ px: { xs: 2, md: 4 } }}
          >
            Hoàn thành SPEAKING
          </Button>
        );
      } else {
        // For LISTENING/READING - complete section
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onCompleteSection(session.currentExamType)}
            endIcon={<CheckCircle />}
            size={isMobile ? "medium" : "large"}
            fullWidth={isMobile}
            sx={{ px: { xs: 2, md: 4 } }}
          >
            Hoàn thành {session.currentExamType}
          </Button>
        );
      }
    } else {
      // Regular next question - special handling for last speaking question
      if (
        session.currentExamType === "SPEAKING" &&
        isLastExamType &&
        isLastQuestion &&
        !isLastPartInType
      ) {
        // This shouldn't happen based on current logic, but keeping for safety
        return (
          <Button
            variant="contained"
            onClick={onNextQuestion}
            endIcon={<KeyboardArrowRight />}
            size={isMobile ? "medium" : "large"}
            fullWidth={isMobile}
            sx={{ px: { xs: 2, md: 4 } }}
          >
            Câu tiếp theo
          </Button>
        );
      } else {
        // Regular next question
        return (
          <Button
            variant="contained"
            onClick={onNextQuestion}
            endIcon={<KeyboardArrowRight />}
            size={isMobile ? "medium" : "large"}
            fullWidth={isMobile}
            sx={{ px: { xs: 2, md: 4 } }}
          >
            Câu tiếp theo
          </Button>
        );
      }
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={{ xs: 2, sm: 0 }}
        >
          <Button
            variant="outlined"
            onClick={onPreviousQuestion}
            startIcon={<KeyboardArrowLeft />}
            disabled={isPreviousDisabled}
            size={isMobile ? "medium" : "large"}
            fullWidth={isMobile}
          >
            Câu trước
          </Button>

          <Stack
            direction="row"
            spacing={2}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {renderActionButton()}

            {/* Section complete button - conditionally rendered based on exam type */}
            {session.currentExamType !== examTypes[examTypes.length - 1] && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  if (
                    session.currentExamType === "WRITING" &&
                    onSubmitWritingExam
                  ) {
                    onSubmitWritingExam();
                  } else {
                    onCompleteSection(session.currentExamType);
                  }
                }}
                startIcon={<CheckCircle />}
                size={isMobile ? "small" : "medium"}
                sx={{
                  px: { xs: 1, md: 2 },
                  display: { xs: "none", sm: "flex" }, // Hide on mobile to save space
                }}
              >
                Hoàn thành phần thi
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
