import { ExamTermSession } from "@/services/types/exam";
import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

interface QuestionCardProps {
  session: ExamTermSession;
  currentExam: any;
  currentQuestion: any;
  progress: number;
  onAnswerChange: (
    questionId: number,
    answerId: number,
    isChecked?: boolean,
  ) => void;
}

export default function QuestionCard({
  session,
  currentExam,
  currentQuestion,
  progress,
  onAnswerChange,
}: QuestionCardProps) {
  return (
    <>
      {/* Progress Card */}
      <Card
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
        elevation={2}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={{ xs: 2, sm: 0 }}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight="bold">
              Question {session.currentQuestionIndex + 1} of{" "}
              {currentExam.questions.length}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: "rgba(255,255,255,0.2)",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#4caf50",
                borderRadius: 6,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={{ xs: 2, sm: 0 }}
            sx={{ mb: 3 }}
          >
            <Typography variant="h5" fontWeight="medium">
              {currentQuestion.questionText}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Answer Options */}
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel
              component="legend"
              sx={{
                fontSize: "1.1rem",
                fontWeight: "medium",
                mb: 2,
                color: "text.primary",
              }}
            >
              Select your answer:
            </FormLabel>

            {session.currentExamType === "READING" ||
            session.currentExamType === "LISTENING" ? (
              // Radio buttons for single answer questions
              <RadioGroup
                value={session.answers[currentQuestion.id]?.[0] || ""}
                onChange={(e) =>
                  onAnswerChange(currentQuestion.id, parseInt(e.target.value))
                }
              >
                {currentQuestion.answers.map((answer: any, index: number) => (
                  <Paper
                    key={answer.id}
                    elevation={
                      session.answers[currentQuestion.id]?.includes(
                        answer.id.toString(),
                      )
                        ? 2
                        : 0
                    }
                    sx={{
                      p: 2,
                      mb: 2,
                      border: "2px solid",
                      borderColor: session.answers[
                        currentQuestion.id
                      ]?.includes(answer.id.toString())
                        ? "primary.main"
                        : "divider",
                      borderRadius: 2,
                      transition: "all 0.2s",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "primary.light",
                        bgcolor: "action.hover",
                      },
                    }}
                    onClick={() =>
                      onAnswerChange(currentQuestion.id, answer.id)
                    }
                  >
                    <FormControlLabel
                      value={answer.id.toString()}
                      control={<Radio />}
                      label={
                        <Typography>
                          <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                          {answer.answerText}
                        </Typography>
                      }
                      sx={{ width: "100%", m: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            ) : (
              // Checkboxes for multiple answer questions (Writing/Speaking)
              <FormGroup>
                {currentQuestion.answers.map((answer: any, index: number) => (
                  <Paper
                    key={answer.id}
                    elevation={
                      session.answers[currentQuestion.id]?.includes(
                        answer.id.toString(),
                      )
                        ? 2
                        : 0
                    }
                    sx={{
                      p: 2,
                      mb: 2,
                      border: "2px solid",
                      borderColor: session.answers[
                        currentQuestion.id
                      ]?.includes(answer.id.toString())
                        ? "primary.main"
                        : "divider",
                      borderRadius: 2,
                      transition: "all 0.2s",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "primary.light",
                        bgcolor: "action.hover",
                      },
                    }}
                    onClick={() =>
                      onAnswerChange(
                        currentQuestion.id,
                        answer.id,
                        !session.answers[currentQuestion.id]?.includes(
                          answer.id.toString(),
                        ),
                      )
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            session.answers[currentQuestion.id]?.includes(
                              answer.id.toString(),
                            ) || false
                          }
                          onChange={(e) =>
                            onAnswerChange(
                              currentQuestion.id,
                              answer.id,
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label={
                        <Typography>
                          <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                          {answer.answerText}
                        </Typography>
                      }
                      sx={{ width: "100%", m: 0 }}
                    />
                  </Paper>
                ))}
              </FormGroup>
            )}
          </FormControl>
        </CardContent>
      </Card>
    </>
  );
}
