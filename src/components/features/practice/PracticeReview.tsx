"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { APP_ROUTE } from "@/consts/app-route";
import { useExamDetailQuery } from "@/services/apis/exam";
import { CircularProgress, Container, Paper, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";

type PracticeReviewProps = {
  examId: string;
};

const PracticeReview = ({ examId }: PracticeReviewProps) => {
  const router = useRouter();
  const theme = useTheme();
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  
  // Fetch exam details
  const { data, isLoading, error } = useExamDetailQuery(examId, true);
  
  // Load user's answers from localStorage
  useEffect(() => {
    const storedAnswers = localStorage.getItem(`practice_exam_${examId}_answers`);
    if (storedAnswers) {
      try {
        setUserAnswers(JSON.parse(storedAnswers));
      } catch (e) {
        console.error("Error loading answers:", e);
      }
    }
  }, [examId]);
  
  // Extract exam data
  const examData = useMemo(() => {
    if (!data?.data) return null;
    return data.data;
  }, [data]);
  
  // Calculate score and answered questions for multiple choice questions
  const score = useMemo(() => {
    if (!examData || (examData.examType !== "LISTENING" && examData.examType !== "READING")) {
      return null;
    }
    
    let correct = 0;
    let total = 0;
    let answered = 0;
    
    examData.questions.forEach((question: any) => {
      if (question.answers && question.answers.length > 0) {
        total++;
        const userAnswerId = userAnswers[question.id];
        
        if (userAnswerId) {
          answered++;
          const correctAnswer = question.answers.find((a: any) => a.isCorrect);
          
          if (correctAnswer && parseInt(userAnswerId) === correctAnswer.id) {
            correct++;
          }
        }
      }
    });
    
    return { 
      correct, 
      total, 
      answered,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0 
    };
  }, [examData, userAnswers]);
  
  // Count answered questions for writing/speaking
  const answeredCount = useMemo(() => {
    if (!examData) return { answered: 0, total: 0 };
    
    if (examData.examType === "WRITING" || examData.examType === "SPEAKING") {
      const total = examData.questions.length;
      let answered = 0;
      
      examData.questions.forEach((question: any) => {
        if (userAnswers[question.id]) {
          answered++;
        }
      });
      
      return { answered, total };
    }
    
    return null;
  }, [examData, userAnswers]);
  
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
            Failed to load exam review. Please try again.
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
  
  return (
    <Container>
      <BasicBox sx={{ mt: 3, mb: 4 }}>
        <BasicStack spacing={3}>
          {/* Header */}
          <BasicStack direction="row" justifyContent="space-between" alignItems="center">
            <BasicTypography variant="h4" fontWeight="bold">
              Review: {getExamTypeName(examData.examType)} Exam - ID: {examId}
            </BasicTypography>
            <BasicButton
              variant="outlined"
              onClick={() => router.push(getBackRoute(examData.examType))}
            >
              Back to {getExamTypeName(examData.examType)} Practice
            </BasicButton>
          </BasicStack>
          
          {/* Score Summary */}
          {(score || answeredCount) && (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                bgcolor: theme.palette.background.paper,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <BasicStack spacing={2}>
                {/* Score for multiple choice */}
                {score && (
                  <>
                    <BasicTypography variant="h5" fontWeight="bold">
                      Your Score: {score.correct}/{score.total} ({score.percentage}%)
                    </BasicTypography>
                    <BasicTypography variant="body1" color="text.secondary">
                      Questions Answered: {score.answered} out of {score.total}
                    </BasicTypography>
                  </>
                )}
                
                {/* Answered count for writing/speaking */}
                {answeredCount && (
                  <BasicTypography variant="h5" fontWeight="bold">
                    Questions Answered: {answeredCount.answered} out of {answeredCount.total}
                  </BasicTypography>
                )}
              </BasicStack>
            </Paper>
          )}
          
        </BasicStack>
      </BasicBox>
    </Container>
  );
};

export default PracticeReview;