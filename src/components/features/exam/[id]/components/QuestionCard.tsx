import {
  Flag,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { ExamTermSession } from "@/services/types/exam";

interface QuestionCardProps {
  session: ExamTermSession;
  currentExam: any;
  currentQuestion: any;
  flaggedQuestions: Set<number>;
  fontSize: string;
  progress: number;
  onAnswerChange: (questionId: number, answerId: number, isChecked?: boolean) => void;
  onToggleQuestionFlag: (questionId: number) => void;
}

export default function QuestionCard({
  session,
  currentExam,
  currentQuestion,
  flaggedQuestions,
  fontSize,
  progress,
  onAnswerChange,
  onToggleQuestionFlag,
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
            <Stack direction="row" spacing={1}>
              {flaggedQuestions.has(currentQuestion.id) && (
                <Chip
                  icon={<Flag />}
                  label="Flagged"
                  size="small"
                  color="warning"
                  sx={{ bgcolor: "#ff9800", color: "white" }}
                />
              )}
              <Chip
                label={`${Math.round(progress)}% Complete`}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
              />
            </Stack>
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
            <Typography
              variant="h5"
              fontWeight="medium"
              sx={{
                fontSize: {
                  xs:
                    fontSize === "small"
                      ? "1rem"
                      : fontSize === "large"
                        ? "1.3rem"
                        : "1.15rem",
                  md:
                    fontSize === "small"
                      ? "1.1rem"
                      : fontSize === "large"
                        ? "1.5rem"
                        : "1.25rem",
                },
                lineHeight: 1.6,
                flex: 1,
              }}
            >
              {currentQuestion.questionText}
            </Typography>
            <Tooltip title="Flag this question for review">
              <IconButton
                onClick={() => onToggleQuestionFlag(currentQuestion.id)}
                color={
                  flaggedQuestions.has(currentQuestion.id)
                    ? "warning"
                    : "default"
                }
                sx={{
                  ml: { xs: 0, sm: 2 },
                  alignSelf: { xs: "flex-end", sm: "flex-start" },
                }}
              >
                <Flag />
              </IconButton>
            </Tooltip>
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
                  onAnswerChange(
                    currentQuestion.id,
                    parseInt(e.target.value),
                  )
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
                        <Typography
                          sx={{
                            fontSize: {
                              xs:
                                fontSize === "small"
                                  ? "0.85rem"
                                  : fontSize === "large"
                                    ? "1rem"
                                    : "0.9rem",
                              md:
                                fontSize === "small"
                                  ? "0.9rem"
                                  : fontSize === "large"
                                    ? "1.1rem"
                                    : "1rem",
                            },
                          }}
                        >
                          <strong>
                            {String.fromCharCode(65 + index)}.
                          </strong>{" "}
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
                        <Typography
                          sx={{
                            fontSize: {
                              xs:
                                fontSize === "small"
                                  ? "0.85rem"
                                  : fontSize === "large"
                                    ? "1rem"
                                    : "0.9rem",
                              md:
                                fontSize === "small"
                                  ? "0.9rem"
                                  : fontSize === "large"
                                    ? "1.1rem"
                                    : "1rem",
                            },
                          }}
                        >
                          <strong>
                            {String.fromCharCode(65 + index)}.
                          </strong>{" "}
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