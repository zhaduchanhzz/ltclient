"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import PracticeQuestionCard from "./PracticeQuestionCard";
import { APP_ROUTE } from "@/consts/app-route";
import { useExamDetailQuery } from "@/services/apis/exam";
import { CircularProgress, Container, Paper, Typography, Box, useTheme } from "@mui/material";
import ExclusiveAudio from "@/components/common/ExclusiveAudio";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { ApiServerURL } from "@/utils/config";
import { API_PATH } from "@/consts/api-path";

type PracticeExamProps = {
  examId: string;
};

const PracticeExam = ({ examId }: PracticeExamProps) => {
  const router = useRouter();
  const theme = useTheme();
  const [answers, setAnswers] = useState<Record<number, any>>({});

  // Fetch exam details
  const { data, isLoading, error } = useExamDetailQuery(examId, true);

  // Extract exam data
  const examData = useMemo(() => {
    if (!data?.data) return null;
    return data.data;
  }, [data]);

  // Get exam type name for display
  const getExamTypeName = (type: string) => {
    switch (type) {
      case "LISTENING":
        return "Listening";
      case "READING":
        return "Reading";
      case "WRITING":
        return "Writing";
      case "SPEAKING":
        return "Speaking";
      default:
        return "Practice";
    }
  };

  // Get back route based on exam type
  const getBackRoute = (type: string) => {
    switch (type) {
      case "LISTENING":
        return APP_ROUTE.PRACTICE_LISTENING;
      case "READING":
        return APP_ROUTE.PRACTICE_READING;
      case "WRITING":
        return APP_ROUTE.PRACTICE_WRITING;
      case "SPEAKING":
        return APP_ROUTE.PRACTICE_SPEAKING;
      default:
        return APP_ROUTE.PRACTICE_DASHBOARD;
    }
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    // Store answers in localStorage for review
    localStorage.setItem(
      `practice_exam_${examId}_answers`,
      JSON.stringify(answers),
    );

    console.log("Submitting answers:", answers);
    console.log("Exam Type:", examData?.examType);

    // Navigate to unified review page
    router.push(`/practice/review/${examId}`);
  };

  if (isLoading) {
    return (
      <Container>
        <BasicBox
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            mt: 3,
          }}
        >
          <CircularProgress />
        </BasicBox>
      </Container>
    );
  }

  if (error || !examData) {
    return (
      <Container>
        <BasicBox sx={{ textAlign: "center", py: 4, mt: 3 }}>
          <BasicTypography variant="h6" color="error">
            Failed to load exam. Please try again.
          </BasicTypography>
          <BasicButton
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push(APP_ROUTE.PRACTICE_DASHBOARD)}
          >
            Back to Practice Dashboard
          </BasicButton>
        </BasicBox>
      </Container>
    );
  }

  if (!examData.questions || examData.questions.length === 0) {
    return (
      <Container>
        <BasicBox sx={{ textAlign: "center", py: 4, mt: 3 }}>
          <BasicTypography variant="h6" color="text.secondary">
            No questions available for this exam.
          </BasicTypography>
          <BasicButton
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push(getBackRoute(examData.examType))}
          >
            Back to {getExamTypeName(examData.examType)} Practice
          </BasicButton>
        </BasicBox>
      </Container>
    );
  }

  // Resolve audio src similar to real exam
  const resolveAudioSrc = (raw?: string) => {
    if (!raw) return undefined;
    if (raw.startsWith("http")) return raw;
    if (raw.startsWith("/audio/")) return `${ApiServerURL}${raw}`;
    return `${ApiServerURL}${API_PATH.DOWNLOAD_FILE}${raw}`;
  };

  const isReading = examData.examType === "READING";
  const isListening = examData.examType === "LISTENING";

  return (
    <Container>
      <BasicBox sx={{ mt: 3 }}>
        <BasicStack spacing={2}>
          {/* Header */}
          <BasicStack direction="row" alignItems="center" spacing={2}>
            <BasicTypography variant="h4" fontWeight="bold">
              {getExamTypeName(examData.examType)} Exam - ID: {examId}
            </BasicTypography>
            {examData.isNeedVip && (
              <BasicTypography
                variant="body2"
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: "warning.main",
                  color: "warning.contrastText",
                  borderRadius: 1,
                  fontWeight: "bold",
                }}
              >
                VIP Required
              </BasicTypography>
            )}
          </BasicStack>

          {/* Listening audio + instructions */}
          {isListening && (
            <BasicStack spacing={1}>
              {/* Audio player if available */}
              {resolveAudioSrc((examData as any).audioFile) && (
                <Paper sx={{ p: 1, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                    Listening Audio
                  </Typography>
                  <ExclusiveAudio
                    group="practice-listening"
                    src={resolveAudioSrc((examData as any).audioFile)!}
                    style={{ width: "100%" }}
                  />
                </Paper>
              )}

              {/* Instructions/description */}
              {examData.description && (
                <Paper sx={{ p: 1, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                    Instructions
                  </Typography>
                  <Box
                    sx={{ fontSize: "0.95rem", lineHeight: 1.6, "& img": { maxWidth: "100%" } }}
                    dangerouslySetInnerHTML={{ __html: examData.description }}
                  />
                </Paper>
              )}
            </BasicStack>
          )}

          {/* Reading split layout (passage left, questions right) */}
          {isReading ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ width: "100%" }}>
                {examData.title && (
                  <Paper sx={{ p: 1, mb: 1, bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                    <Box
                      sx={{ fontSize: "0.95rem", "& img": { maxWidth: "100%" } }}
                      dangerouslySetInnerHTML={{ __html: examData.title }}
                    />
                  </Paper>
                )}
                {examData.description && (
                  <Paper sx={{ p: 1, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                      Passage / Instructions
                    </Typography>
                    <Box
                      sx={{ fontSize: "0.95rem", lineHeight: 1.6, "& img": { maxWidth: "100%" } }}
                      dangerouslySetInnerHTML={{ __html: examData.description }}
                    />
                  </Paper>
                )}
              </Box>

              <Box sx={{ width: "100%" }}>
                <BasicStack spacing={1.5}>
                  {examData.questions.map((question: any, index: number) => (
                    <Paper key={question.id || index} sx={{ p: 1, border: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="caption" sx={{ mb: 1, color: theme.palette.primary.main, display: "block" }}>
                        Question {index + 1}
                      </Typography>
                      <PracticeQuestionCard
                        question={question}
                        index={index}
                        examType={examData.examType as "LISTENING" | "READING" | "WRITING" | "SPEAKING"}
                        onAnswerChange={(answer) => handleAnswerChange(question.id || index, answer)}
                      />
                    </Paper>
                  ))}
                </BasicStack>
              </Box>
            </Box>
          ) : (
            // Default layout (Listening/Writing/Speaking): questions list
            <BasicStack spacing={1.5}>
              {examData.questions.map((question: any, index: number) => (
                <Paper key={question.id || index} sx={{ p: 1, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="caption" sx={{ mb: 1, color: theme.palette.primary.main, display: "block" }}>
                    Question {index + 1}
                  </Typography>
                  <PracticeQuestionCard
                    question={question}
                    index={index}
                    examType={examData.examType as "LISTENING" | "READING" | "WRITING" | "SPEAKING"}
                    onAnswerChange={(answer) => handleAnswerChange(question.id || index, answer)}
                  />
                </Paper>
              ))}
            </BasicStack>
          )}

          {/* Submit button */}
          <BasicBox sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <BasicButton variant="contained" size="large" onClick={handleSubmit}>
              Nộp bài
            </BasicButton>
          </BasicBox>
        </BasicStack>
      </BasicBox>
    </Container>
  );
};

export default PracticeExam;
