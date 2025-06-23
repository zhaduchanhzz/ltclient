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
    examId,
    isLoading,
    error,
    session,
    examsByType,
    examTypes,
    allExams,
    showSuccessDialog,
    sidebarOpen,
    sectionStatus,
    currentSectionTimeRemaining,
    getCurrentExamAndQuestion,
    router,
    submitExamMutation,
    startExam,
    handleAnswerChange,
    navigateToExamTypePart,
    nextQuestion,
    previousQuestion,
    completeSection,
    submitExam,
    resetExam,
    setSidebarOpen,
  } = useExamLogic();

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
        <Alert severity="warning">
          Failed to load exam data. Using demo data for testing.
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
                VSTEP Exam #{examId}
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Take the complete VSTEP exam with all available parts
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
                          Time Limit
                        </Typography>
                      </Stack>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {Object.values(EXAM_TIME_LIMITS).reduce(
                          (a, b) => a + b,
                          0,
                        )}{" "}
                        min
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
                          Total Parts
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
                  Exam Sections:
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
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {parts.length} part
                                {parts.length !== 1 ? "s" : ""}
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
                Start Exam
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

  // Success dialog after exam submission
  if (showSuccessDialog) {
    return (
      <Dialog open={showSuccessDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircle color="success" />
            Exam Submitted Successfully!
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your exam has been successfully submitted with Term ID:{" "}
            <strong>{session?.termId}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your responses have been recorded and will be evaluated by your
            instructor.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => router.push("/exam/room")} variant="outlined">
            Back to Exams
          </Button>
          <Button onClick={resetExam} variant="contained">
            Take Another Exam
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
          examId={examId}
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
          />

          {/* Navigation Controls */}
          <NavigationControls
            session={session}
            currentExam={currentExam}
            examsByType={examsByType}
            examTypes={examTypes}
            submitExamMutation={submitExamMutation}
            onPreviousQuestion={previousQuestion}
            onNextQuestion={nextQuestion}
            onCompleteSection={completeSection}
            onSubmitExam={submitExam}
          />
        </Box>
      </Box>
    </Box>
  );
}
