"use client";

import { useGradingRequestMutation } from "@/services/apis/exam";
import {
  AccessTime,
  Assignment,
  CheckCircle,
  Create,
  Headphones,
  MenuBook,
  Mic,
  PlayArrow,
  Quiz,
  School,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  LinearProgress,
  Paper,
  Slide,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ExamHeader from "./components/ExamHeader";
import QuestionCard from "./components/QuestionCard";
import { useExamLogic } from "./hooks/useExamLogic";
import { API_PATH } from "@/consts/api-path";
import { ApiServerURL } from "@/utils/config";
import { useAppContextHandle } from "@/contexts/AppContext";

const EXAM_TIME_LIMITS = {
  LISTENING: 47,
  READING: 60,
  WRITING: 60,
  SPEAKING: 12,
};

const ExamTypeIcons = {
  LISTENING: Headphones,
  READING: MenuBook,
  WRITING: Create,
  SPEAKING: Mic,
};

const ExamTypeColors = {
  LISTENING: "#2196f3",
  READING: "#4caf50",
  WRITING: "#ff9800",
  SPEAKING: "#9c27b0",
};

export default function ExamPage() {
  const {
    isLoading,
    error,
    session,
    examsByType,
    examTypes,
    allExams,
    showSuccessDialog,
    examExpired,
    currentSectionTimeRemaining,
    getCurrentExamAndQuestion,
    router,
    startExam,
    handleAnswerChange,
    handleWritingAnswerChange,
    handleSpeakingAnswerChange,
    submitAllExams,
  } = useExamLogic();

  const { updateAppState } = useAppContextHandle();
  const gradingRequestMutation = useGradingRequestMutation();
  const [gradingProgress, setGradingProgress] = useState<{
    isGrading: boolean;
    current: number;
    total: number;
    currentExamType?: string;
  }>({ isGrading: false, current: 0, total: 0 });

  // Track per-exam grading requests (loading state)
  const [requestingExamIds, setRequestingExamIds] = useState<number[]>([]);

  const requestGradingForExam = async (examId: number) => {

    if (!session?.termId || !examId) return;

    try {
      setRequestingExamIds((prev) => [...new Set([...prev, examId])]);
      await gradingRequestMutation.mutateAsync({ termId: session.termId, examId });
      updateAppState({ appAlertInfo: { message: `Đã gửi yêu cầu chấm điểm cho Exam #${examId}`, severity: "success" } });
    } catch (e) {
      console.error("Failed to request grading for exam", examId, e);
      updateAppState({ appAlertInfo: { message: `Gửi yêu cầu chấm điểm thất bại cho Exam #${examId}. Vui lòng thử lại.`, severity: "error" } });
    } finally {
      setRequestingExamIds((prev) => prev.filter((id) => id !== examId));
    }
  };

  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionDialog, setSubmissionDialog] = useState<{
    open: boolean;
    success: boolean;
    message: string;
    failedTypes?: string[];
    partial?: boolean;
    details?: any[];
  }>({ open: false, success: false, message: "" });

  // Get all exams in a flat array
  const allExamsFlat = useMemo(() => {
    const result: any[] = [];
    examTypes.forEach((examType) => {
      const typeExams = examsByType[examType] || [];
      typeExams.forEach((exam) => {
        result.push(exam);
      });
    });
    return result;
  }, [examTypes, examsByType]);

  // Helper to identify manual-graded exam types (no immediate score)
  const isManualGraded = (type?: string) => type === "WRITING" || type === "SPEAKING";

  // Track current exam part index (instead of individual questions)
  const [currentExamPartIndex, setCurrentExamPartIndex] = useState(0);

  // Refs and state to manage scroll behavior per part
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionsRef = useRef<Record<number, { left: number; right: number }>>({});
  const visitedPartsRef = useRef<Set<number>>(new Set([0]));

  // Get current exam part
  const currentExamPart = allExamsFlat[currentExamPartIndex];

  // Restore or reset scroll when switching parts
  useEffect(() => {
    const left = leftPanelRef.current;
    const right = rightPanelRef.current;
    const saved = scrollPositionsRef.current[currentExamPartIndex];

    const apply = () => {
      if (saved) {
        if (left) left.scrollTop = saved.left || 0;
        if (right) right.scrollTop = saved.right || 0;
      } else {
        if (left) left.scrollTop = 0;
        if (right) right.scrollTop = 0;
      }

      visitedPartsRef.current.add(currentExamPartIndex);
    };

    // Wait for content to render before scrolling
    const id = window.setTimeout(apply, 0);
    return () => window.clearTimeout(id);
  }, [currentExamPartIndex]);

  const handleLeftScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const pos = scrollPositionsRef.current[currentExamPartIndex] || { left: 0, right: 0 };
    pos.left = e.currentTarget.scrollTop;
    scrollPositionsRef.current[currentExamPartIndex] = pos;
  };

  const handleRightScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const pos = scrollPositionsRef.current[currentExamPartIndex] || { left: 0, right: 0 };
    pos.right = e.currentTarget.scrollTop;
    scrollPositionsRef.current[currentExamPartIndex] = pos;
  };

  // Calculate global question offset for continuous numbering
  const getGlobalQuestionOffset = useMemo(() => {
    let offset = 0;

    for (let i = 0; i < currentExamPartIndex; i++) {
      if (allExamsFlat[i]) {
        offset += allExamsFlat[i].questions.length;
      }
    }

    return offset;
  }, [currentExamPartIndex, allExamsFlat]);

  const calculateExamResultsByType = () => {
    if (!session || !allExams) return {};

    // Group exams by type
    const examsByTypeResults = examTypes.reduce(
      (acc, examType) => {
        const typeExams = allExams.filter((exam) => exam.examType === examType);

        if (typeExams.length === 0) return acc;

        let correctAnswers = 0;
        let totalQuestions = 0;
        let status = "Completed";

        typeExams.forEach((exam) => {
          exam.questions.forEach((question) => {
            totalQuestions++;

            const userAnswers = session.answers[question.id] || [];

            if (examType === "LISTENING" || examType === "READING") {
              // Multiple choice questions - calculate score
              const correctAnswerIds = question.answers
                .filter((answer) => answer.isCorrect)
                .map((answer) => answer.id.toString());

              const userAnswerSet = new Set(userAnswers);
              const correctAnswerSet = new Set(correctAnswerIds);

              const isCorrect =
                userAnswerSet.size === correctAnswerSet.size &&
                [...userAnswerSet].every((answer) =>
                  correctAnswerSet.has(answer),
                );

              if (isCorrect) {
                correctAnswers++;
              }
            } else if (examType === "WRITING" || examType === "SPEAKING") {
              // For writing/speaking, just check if answered
              if (userAnswers.length > 0) {
                correctAnswers++; // Count as "answered" not "correct"
              }
              // TODO: Check if the exam is already graded

              status = "Pending Grading";
            }
          });
        });

        const percentage =
          totalQuestions > 0
            ? Math.round((correctAnswers / totalQuestions) * 100)
            : 0;

        acc[examType] = {
          correct: correctAnswers,
          total: totalQuestions,
          percentage:
            examType === "WRITING" || examType === "SPEAKING" ? 0 : percentage,
          status,
        };

        return acc;
      },
      {} as Record<
        string,
        { correct: number; total: number; percentage: number; status: string }
      >,
    );

    return examsByTypeResults;
  };

  const examResultsByType = calculateExamResultsByType();

  const handleGradingRequest = async () => {
    if (!session?.termId || !allExams) return;

    // Find all WRITING and SPEAKING exams that need grading
    const gradableExams = allExams.filter(
      (exam) => exam.examType === "WRITING" || exam.examType === "SPEAKING",
    );

    if (gradableExams.length === 0) {
      updateAppState({ appAlertInfo: { message: "Không có phần thi nào cần chấm điểm.", severity: "info" } });
      return;
    }

    // Initialize progress
    setGradingProgress({
      isGrading: true,
      current: 0,
      total: gradableExams.length,
    });

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Submit grading request for each WRITING and SPEAKING exam
    for (let i = 0; i < gradableExams.length; i++) {
      const exam = gradableExams[i];

      // Update progress
      setGradingProgress({
        isGrading: true,
        current: i + 1,
        total: gradableExams.length,
        currentExamType: exam.examType,
      });

      try {
        await gradingRequestMutation.mutateAsync({
          termId: session.termId,
          examId: exam.id,
        });
        successCount++;
      } catch (error) {
        failedCount++;
        errors.push(`${exam.examType} exam (ID: ${exam.id})`);
        console.error(
          `Failed to submit grading request for ${exam.examType}:`,
          error,
        );
      }
    }

    // Reset progress
    setGradingProgress({
      isGrading: false,
      current: 0,
      total: 0,
    });

    // Show result message and redirect
    if (successCount > 0 && failedCount === 0) {
      updateAppState({ appAlertInfo: { message: `Đã gửi ${successCount} yêu cầu chấm điểm thành công!`, severity: "success" } });
      // Redirect to homepage after successful grading request
      router.push("/");
    } else if (successCount > 0 && failedCount > 0) {
      updateAppState({ appAlertInfo: { message: `Gửi yêu cầu chấm điểm: thành công ${successCount}, thất bại ${failedCount}.`, severity: "warning" } });
      // Redirect to homepage even with partial success
      router.push("/");
    } else {
      updateAppState({ appAlertInfo: { message: "Gửi yêu cầu chấm điểm thất bại. Vui lòng thử lại.", severity: "error" } });
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading exam...</Typography>
      </Container>
    );
  }

  if (examExpired) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #f44336 0%, #e91e63 100%)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Box>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 2,
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <AccessTime sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Exam Not Available
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              This exam session is not available. Please start a new exam
              session from the exam room.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/exam/room")}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              Go to Exam Room
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (error) {
    console.error("Error loading exams:", error);
    return (
      <Container sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Alert severity="error">
          Failed to load exam data. Please try again.
        </Alert>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Quiz sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" gutterBottom fontWeight="bold">
                VSTEP Exam
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Nhận đề thi thử với tất cả các phần thi VSTEP
              </Typography>

              <Grid2 container spacing={3} sx={{ mb: 4 }}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <AccessTime sx={{ color: "#4caf50" }} />
                        <Typography variant="h6" color="white">
                          Thời gian thi
                        </Typography>
                      </Stack>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {Object.values(EXAM_TIME_LIMITS).reduce(
                          (a, b) => a + b,
                          0,
                        )}{" "}
                        phút
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <Assignment sx={{ color: "#2196f3" }} />
                        <Typography variant="h6" color="white">
                          Tổng số phần thi
                        </Typography>
                      </Stack>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {allExams.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>
              </Grid2>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="medium">
                  Các phần thi:
                </Typography>
                <Grid2 container spacing={2}>
                  {examTypes.map((examType, index) => {
                    const parts = examsByType[examType] || [];
                    const Icon = ExamTypeIcons[examType];
                    const color = ExamTypeColors[examType];
                    return (
                      <Grid2 key={examType} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Zoom
                          in={true}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <Card
                            sx={{
                              bgcolor: "rgba(255,255,255,0.15)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                bgcolor: "rgba(255,255,255,0.2)",
                              },
                            }}
                          >
                            <CardContent sx={{ textAlign: "center", py: 3 }}>
                              <Avatar
                                sx={{
                                  bgcolor: color,
                                  width: 56,
                                  height: 56,
                                  mx: "auto",
                                  mb: 2,
                                }}
                              >
                                <Icon sx={{ fontSize: 28 }} />
                              </Avatar>
                              <Typography
                                variant="h6"
                                color="white"
                                fontWeight="medium"
                              >
                                {examType}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ opacity: 0.8, color: "white" }}
                              >
                                {parts.length} phần thi
                              </Typography>
                            </CardContent>
                          </Card>
                        </Zoom>
                      </Grid2>
                    );
                  })}
                </Grid2>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={startExam}
                disabled={allExams.length === 0}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  bgcolor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.3)",
                    transform: "translateY(-2px)",
                  },
                }}
                startIcon={<PlayArrow />}
              >
                Bắt đầu thi
              </Button>

              {allExams.length === 0 && (
                <Alert
                  severity="warning"
                  sx={{
                    mt: 3,
                    bgcolor: "rgba(255,152,0,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,152,0,0.3)",
                  }}
                >
                  No exam parts available. Please check back later.
                </Alert>
              )}
            </Box>
          </Paper>
        </Slide>
      </Container>
    );
  }

  // Exam results dialog
  if (showSuccessDialog) {
    return (
      <Dialog open={showSuccessDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircle color="success" />
            Đã hoàn thành bài thi!
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, color: "black" }}>
            Bài thi của bạn đã được hoàn thành với ID:{" "}
            <strong>{session?.termId}</strong>
          </Typography>

          {/* Exam Results by Type */}
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: "bold", color: "black" }}
          >
            Kết quả bài thi
          </Typography>

          <Grid2 container spacing={2} sx={{ mb: 3 }}>
            {examTypes.map((examType) => {
              const results = examResultsByType[examType];
              if (!results) return null;

              const Icon = ExamTypeIcons[examType];
              const color = ExamTypeColors[examType];

              const getScoreColor = () => {
                if (examType === "WRITING" || examType === "SPEAKING")
                  return "black";
                if (results.percentage >= 70) return "green";
                if (results.percentage >= 50) return "orange";
                return "red";
              };

              return (
                <Grid2 key={examType} size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={{ p: 2, border: `2px solid ${color}`, borderRadius: 2 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{ bgcolor: color, mr: 2, width: 40, height: 40 }}
                      >
                        <Icon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "black" }}
                      >
                        {examType}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "center" }}>
                      {examType === "LISTENING" || examType === "READING" ? (
                        <>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: "bold",
                              color: getScoreColor(),
                              mb: 1,
                            }}
                          >
                            {results.correct}/{results.total}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ color: "black", mb: 1 }}
                          >
                            {results.percentage}% Đúng
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "green", fontWeight: "medium" }}
                          >
                            {results.status}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography
                            variant="h5"
                            sx={{ color: "black", mb: 1 }}
                          >
                            {results.correct}/{results.total}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "orange", fontWeight: "medium" }}
                          >
                            Yêu cầu chấm điểm để nhận kết quả
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Card>
                </Grid2>
              );
            })}
          </Grid2>

          <Typography variant="body2" sx={{ mb: 3, color: "black" }}>
            Câu trả lời của bạn đã được ghi nhận. Bạn có thể yêu cầu chấm điểm
            cho các phần thi viết và nói.
          </Typography>

          <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: "medium", color: "black" }}
            >
              Các bước tiếp theo:
            </Typography>
            <Typography variant="body2" sx={{ color: "black" }}>
              • Yêu cầu chấm điểm để nhận phản hồi cá nhân cho các phần thi viết
              và nói • Quay lại phòng thi để làm thêm bài thi thử
            </Typography>
          </Box>

          {gradingProgress.isGrading && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: "info.main", fontWeight: "medium" }}
              >
                Đang gửi yêu cầu chấm điểm cho bài thi{" "}
                {gradingProgress.currentExamType}...
              </Typography>
              <Typography variant="caption" sx={{ color: "info.main" }}>
                Tiến trình: {gradingProgress.current}/{gradingProgress.total}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(gradingProgress.current / gradingProgress.total) * 100}
                sx={{ mt: 1 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => router.push("/exam/room")}
            variant="outlined"
            fullWidth
          >
            Quay lại phòng thi
          </Button>
          <Button
            onClick={handleGradingRequest}
            variant="contained"
            startIcon={<School />}
            disabled={gradingProgress.isGrading}
            fullWidth
            sx={{ fontSize: "0.9rem" }}
          >
            {gradingProgress.isGrading
              ? `Đang gửi yêu cầu... (${gradingProgress.current}/${gradingProgress.total})`
              : "Yêu cầu chấm điểm"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const { exam: currentExam, question: currentQuestion } =
    getCurrentExamAndQuestion();

  if (!currentExam || !currentQuestion) {
    return (
      <Container>
        <Alert severity="error">
          Failed to load exam data. Current exam type: {session.currentExamType}
          , Exam index: {session.currentExamIndex}, Question index:{" "}
          {session.currentQuestionIndex}
        </Alert>
      </Container>
    );
  }

  // Calculate answered questions for current exam part
  const calculateCurrentPartAnswered = () => {
    if (!session || !currentExamPart) return { answered: 0, total: 0 };

    let answered = 0;
    const total = currentExamPart.questions.length;

    currentExamPart.questions.forEach((question: any) => {
      const userAnswers = session.answers[question.id];

      if (userAnswers && userAnswers.length > 0) {
        answered++;
      }
    });

    return { answered, total };
  };

  const { answered: partAnswered, total: partTotal } =
    calculateCurrentPartAnswered();

  // Calculate total answered across all parts
  const calculateAllAnswered = () => {
    if (!session) return { answered: 0, total: 0 };

    let answered = 0;
    let total = 0;

    allExamsFlat.forEach((exam) => {
      exam.questions.forEach((question: any) => {
        total++;
        const userAnswers = session.answers[question.id];

        if (userAnswers && userAnswers.length > 0) {
          answered++;
        }
      });
    });

    return { answered, total };
  };

  const { answered: totalAnswered, total: totalQuestions } =
    calculateAllAnswered();

  // Navigation functions
  const navigateToPreviousPart = () => {
    if (currentExamPartIndex > 0) {
      setCurrentExamPartIndex(currentExamPartIndex - 1);
    }
  };

  const navigateToNextPart = () => {
    if (currentExamPartIndex < allExamsFlat.length - 1) {
      setCurrentExamPartIndex(currentExamPartIndex + 1);
    }
  };

  const navigateToPart = (index: number) => {
    setCurrentExamPartIndex(index);
  };

  // Handle exam submission
  const handleSubmitAllAnswers = async () => {
    setIsSubmitting(true);

    try {
      const result = await submitAllExams();

      if (result.success) {
        // Success - show success dialog with details
        setSubmissionDialog({
          open: true,
          success: true,
          message: result.message || "Exam submitted successfully!",
          failedTypes: [],
          details: Array.isArray(result.details) ? result.details : result.details ? [result.details] : [],
        });
      } else {
        // Error - show error dialog with links
        setSubmissionDialog({
          open: true,
          success: false,
          message: result.error || "Failed to submit exam",
          failedTypes: result.failedTypes || [],
          partial: result.partial,
          details: Array.isArray(result.details) ? result.details : result.details ? [result.details] : [],
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionDialog({
        open: true,
        success: false,
        message: "An unexpected error occurred during submission",
        failedTypes: ["WRITING", "SPEAKING"], // Show both links on unexpected error
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentExamPart) {
    return (
      <Container>
        <Alert severity="error">No exam part available.</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Top Header */}
      <ExamHeader
        session={session}
        currentSectionTimeRemaining={currentSectionTimeRemaining}
        answeredCount={totalAnswered}
        totalCount={totalQuestions}
      />

      {/* Part Navigation Bar */}
      <Paper
        elevation={2}
        sx={{
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Part {currentExamPartIndex + 1} of {allExamsFlat.length}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={navigateToPreviousPart}
            disabled={currentExamPartIndex === 0}
          >
            Previous Part
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={navigateToNextPart}
            disabled={currentExamPartIndex === allExamsFlat.length - 1}
          >
            Next Part
          </Button>
        </Box>
      </Paper>

      {/* Two-Panel Layout */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          height: "calc(100vh - 120px)", // Adjust based on header height
        }}
      >
        {/* Left Panel - Title & Content */}
        <Box
          ref={leftPanelRef}
          onScroll={handleLeftScroll}
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: "40%", md: "100%" },
            overflow: "auto",
            borderRight: { md: "1px solid" },
            borderBottom: { xs: "1px solid", md: "none" },
            borderColor: "divider",
            bgcolor: "background.paper",
            p: 3,
          }}
        >
          {/* Part Header - Sticky */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              bgcolor:
                ExamTypeColors[
                  currentExamPart.examType as keyof typeof ExamTypeColors
                ] || "#grey",
              color: "white",
              position: "sticky",
              top: 0,
              zIndex: 10,
              borderRadius: 2,
            }}
          >
            {currentExamPart.title ? (
              <Box
                sx={{ fontSize: "1rem", "& img": { maxWidth: "100%", height: "auto" } }}
                dangerouslySetInnerHTML={{ __html: currentExamPart.title }}
              />
            ) : (
              <Typography sx={{ fontSize: "1rem" }}>
                {`${currentExamPart.examType} - Part ${currentExamPartIndex + 1}`}
              </Typography>
            )}
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              Questions {getGlobalQuestionOffset + 1} -{" "}
              {getGlobalQuestionOffset + currentExamPart.questions.length} •
              {partAnswered} of {partTotal} answered
            </Typography>
          </Paper>

          {/* Listening media (if available) */}
          {currentExamPart.examType === "LISTENING" && currentExamPart.audioFile && (
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography sx={{ mb: 2, fontSize: "1rem" }}>
                Listening Audio
              </Typography>
              <Stack spacing={2}>
                <audio controls style={{ width: "100%" }}>
                  <source src={ApiServerURL + API_PATH.DOWNLOAD_FILE + currentExamPart.audioFile} />
                  Your browser does not support the audio element.
                </audio>
              </Stack>
            </Paper>
          )}

          {/* Part Description / Content */}
          {currentExamPart.description && (
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography sx={{ mb: 2, fontSize: "1rem" }}>
                Instructions / Reading Passage
              </Typography>
              <Box
                sx={{
                  lineHeight: 1.8,
                  "& img": { maxWidth: "100%", height: "auto" },
                  "& blockquote": { borderLeft: "4px solid", borderLeftColor: "divider", pl: 2, ml: 0 },
                }}
                dangerouslySetInnerHTML={{ __html: currentExamPart.description }}
              />
            </Paper>
          )}

          {/* Additional content area for reading passages if needed */}
          {currentExamPart.examType === "READING" &&
            !currentExamPart.description && (
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Reading passage will appear here when available
                </Typography>
              </Paper>
            )}
        </Box>

        {/* Right Panel - Questions */}
        <Box
          ref={rightPanelRef}
          onScroll={handleRightScroll}
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: "60%", md: "100%" },
            overflow: "auto",
            bgcolor: "background.default",
            p: 0,
          }}
        >
          <Box sx={{ p: 3 }}>
            {/* Questions for current exam part */}
            {currentExamPart.questions.map((question: any, index: number) => {
              const globalQuestionNumber = getGlobalQuestionOffset + index + 1;

              return (
                <Paper
                  key={`question-${question.id}`}
                  id={`question-${index}`}
                  elevation={1}
                  sx={{
                    p: 3,
                    mb: 3,
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography
                    sx={{
                      mb: 2,
                      color: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    Question {globalQuestionNumber}
                  </Typography>
                  <QuestionCard
                    session={session}
                    currentExam={currentExamPart}
                    currentQuestion={question}
                    questionNumber={globalQuestionNumber}
                    examType={currentExamPart.examType}
                    onAnswerChange={handleAnswerChange}
                    onWritingAnswerChange={handleWritingAnswerChange}
                    onSpeakingAnswerChange={handleSpeakingAnswerChange}
                  />
                </Paper>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Navigation and Submit Button - Full width at bottom */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          width: "100%",
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={navigateToPreviousPart}
            disabled={currentExamPartIndex === 0}
          >
            ← Previous Part
          </Button>

          <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
            {allExamsFlat.map((exam, index) => {
              const Icon =
                ExamTypeIcons[exam.examType as keyof typeof ExamTypeIcons];
              const isCurrentPart = index === currentExamPartIndex;
              let questionsInPart = 0;
              let answeredInPart = 0;

              exam.questions.forEach((q: any) => {
                questionsInPart++;

                if (session.answers[q.id]?.length > 0) {
                  answeredInPart++;
                }
              });

              return (
                <Button
                  key={index}
                  variant={isCurrentPart ? "contained" : "outlined"}
                  color={isCurrentPart ? "primary" : "inherit"}
                  onClick={() => navigateToPart(index)}
                  startIcon={<Icon />}
                  sx={{ whiteSpace: "nowrap" }}
                  size="small"
                >
                  {`Part ${index + 1} (${answeredInPart}/${questionsInPart})`}
                </Button>
              );
            })}
          </Box>

          {currentExamPartIndex === allExamsFlat.length - 1 ? (
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={handleSubmitAllAnswers}
              disabled={isSubmitting}
              sx={{ px: 4 }}
            >
              {isSubmitting ? "Submitting..." : "Submit All Answers"}
            </Button>
          ) : (
            <Button variant="contained" onClick={navigateToNextPart}>
              Next Part →
            </Button>
          )}
        </Box>
      </Paper>

      {/* Part Navigator Sidebar (converted to horizontal bar above bottom controls) */}
      {/* Removed fixed right sidebar to use a horizontal navigator placed earlier in the layout. */}

      {/* Submission Result Dialog */}
      <Dialog 
        open={submissionDialog.open} 
        onClose={() => setSubmissionDialog({ ...submissionDialog, open: false })}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {submissionDialog.success ? (
              <CheckCircle color="success" />
            ) : (
              <AccessTime color="error" />
            )}
            {submissionDialog.success ? "Submission Successful" : "Submission Failed"}
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Render returned exam results for the student when available */}
          {submissionDialog.success && submissionDialog.details && submissionDialog.details.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                Kết quả chi tiết
              </Typography>
              <Stack spacing={2}>
                {submissionDialog.details.map((detail: any, idx: number) => {
                  const data = detail?.data ?? detail; // support both response.data or direct data
                  if (!data) return null;

                  // Case A: Old shape (per-exam summary with userResponses)
                  if (Array.isArray(data.userResponses)) {
                    const Icon = ExamTypeIcons[data.examType as keyof typeof ExamTypeIcons] || Quiz;
                    const color = ExamTypeColors[data.examType as keyof typeof ExamTypeColors] || "#1976d2";

                    return (
                      <Card key={idx} sx={{ borderLeft: `4px solid ${color}` }}>
                        <CardContent>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Avatar sx={{ bgcolor: color, width: 32, height: 32 }}>
                              <Icon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {data.examType}
                            </Typography>
                            {isManualGraded(data.examType) && (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                  Chưa được chấm điểm
                                </Typography>
                                {!!data.examId && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => requestGradingForExam(data.examId)}
                                    disabled={requestingExamIds.includes(data.examId) || gradingRequestMutation.isPending}
                                    sx={{ textTransform: "none" }}
                                  >
                                    {requestingExamIds.includes(data.examId) ? "Đang yêu cầu..." : "Yêu cầu chấm"}
                                  </Button>
                                )}
                              </Stack>
                            )}
                          </Box>

                          {data.userResponses.length > 0 ? (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Câu trả lời của bạn:
                              </Typography>
                              <Stack spacing={1} sx={{ maxHeight: 260, overflowY: "auto" }}>
                                {data.userResponses.map((ur: any, i: number) => (
                                  <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: .5 }}>
                                      Q{ur.questionId}: {ur.questionText}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: .5 }}>
                                      Trả lời: {ur.content}
                                    </Typography>
                                    {!isManualGraded(data.examType) && typeof ur.score !== "undefined" && (
                                      <Typography variant="caption" color={ur.score > 0 ? "success.main" : "error.main"}>
                                        Điểm: {ur.score}
                                      </Typography>
                                    )}
                                    {ur.submittedAt && (
                                      <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                                        Nộp lúc: {new Date(ur.submittedAt).toLocaleString()}
                                      </Typography>
                                    )}
                                  </Paper>
                                ))}
                              </Stack>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                              Chưa có dữ liệu câu trả lời.
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    );
                  }

                  // Case B: New shape (term detail with exams -> questions -> answers)
                  if (Array.isArray(data.exams)) {
                    return (
                      <Card key={idx} sx={{ borderLeft: "4px solid #1976d2" }}>
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                            Kỳ thi #{data.termId} • Người dùng #{data.userId} • {new Date(data.createdAt).toLocaleString()}
                          </Typography>

                          <Stack spacing={2} sx={{ maxHeight: 360, overflowY: "auto" }}>
                            {data.exams.map((exam: any, eIdx: number) => {
                              const Icon = ExamTypeIcons[exam.examType as keyof typeof ExamTypeIcons] || Quiz;
                              const color = ExamTypeColors[exam.examType as keyof typeof ExamTypeColors] || "#1976d2";
                              return (
                                <Box key={eIdx}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Avatar sx={{ bgcolor: color, width: 28, height: 28 }}>
                                      <Icon sx={{ fontSize: 16 }} />
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 700 }}>
                                      {exam.examType} {exam.title ? `• ${exam.title}` : ""}
                                    </Typography>
                                  </Box>
                                  <Stack spacing={1.5}>
                                    {exam.questions.map((q: any, qIdx: number) => (
                                      <Paper key={q.id ?? qIdx} variant="outlined" sx={{ p: 1.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: .5 }}>
                                          Q{qIdx + 1}: <span dangerouslySetInnerHTML={{ __html: q.questionText }} />
                                        </Typography>
                                        <Stack spacing={.5}>
                                          {q.answers.map((ans: any) => (
                                            <Typography key={ans.id} variant="body2" sx={{ color: ans.isCorrect ? "success.main" : "text.primary" }}>
                                              {ans.isCorrect ? "✔ " : "• "}{ans.answerText}
                                            </Typography>
                                          ))}
                                        </Stack>
                                      </Paper>
                                    ))}
                                  </Stack>
                                </Box>
                              );
                            })}
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  }

                  // Case C: Unified bulk submit summary items (no answers)
                  if (
                    typeof data.selectedTrue === "number" &&
                    typeof data.totalQuestion === "number" &&
                    typeof data.examType === "string"
                  ) {
                    const Icon = ExamTypeIcons[data.examType as keyof typeof ExamTypeIcons] || Quiz;
                    const color = ExamTypeColors[data.examType as keyof typeof ExamTypeColors] || "#1976d2";
                    const percentage = data.totalQuestion > 0 ? Math.round((data.selectedTrue / data.totalQuestion) * 100) : 0;
                    return (
                      <Card key={idx} sx={{ borderLeft: `4px solid ${color}` }}>
                        <CardContent>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Avatar sx={{ bgcolor: color, width: 32, height: 32 }}>
                              <Icon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {data.examType} • Exam #{data.examId}
                            </Typography>
                          </Box>
                          {isManualGraded(data.examType) ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body2" sx={{ mt: .5 }} color="text.primary">
                                Chưa được chấm điểm
                              </Typography>
                              {!!data.examId && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => requestGradingForExam(data.examId)}
                                  disabled={requestingExamIds.includes(data.examId) || gradingRequestMutation.isPending}
                                  sx={{ textTransform: "none" }}
                                >
                                  {requestingExamIds.includes(data.examId) ? "Đang yêu cầu..." : "Yêu cầu chấm"}
                                </Button>
                              )}
                            </Stack>
                          ) : (
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="h5" sx={{ fontWeight: 700 }} color={percentage >= 70 ? "success.main" : percentage >= 50 ? "warning.main" : "error.main"}>
                                {data.selectedTrue}/{data.totalQuestion}
                              </Typography>
                              <Typography variant="body1" color="text.primary">
                                ({percentage}%)
                              </Typography>
                              {typeof data.score === "number" && (
                                <Typography variant="body2" sx={{ ml: 1 }} color="text.primary">
                                  Điểm: {data.score}
                                </Typography>
                              )}
                            </Stack>
                          )}
                        </CardContent>
                      </Card>
                    );
                  }

                  // Fallback if shape is unknown
                  return null;
                })}
              </Stack>
            </Box>
          )}

          {/* Show links for failed exam types */}
          {!submissionDialog.success && submissionDialog.failedTypes && submissionDialog.failedTypes.length > 0 && (
            <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
                Please visit the following pages to resubmit:
              </Typography>
              <Stack spacing={1}>
                {submissionDialog.failedTypes.includes("WRITING") && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Create fontSize="small" color="primary" />
                    <Typography variant="body2">
                      Writing submissions:{" "}
                      <Button
                        size="small"
                        onClick={() => router.push("/user/writing")}
                        sx={{ textTransform: "none" }}
                      >
                        Go to Writing Page
                      </Button>
                    </Typography>
                  </Box>
                )}
                {submissionDialog.failedTypes.includes("SPEAKING") && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Mic fontSize="small" color="primary" />
                    <Typography variant="body2">
                      Speaking submissions:{" "}
                      <Button
                        size="small"
                        onClick={() => router.push("/user/speaking")}
                        sx={{ textTransform: "none" }}
                      >
                        Go to Speaking Page
                      </Button>
                    </Typography>
                  </Box>
                )}
                {(submissionDialog.failedTypes.includes("LISTENING") || 
                  submissionDialog.failedTypes.includes("READING")) && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Note: Listening and Reading exams have been automatically graded.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setSubmissionDialog({ ...submissionDialog, open: false });
              
              if (submissionDialog.success) {
                // Navigate to home or exam room after successful submission
                router.push("/");
              }
            }}
            variant="contained"
          >
            {submissionDialog.success ? "OK" : "Close"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
