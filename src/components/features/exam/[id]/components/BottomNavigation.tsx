import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { ExamTermSession, SimulationExam } from "@/services/types/exam";
import { CheckCircle } from "@mui/icons-material";

interface BottomNavigationProps {
  session: ExamTermSession;
  examsByType: Record<string, SimulationExam[]>;
  onNavigateToQuestion: (questionIndex: number) => void;
}

export default function BottomNavigation({
  session,
  examsByType,
  onNavigateToQuestion,
}: BottomNavigationProps) {
  const currentTypeExams = examsByType[session.currentExamType] || [];

  // Calculate global question index for all questions in current exam type
  const getGlobalQuestionIndex = (examIndex: number, questionIndex: number) => {
    let globalIndex = 0;

    for (let i = 0; i < examIndex; i++) {
      globalIndex += currentTypeExams[i].questions.length;
    }
    
    return globalIndex + questionIndex;
  };

  // Get questions with their global indices
  const allQuestions: Array<{
    question: any;
    examIndex: number;
    localIndex: number;
    globalIndex: number;
  }> = [];

  currentTypeExams.forEach((exam, examIndex) => {
    exam.questions.forEach((question, questionIndex) => {
      allQuestions.push({
        question,
        examIndex,
        localIndex: questionIndex,
        globalIndex: getGlobalQuestionIndex(examIndex, questionIndex),
      });
    });
  });

  const currentGlobalIndex = getGlobalQuestionIndex(
    session.currentExamIndex,
    session.currentQuestionIndex,
  );

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "background.paper",
        borderTop: 2,
        borderColor: "divider",
        zIndex: 1100,
      }}
    >
      <Box sx={{ p: 2, maxHeight: "200px", overflow: "auto" }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
          Điều hướng câu hỏi - {session.currentExamType}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
          {allQuestions.map(({ question, globalIndex }) => {
            const isAnswered =
              session.answers[question.id] &&
              session.answers[question.id].length > 0;
            const isCurrent = globalIndex === currentGlobalIndex;

            return (
              <Button
                key={`question-${question.id}`}
                variant={isCurrent ? "contained" : "outlined"}
                size="small"
                onClick={() => onNavigateToQuestion(globalIndex)}
                sx={{
                  minWidth: "40px",
                  width: "40px",
                  height: "40px",
                  p: 0,
                  position: "relative",
                  backgroundColor: isCurrent
                    ? "primary.main"
                    : isAnswered
                      ? "success.light"
                      : "background.paper",
                  color: isCurrent || isAnswered ? "white" : "text.primary",
                  borderColor: isAnswered ? "success.main" : "divider",
                  "&:hover": {
                    backgroundColor: isCurrent
                      ? "primary.dark"
                      : isAnswered
                        ? "success.main"
                        : "action.hover",
                  },
                }}
              >
                {globalIndex + 1}
                {isAnswered && !isCurrent && (
                  <CheckCircle
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      fontSize: 12,
                      color: "success.main",
                      backgroundColor: "background.paper",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </Button>
            );
          })}
        </Stack>
      </Box>
    </Paper>
  );
}
