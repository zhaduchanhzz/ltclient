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
  Divider,
  Grid2,
  Paper,
  Slide,
  Stack,
  Typography,
  Chip,
  Zoom,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ExamHeader from "./components/ExamHeader";
import QuestionCard from "./components/QuestionCard";
import { useExamLogic } from "./hooks/useExamLogic";
import { API_PATH } from "@/consts/api-path";
import { ApiServerURL } from "@/utils/config";
import { useAppContextHandle } from "@/contexts/AppContext";
import { EXAM_TIME_LIMITS } from "@/config/app-config";

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
  const scrollPositionsRef = useRef<Record<number, { leftTop: number; rightTop: number }>>({});
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
        if (left) left.scrollTop = saved.leftTop || 0;
        if (right) right.scrollTop = saved.rightTop || 0;
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

  const handleLeftScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const pos = scrollPositionsRef.current[currentExamPartIndex] || { leftTop: 0, rightTop: 0 };
    pos.leftTop = event.currentTarget.scrollTop;
    scrollPositionsRef.current[currentExamPartIndex] = pos;
  };

  const handleRightScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const pos = scrollPositionsRef.current[currentExamPartIndex] || { leftTop: 0, rightTop: 0 };
    pos.rightTop = event.currentTarget.scrollTop;
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

    try {
      // Bulk submit in one request
      const payload = gradableExams.map((exam) => ({ termId: session.termId, examType: exam.examType }));
      await gradingRequestMutation.mutateAsync(payload);
      updateAppState({ appAlertInfo: { message: `Đã gửi ${payload.length} yêu cầu chấm điểm thành công!`, severity: "success" } });
      router.push("/");
    } catch {
      updateAppState({ appAlertInfo: { message: "Gửi yêu cầu chấm điểm thất bại. Vui lòng thử lại.", severity: "error" } });
    }
  };

  const [isRequestingBulk, setIsRequestingBulk] = useState(false);

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
    // compute grand totals from examResultsByType
    const grandTotal = Object.values(examResultsByType).reduce(
      (acc: { answered: number; total: number }, r: any) => {
        acc.answered += r.correct;
        acc.total += r.total;
        return acc;
      },
      { answered: 0, total: 0 },
    );

    return (
      <Dialog open={showSuccessDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircle color="success" />
            Đã hoàn thành bài thi
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "start", sm: "center" }} justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Mã bài thi
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {session?.termId}
                  </Typography>
                </Box>
                <Divider flexItem orientation="vertical" sx={{ display: { xs: "none", sm: "block" } }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tổng tiến độ
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6" fontWeight={700}>
                      {grandTotal.answered}/{grandTotal.total}
                    </Typography>
                    <Chip size="small" color={grandTotal.total ? (Math.round((grandTotal.answered / grandTotal.total) * 100) >= 70 ? "success" : "warning") : "default"} label={`${grandTotal.total ? Math.round((grandTotal.answered / grandTotal.total) * 100) : 0}%`} />
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Kết quả theo kỹ năng
            </Typography>

            <Grid2 container spacing={2}>
              {examTypes.map((examType) => {
                const results = examResultsByType[examType];
                if (!results) return null;
                const Icon = ExamTypeIcons[examType];
                const color = ExamTypeColors[examType];
                const isAuto = examType === "LISTENING" || examType === "READING";
                const percent = isAuto && results.total > 0 ? Math.round((results.correct / results.total) * 100) : undefined;

                return (
                  <Grid2 key={examType} size={{ xs: 12, sm: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderLeft: `4px solid ${color}` }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Avatar sx={{ bgcolor: color, width: 36, height: 36 }}>
                          <Icon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {examType}
                        </Typography>
                        <Chip size="small" variant="outlined" color={isAuto ? "success" : "default"} label={isAuto ? "Chấm tự động" : "Chấm thủ công"} sx={{ ml: "auto" }} />
                      </Stack>

                      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                        <Typography variant="h5" fontWeight={800} color={isAuto ? (percent! >= 70 ? "success.main" : percent! >= 50 ? "warning.main" : "error.main") : "text.primary"}>
                          {results.correct}/{results.total}
                        </Typography>
                        {isAuto && (
                          <Chip size="small" color={percent! >= 70 ? "success" : percent! >= 50 ? "warning" : "error"} label={`${percent}% đúng`} />
                        )}
                        {!isAuto && (
                          <Typography variant="body2" color="text.secondary">
                            Đang chờ chấm điểm chi tiết
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Grid2>
                );
              })}
            </Grid2>

            {/* Optional tips */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="body2">
                • Các phần thi Nghe/Đọc đã được chấm tự động • Các phần thi Viết/Nói cần gửi yêu cầu chấm điểm để nhận phản hồi chi tiết
              </Typography>
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 1.5, gap: 1 }}>
          <Button onClick={() => router.push("/exam/room")} variant="outlined" fullWidth>
            Về phòng thi
          </Button>
          <Button onClick={handleGradingRequest} variant="contained" startIcon={<School />} disabled={gradingRequestMutation.isPending} fullWidth sx={{ fontSize: "0.9rem" }}>
            Yêu cầu chấm điểm
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
    } catch (submitError) {
      console.error("Submission error:", submitError);
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

  const isReading = currentExamPart.examType === "READING";

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

      {/*/!* Part Navigation Bar *!/*/}
      {/*<Paper*/}
      {/*  elevation={2}*/}
      {/*  sx={{*/}
      {/*    px: 3,*/}
      {/*    py: 0.5,*/}
      {/*    display: "flex",*/}
      {/*    alignItems: "center",*/}
      {/*    justifyContent: "space-between",*/}
      {/*    bgcolor: "background.paper",*/}
      {/*    borderBottom: "1px solid",*/}
      {/*    borderColor: "divider",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Typography variant="subtitle2" fontWeight="bold">*/}
      {/*    Part {currentExamPartIndex + 1} / {allExamsFlat.length}*/}
      {/*  </Typography>*/}

      {/*  <Box sx={{ display: "flex", gap: 1 }}>*/}
      {/*    <Button*/}
      {/*      variant="outlined"*/}
      {/*      size="small"*/}
      {/*      onClick={navigateToPreviousPart}*/}
      {/*      disabled={currentExamPartIndex === 0}*/}
      {/*    >*/}
      {/*      Previous Part*/}
      {/*    </Button>*/}
      {/*    <Button*/}
      {/*      variant="outlined"*/}
      {/*      size="small"*/}
      {/*      onClick={navigateToNextPart}*/}
      {/*      disabled={currentExamPartIndex === allExamsFlat.length - 1}*/}
      {/*    >*/}
      {/*      Next Part*/}
      {/*    </Button>*/}
      {/*  </Box>*/}
      {/*</Paper>*/}

      {/* Layout */}
      {isReading ? (
        // Two-Panel Layout for READING (aligned to real exam UI)
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            overflow: "hidden",
            height: "calc(100vh - 120px)",
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
              p: 1.5,
            }}
          >
            {/* Part Header - Sticky */}
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                mb: 3,
                bgcolor:
                  ExamTypeColors[
                    currentExamPart.examType as keyof typeof ExamTypeColors
                  ] || "#607d8b",
                color: "white",
                position: "sticky",
                top: 0,
                zIndex: 10,
                borderRadius: 2,
              }}
            >
              {currentExamPart.title ? (
                <Box sx={{ fontSize: "0.875rem", "& img": { maxWidth: "100%" } }} dangerouslySetInnerHTML={{ __html: currentExamPart.title }} />
              ) : (
                <Typography variant="subtitle2">{`${currentExamPart.examType} - Part ${currentExamPartIndex + 1}`}</Typography>
              )}
              <Typography variant="caption" sx={{ mt: 1, opacity: 0.9 }}>
                Questions {getGlobalQuestionOffset + 1} - {getGlobalQuestionOffset + currentExamPart.questions.length} • {partAnswered}/{partTotal} answered
              </Typography>
            </Paper>

            {/* Listening media (if available) */}
            {currentExamPart.examType === "LISTENING" && currentExamPart.audioFile && (
              <Paper elevation={1} sx={{ p: 1.5, mb: 3 }}>
                <Typography variant="caption" sx={{ mb: 2, display: "block" }}>
                  Listening Audio
                </Typography>
                {(() => {
                  const raw = currentExamPart.audioFile as string;
                  const audioSrc = raw.startsWith("http")
                    ? raw
                    : raw.startsWith("/audio/")
                      ? `${ApiServerURL}${raw}`
                      : `${ApiServerURL}${API_PATH.DOWNLOAD_FILE}${raw}`;
                  return (
                    <audio controls style={{ width: "100%" }}>
                      <source src={audioSrc} />
                      Your browser does not support the audio element.
                    </audio>
                  );
                })()}
              </Paper>
            )}

            {/* Part Description / Content */}
            {currentExamPart.description && (
              <Paper elevation={1} sx={{ p: 1.5 }}>
                <Typography variant="caption" sx={{ mb: 2, display: "block" }}>
                  Instructions / Passage
                </Typography>
                <Box
                  sx={{ fontSize: "0.875rem", lineHeight: 1.7, "& img": { maxWidth: "100%" } }}
                  dangerouslySetInnerHTML={{ __html: currentExamPart.description }}
                />
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
              p: 0,
            }}
          >
            <Box sx={{ p: 1.5 }}>
              {currentExamPart.questions.map((question: any, index: number) => {
                const globalQuestionNumber = getGlobalQuestionOffset + index + 1;
                return (
                  <Paper key={`question-${question.id}`} elevation={1} sx={{ p: 1.5, mb: 3 }}>
                    <Typography variant="caption" sx={{ mb: 2, color: "primary.main", display: "block" }}>
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
      ) : (
        // Full-width single panel for LISTENING / SPEAKING / WRITING (aligned to real exam UI)
        <Box
          ref={rightPanelRef}
          onScroll={handleRightScroll}
          sx={{
            flexGrow: 1,
            overflow: "auto",
            height: "calc(100vh - 120px)",
            bgcolor: "background.default",
          }}
        >
          <Box sx={{ p: 1.5, maxWidth: 1200, mx: "auto" }}>
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                mb: 3,
                bgcolor:
                  ExamTypeColors[
                    currentExamPart.examType as keyof typeof ExamTypeColors
                  ] || "#607d8b",
                color: "white",
                position: "sticky",
                top: 0,
                zIndex: 10,
                borderRadius: 2,
              }}
            >
              {currentExamPart.title ? (
                <Box sx={{ fontSize: "0.875rem", "& img": { maxWidth: "100%" } }} dangerouslySetInnerHTML={{ __html: currentExamPart.title }} />
              ) : (
                <Typography variant="subtitle2">{`${currentExamPart.examType} - Part ${currentExamPartIndex + 1}`}</Typography>
              )}
              <Typography variant="caption" sx={{ mt: 1, opacity: 0.9 }}>
                Questions {getGlobalQuestionOffset + 1} - {getGlobalQuestionOffset + currentExamPart.questions.length} • {partAnswered}/{partTotal} answered
              </Typography>
            </Paper>

            {currentExamPart.examType === "LISTENING" && currentExamPart.audioFile && (
              <Paper elevation={1} sx={{ p: 1.5, mb: 3 }}>
                <Typography variant="caption" sx={{ mb: 2, display: "block" }}>Listening Audio</Typography>
                {(() => {
                  const raw = currentExamPart.audioFile as string;
                  const audioSrc = raw.startsWith("http")
                    ? raw
                    : raw.startsWith("/audio/")
                      ? `${ApiServerURL}${raw}`
                      : `${ApiServerURL}${API_PATH.DOWNLOAD_FILE}${raw}`;
                  return (
                    <audio controls style={{ width: "100%" }}>
                      <source src={audioSrc} />
                      Your browser does not support the audio element.
                    </audio>
                  );
                })()}
              </Paper>
            )}

            {currentExamPart.description && (
              <Paper elevation={1} sx={{ p: 1.5, mb: 3 }}>
                <Typography variant="caption" sx={{ mb: 2, display: "block" }}>Instructions</Typography>
                <Box sx={{ lineHeight: 1.8, "& img": { maxWidth: "100%" } }} dangerouslySetInnerHTML={{ __html: currentExamPart.description }} />
              </Paper>
            )}

            {currentExamPart.questions.map((question: any, index: number) => {
              const globalQuestionNumber = getGlobalQuestionOffset + index + 1;
              return (
                <Paper key={`question-${question.id}`} elevation={1} sx={{ p: 1.5, mb: 3, bgcolor: "background.paper" }}>
                  <Typography variant="caption" sx={{ mb: 2, color: "primary.main", display: "block" }}>
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
      )}

      {/* Navigation and Submit Button - Full width at bottom */}
      <Paper
        elevation={2}
        sx={{ p: 1, width: "100%", bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider" }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button variant="contained" onClick={navigateToPreviousPart} disabled={currentExamPartIndex === 0}>
            ← Previous Part
          </Button>

          <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
            {allExamsFlat.map((exam, index) => {
              const Icon = ExamTypeIcons[exam.examType as keyof typeof ExamTypeIcons];
              const isCurrentPart = index === currentExamPartIndex;
              let questionsInPart = 0;
              let answeredInPart = 0;

              exam.questions.forEach((q: any) => {
                questionsInPart++;
                if (session.answers[q.id]?.length > 0) answeredInPart++;
              });

              return (
                <Button
                  key={index}
                  variant={isCurrentPart ? "contained" : "outlined"}
                  color={isCurrentPart ? "primary" : "inherit"}
                  onClick={() => navigateToPart(index)}
                  startIcon={<Icon />}
                  size="small"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {`Part ${index + 1} (${answeredInPart}/${questionsInPart})`}
                </Button>
              );
            })}
          </Box>

          {currentExamPartIndex === allExamsFlat.length - 1 ? (
            <Button variant="contained" size="large" color="success" onClick={handleSubmitAllAnswers} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit All"}
            </Button>
          ) : (
            <Button variant="contained" onClick={navigateToNextPart}>Next Part →</Button>
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
          {submissionDialog.success && (
            <Button
              variant="outlined"
              onClick={async () => {
                if (!session?.termId || !allExams) return;
                const gradableExams = allExams.filter((exam) => exam.examType === "WRITING" || exam.examType === "SPEAKING");

                if (gradableExams.length === 0) {
                  updateAppState({ appAlertInfo: { message: "Không có phần thi nào cần chấm điểm.", severity: "info" } });
                  return;
                }

                try {
                  setIsRequestingBulk(true);
                  const payload = gradableExams.map((exam) => ({ termId: session.termId, examType: exam.examType }));
                  await gradingRequestMutation.mutateAsync(payload);
                  updateAppState({ appAlertInfo: { message: `Đã gửi ${payload.length} yêu cầu chấm điểm!`, severity: "success" } });
                } catch {
                  updateAppState({ appAlertInfo: { message: "Gửi yêu cầu chấm điểm thất bại.", severity: "error" } });
                } finally {
                  setIsRequestingBulk(false);
                }
              }}
              disabled={isRequestingBulk || gradingRequestMutation.isPending}
              sx={{ mr: 1 }}
            >
              {isRequestingBulk ? "Đang yêu cầu..." : "Yêu cầu chấm"}
            </Button>
          )}
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
