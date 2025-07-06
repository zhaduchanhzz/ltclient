"use client";

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
import ExamHeader from "./components/ExamHeader";
import ExamSidebar from "./components/ExamSidebar";
import NavigationControls from "./components/NavigationControls";
import QuestionCard from "./components/QuestionCard";
import { useExamLogic } from "./hooks/useExamLogic";
import { useGradingRequestMutation } from "@/services/apis/exam";
import { useState } from "react";

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
    sidebarOpen,
    examExpired,
    sectionStatus,
    currentSectionTimeRemaining,
    getCurrentExamAndQuestion,
    router,
    startExam,
    handleAnswerChange,
    handleWritingAnswerChange,
    handleSpeakingAnswerChange,
    navigateToExamTypePart,
    nextQuestion,
    previousQuestion,
    completeSection,
    submitWritingExam,
    submitFinalSpeaking,
    setSidebarOpen,
    setShowSuccessDialog,
  } = useExamLogic();

  const gradingRequestMutation = useGradingRequestMutation();
  const [gradingProgress, setGradingProgress] = useState<{
    isGrading: boolean;
    current: number;
    total: number;
    currentExamType?: string;
  }>({ isGrading: false, current: 0, total: 0 });

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
      alert("No exams available for grading request.");
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
        console.error(`Failed to submit grading request for ${exam.examType}:`, error);
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
      alert(
        `Successfully submitted ${successCount} grading request${successCount > 1 ? 's' : ''}!`
      );
      // Redirect to homepage after successful grading request
      router.push('/');
    } else if (successCount > 0 && failedCount > 0) {
      alert(
        `Partially successful: ${successCount} grading request${successCount > 1 ? 's' : ''} submitted, ${failedCount} failed.\nFailed exams: ${errors.join(', ')}`
      );
      // Redirect to homepage even with partial success
      router.push('/');
    } else {
      alert(
        `Failed to submit all grading requests. Please try again.\nFailed exams: ${errors.join(', ')}`
      );
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading exam...</Typography>
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
              <Typography variant="body2" sx={{ color: "info.main", fontWeight: "medium" }}>
                Đang gửi yêu cầu chấm điểm cho bài thi {gradingProgress.currentExamType}...
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
          Failed to load exam data. Please try again.
        </Alert>
      </Container>
    );
  }

  const currentTypeExams = examsByType[session.currentExamType] || [];
  const progress =
    (examTypes.indexOf(session.currentExamType) * 100 +
      ((session.currentExamIndex + 1) / currentTypeExams.length) * 100) /
    examTypes.length;

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar Navigation */}
      <ExamSidebar
        sidebarOpen={sidebarOpen}
        session={session}
        examsByType={examsByType}
        examTypes={examTypes}
        sectionStatus={sectionStatus}
        currentSectionTimeRemaining={currentSectionTimeRemaining}
        onCloseSidebar={() => setSidebarOpen(false)}
        onNavigateToExamTypePart={navigateToExamTypePart}
      />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Header */}
        <ExamHeader
          session={session}
          sidebarOpen={sidebarOpen}
          currentSectionTimeRemaining={currentSectionTimeRemaining}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, overflow: "auto" }}>
          {/* Question Card with Progress */}
          <QuestionCard
            session={session}
            currentExam={currentExam}
            currentQuestion={currentQuestion}
            progress={progress}
            onAnswerChange={handleAnswerChange}
            onWritingAnswerChange={handleWritingAnswerChange}
            onSpeakingAnswerChange={handleSpeakingAnswerChange}
          />

          {/* Navigation Controls */}
          <NavigationControls
            session={session}
            currentExam={currentExam}
            examsByType={examsByType}
            examTypes={examTypes}
            onPreviousQuestion={previousQuestion}
            onNextQuestion={nextQuestion}
            onCompleteSection={completeSection}
            onShowExamResults={() => setShowSuccessDialog(true)}
            onSubmitWritingExam={submitWritingExam}
            onSubmitFinalSpeaking={submitFinalSpeaking}
          />
        </Box>
      </Box>
    </Box>
  );
}
