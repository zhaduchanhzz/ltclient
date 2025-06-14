"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid2,
  LinearProgress,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Create,
  Headphones,
  MenuBook,
  Mic,
  NavigateBefore,
  NavigateNext,
  Quiz,
  Send,
} from "@mui/icons-material";
import {
  useGetAllExamsQuery,
  useSubmitExamMutation,
} from "@/services/apis/exam";
import {
  ExamSubmitRequest,
  ExamTermSession,
  SimulationExam,
} from "@/services/types/exam";

const EXAM_TIME_LIMIT = 120; // 120 minutes for full exam

const ExamTypeIcons = {
  LISTENING: Headphones,
  READING: MenuBook,
  WRITING: Create,
  SPEAKING: Mic,
};

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const { data: examsData, isLoading, error } = useGetAllExamsQuery(true);
  const submitExamMutation = useSubmitExamMutation();

  const [session, setSession] = useState<ExamTermSession | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Generate termId when starting exam
  const generateTermId = () => Math.floor(Math.random() * 100000000);

  // Mock data for development testing
  const mockExamData: SimulationExam[] = [
    {
      id: 1,
      examType: "LISTENING",
      title: "Listening Part 1",
      description: "Basic listening comprehension",
      isNeedVip: false,
      questions: [
        {
          id: 1001,
          questionText: "What is the main topic of the conversation?",
          answers: [
            { id: 1, answerText: "Travel plans", isCorrect: true },
            { id: 2, answerText: "Work schedule", isCorrect: false },
            { id: 3, answerText: "Weather forecast", isCorrect: false },
          ],
        },
        {
          id: 1002,
          questionText: "When will they meet?",
          answers: [
            { id: 4, answerText: "Tomorrow morning", isCorrect: false },
            { id: 5, answerText: "This afternoon", isCorrect: true },
            { id: 6, answerText: "Next week", isCorrect: false },
          ],
        },
      ],
    },
    {
      id: 2,
      examType: "READING",
      title: "Reading Part 1",
      description: "Reading comprehension",
      isNeedVip: false,
      questions: [
        {
          id: 2001,
          questionText:
            "According to the passage, what is the author's main argument?",
          answers: [
            {
              id: 7,
              answerText: "Technology improves education",
              isCorrect: true,
            },
            {
              id: 8,
              answerText: "Traditional methods are better",
              isCorrect: false,
            },
            { id: 9, answerText: "Both methods are equal", isCorrect: false },
          ],
        },
      ],
    },
    {
      id: 3,
      examType: "WRITING",
      title: "Writing Part 1",
      description: "Essay writing task",
      isNeedVip: false,
      questions: [
        {
          id: 3001,
          questionText:
            "Write an essay about the advantages of online learning.",
          answers: [
            {
              id: 10,
              answerText: "Flexibility in scheduling",
              isCorrect: true,
            },
            { id: 11, answerText: "Cost-effective", isCorrect: true },
            {
              id: 12,
              answerText: "Access to global resources",
              isCorrect: true,
            },
          ],
        },
      ],
    },
    {
      id: 4,
      examType: "SPEAKING",
      title: "Speaking Part 1",
      description: "Oral communication task",
      isNeedVip: false,
      questions: [
        {
          id: 4001,
          questionText: "Describe your hometown and what makes it special.",
          answers: [
            { id: 13, answerText: "Clear pronunciation", isCorrect: true },
            { id: 14, answerText: "Good vocabulary usage", isCorrect: true },
            { id: 15, answerText: "Coherent structure", isCorrect: true },
          ],
        },
      ],
    },
  ];

  // Organize exams by type
  const examsByType = useMemo(() => {
    // Use mock data if API data is not available
    const dataToUse = examsData?.data || mockExamData;

    if (!dataToUse || dataToUse.length === 0) {
      return {};
    }

    const freeExams = dataToUse.filter((exam) => !exam.isNeedVip);
    const organized = freeExams.reduce(
      (acc, exam) => {
        if (!acc[exam.examType]) {
          acc[exam.examType] = [];
        }

        acc[exam.examType].push(exam);
        return acc;
      },
      {} as Record<string, SimulationExam[]>,
    );
    return organized;
  }, [examsData]);

  const examTypes = Object.keys(examsByType) as Array<
    "LISTENING" | "READING" | "WRITING" | "SPEAKING"
  >;
  const allExams = Object.values(examsByType).flat();

  // Initialize exam session
  const startExam = () => {
    if (allExams.length === 0) {
      return;
    }

    const termId = generateTermId();
    const newSession: ExamTermSession = {
      termId,
      examId: parseInt(examId),
      exams: allExams,
      currentExamType: examTypes[0],
      currentExamIndex: 0,
      currentQuestionIndex: 0,
      answers: {},
      startTime: Date.now(),
      timeLimit: EXAM_TIME_LIMIT,
      isCompleted: false,
    };

    setSession(newSession);
    setTimeRemaining(EXAM_TIME_LIMIT * 60);
  };

  // Timer effect
  useEffect(() => {
    if (!session || session.isCompleted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          submitExam();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session, timeRemaining]);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get current exam and question
  const getCurrentExamAndQuestion = () => {
    if (!session) return { exam: null, question: null };

    const currentTypeExams = examsByType[session.currentExamType] || [];
    const currentExam = currentTypeExams[session.currentExamIndex];
    const currentQuestion =
      currentExam?.questions[session.currentQuestionIndex];

    return { exam: currentExam, question: currentQuestion };
  };

  // Handle answer selection
  const handleAnswerChange = (
    questionId: number,
    answerId: number,
    isChecked: boolean,
  ) => {
    if (!session) return;

    setSession((prev) => {
      if (!prev) return prev;

      const currentAnswers = prev.answers[questionId] || [];
      let newAnswers;

      if (isChecked) {
        newAnswers = [...currentAnswers, answerId.toString()];
      } else {
        newAnswers = currentAnswers.filter((id) => id !== answerId.toString());
      }

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: newAnswers,
        },
      };
    });
  };

  // Navigate to specific exam type and part
  const navigateToExamTypePart = (examType: string, partIndex: number) => {
    if (!session) return;

    setSession((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        currentExamType: examType as
          | "LISTENING"
          | "READING"
          | "WRITING"
          | "SPEAKING",
        currentExamIndex: partIndex,
        currentQuestionIndex: 0,
      };
    });
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (!session) return;

    setSession((prev) => {
      if (!prev) return prev;

      const currentTypeExams = examsByType[prev.currentExamType] || [];
      const currentExam = currentTypeExams[prev.currentExamIndex];

      if (!currentExam) return prev;

      const isLastQuestion =
        prev.currentQuestionIndex >= currentExam.questions.length - 1;

      if (isLastQuestion) {
        // Move to next part within same exam type
        const isLastPartInType =
          prev.currentExamIndex >= currentTypeExams.length - 1;

        if (isLastPartInType) {
          // Move to next exam type
          const currentTypeIndex = examTypes.indexOf(prev.currentExamType);
          const isLastExamType = currentTypeIndex >= examTypes.length - 1;

          if (isLastExamType) {
            // Exam complete - don't change state, let user submit
            return prev;
          } else {
            const nextExamType = examTypes[currentTypeIndex + 1];
            return {
              ...prev,
              currentExamType: nextExamType,
              currentExamIndex: 0,
              currentQuestionIndex: 0,
            };
          }
        } else {
          return {
            ...prev,
            currentExamIndex: prev.currentExamIndex + 1,
            currentQuestionIndex: 0,
          };
        }
      } else {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      }
    });
  };

  // Navigate to previous question
  const previousQuestion = () => {
    if (!session) return;

    setSession((prev) => {
      if (!prev) return prev;

      if (prev.currentQuestionIndex > 0) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
        };
      } else if (prev.currentExamIndex > 0) {
        const currentTypeExams = examsByType[prev.currentExamType] || [];
        const prevExam = currentTypeExams[prev.currentExamIndex - 1];
        return {
          ...prev,
          currentExamIndex: prev.currentExamIndex - 1,
          currentQuestionIndex: prevExam.questions.length - 1,
        };
      } else {
        // Move to previous exam type
        const currentTypeIndex = examTypes.indexOf(prev.currentExamType);

        if (currentTypeIndex > 0) {
          const prevExamType = examTypes[currentTypeIndex - 1];
          const prevTypeExams = examsByType[prevExamType] || [];
          const lastExamInPrevType = prevTypeExams[prevTypeExams.length - 1];

          return {
            ...prev,
            currentExamType: prevExamType,
            currentExamIndex: prevTypeExams.length - 1,
            currentQuestionIndex: lastExamInPrevType.questions.length - 1,
          };
        }
      }

      return prev;
    });
  };

  // Submit exam
  const submitExam = async () => {
    if (!session) return;

    try {
      // Prepare responses in the format expected by the API
      const responses: Record<string, string> = {};

      Object.entries(session.answers).forEach(([questionId, answerIds]) => {
        responses[`question_${questionId}`] = answerIds.join(",");
      });

      const submitRequest: ExamSubmitRequest = {
        request: {
          examId: session.examId,
          responses,
          termId: session.termId,
        },
      };

      await submitExamMutation.mutateAsync(submitRequest);

      // Show success dialog
      setShowSuccessDialog(true);
      setSession((prev) => (prev ? { ...prev, isCompleted: true } : null));
    } catch (error) {
      console.error("Failed to submit exam:", error);
      // Show error - could add error dialog here if needed
      alert("Failed to submit exam. Please try again.");
    }
  };

  // Reset exam
  const resetExam = () => {
    setSession(null);
    setShowSuccessDialog(false);
    setTimeRemaining(0);
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
        <Alert severity="warning">
          Failed to load exam data. Using demo data for testing.
        </Alert>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Quiz sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            VSTEP Exam #{examId}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Take the complete VSTEP exam with all available parts. Your progress
            will be tracked with term ID for teacher evaluation.
          </Typography>

          <Grid2 container spacing={2} sx={{ mb: 4 }}>
            <Grid2 size={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary">
                    <AccessTime sx={{ mr: 1, verticalAlign: "middle" }} />
                    Time Limit
                  </Typography>
                  <Typography variant="h4">{EXAM_TIME_LIMIT} min</Typography>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 size={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary">
                    <Quiz sx={{ mr: 1, verticalAlign: "middle" }} />
                    Total Parts
                  </Typography>
                  <Typography variant="h4">{allExams.length}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Exam Parts:
            </Typography>
            <Grid2 container spacing={2}>
              {examTypes.map((examType) => {
                const parts = examsByType[examType] || [];
                const Icon = ExamTypeIcons[examType];
                return (
                  <Grid2 key={examType} size={12}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center" }}>
                        <Icon
                          sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                        />
                        <Typography variant="h6">{examType}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {parts.length} part{parts.length !== 1 ? "s" : ""}
                        </Typography>
                      </CardContent>
                    </Card>
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
          >
            Start Exam
          </Button>

          {allExams.length === 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              No exam parts available. Please check back later.
              <br />
              Debug: isLoading={isLoading.toString()}, hasData=
              {!!examsData?.data}, examCount={allExams.length}
            </Alert>
          )}

          {/* Debug Info */}
          <Alert severity="info" sx={{ mt: 2 }}>
            Debug Info:
            <br />• API Loading: {isLoading.toString()}
            <br />• Has API Data: {!!examsData?.data ? "Yes" : "No"}
            <br />• Exam Count: {allExams.length}
            <br />• Exam Types: {examTypes.join(", ")}
            <br />• Using: {examsData?.data ? "API Data" : "Mock Data"}
          </Alert>
        </Paper>
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
    <Box sx={{ pb: 12 }}>
      {" "}
      {/* Add bottom padding for fixed footer */}
      {/* Header */}
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6">
              VSTEP Exam #{examId} - Term: {session.termId}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                icon={<AccessTime />}
                label={formatTime(timeRemaining)}
                color={timeRemaining < 300 ? "error" : "primary"}
                variant="outlined"
              />
              <Chip
                label={`${session.currentExamType} Part ${session.currentExamIndex + 1}`}
                color="secondary"
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {/* Progress */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Question {session.currentQuestionIndex + 1} of{" "}
            {currentExam.questions.length}| {session.currentExamType} Part{" "}
            {session.currentExamIndex + 1} of {currentTypeExams.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Paper>

        {/* Question */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {currentQuestion.questionText}
          </Typography>

          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel component="legend">Select your answer(s):</FormLabel>
            <FormGroup>
              {currentQuestion.answers.map((answer) => (
                <FormControlLabel
                  key={answer.id}
                  control={
                    <Checkbox
                      checked={
                        session.answers[currentQuestion.id]?.includes(
                          answer.id.toString(),
                        ) || false
                      }
                      onChange={(e) =>
                        handleAnswerChange(
                          currentQuestion.id,
                          answer.id,
                          e.target.checked,
                        )
                      }
                    />
                  }
                  label={answer.answerText}
                  sx={{ mb: 1 }}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Paper>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={previousQuestion}
            startIcon={<NavigateBefore />}
            disabled={
              session.currentExamType === examTypes[0] &&
              session.currentExamIndex === 0 &&
              session.currentQuestionIndex === 0
            }
          >
            Previous
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Check if this is the last question of the last exam (speaking) */}
            {(() => {
              const currentTypeIndex = examTypes.indexOf(
                session.currentExamType,
              );
              const isLastExamType = currentTypeIndex >= examTypes.length - 1;
              const currentTypeExams =
                examsByType[session.currentExamType] || [];
              const isLastPartInType =
                session.currentExamIndex >= currentTypeExams.length - 1;
              const isLastQuestion =
                session.currentQuestionIndex >=
                currentExam.questions.length - 1;
              const isLastOfAll =
                isLastExamType && isLastPartInType && isLastQuestion;

              if (isLastOfAll) {
                return (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={submitExam}
                    endIcon={<Send />}
                    disabled={submitExamMutation.isPending}
                  >
                    {submitExamMutation.isPending
                      ? "Submitting..."
                      : "Submit Exam"}
                  </Button>
                );
              } else {
                return (
                  <Button
                    variant="contained"
                    onClick={nextQuestion}
                    endIcon={<NavigateNext />}
                  >
                    Next
                  </Button>
                );
              }
            })()}
          </Box>
        </Box>
      </Container>
      {/* Fixed Footer Navigation */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderRadius: 0,
        }}
        elevation={8}
      >
        <Box sx={{ p: 2 }}>
          <Grid2 container spacing={1}>
            {examTypes.map((examType) => {
              const parts = examsByType[examType] || [];
              const Icon = ExamTypeIcons[examType];
              const isCurrentType = session.currentExamType === examType;

              return (
                <Grid2 key={examType} size={12}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: "pointer",
                      backgroundColor: isCurrentType
                        ? "primary.light"
                        : "transparent",
                      "&:hover": { backgroundColor: "primary.light" },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Icon sx={{ fontSize: 20 }} />
                        <Typography variant="subtitle2">{examType}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {parts.map((_, partIndex) => (
                          <Chip
                            key={partIndex}
                            label={partIndex + 1}
                            size="small"
                            variant={
                              isCurrentType &&
                              session.currentExamIndex === partIndex
                                ? "filled"
                                : "outlined"
                            }
                            color={
                              isCurrentType &&
                              session.currentExamIndex === partIndex
                                ? "primary"
                                : "default"
                            }
                            onClick={() =>
                              navigateToExamTypePart(examType, partIndex)
                            }
                            sx={{ cursor: "pointer", minWidth: 32 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid2>
              );
            })}
          </Grid2>

          {/* Submit Button */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Fab
              variant="extended"
              color="success"
              onClick={submitExam}
              disabled={submitExamMutation.isPending}
            >
              <Send sx={{ mr: 1 }} />
              {submitExamMutation.isPending ? "Submitting..." : "Submit Exam"}
            </Fab>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
