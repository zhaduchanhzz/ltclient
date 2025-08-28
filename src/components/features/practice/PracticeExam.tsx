"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import PracticeQuestionCard from "./PracticeQuestionCard";
import { APP_ROUTE } from "@/consts/app-route";
import { useExamDetailQuery } from "@/services/apis/exam";
import { CircularProgress, Container, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

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
  
  // Get review route based on exam type
  const getReviewRoute = (type: string) => {
    switch (type) {
      case "LISTENING":
        return APP_ROUTE.PRACTICE_REVIEW_LISTENING;
      case "READING":
        return APP_ROUTE.PRACTICE_REVIEW_READING;
      case "WRITING":
        return APP_ROUTE.PRACTICE_REVIEW_WRITING;
      case "SPEAKING":
        return APP_ROUTE.PRACTICE_REVIEW_SPEAKING;
      default:
        return APP_ROUTE.PRACTICE_DASHBOARD;
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
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const handleSubmit = () => {
    // TODO: Submit answers to API
    console.log("Submitting answers:", answers);
    console.log("Exam Type:", examData?.examType);
    
    if (examData?.examType) {
      router.push(getReviewRoute(examData.examType));
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
  
  return (
    <Container>
      <BasicBox sx={{ mt: 3 }}>
        <BasicStack spacing={3}>
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
          
          {/* Display exam title if available */}
          {examData.title && (
            <BasicBox
              sx={{
                p: 2,
                bgcolor: theme.palette.background.paper,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <BasicTypography variant="body1">
                <strong>Title:</strong> {examData.title}
              </BasicTypography>
            </BasicBox>
          )}
          
          {/* Display questions */}
          {examData.questions.map((question: any, index: number) => (
            <PracticeQuestionCard
              key={question.id || index}
              question={question}
              index={index}
              examType={examData.examType as "LISTENING" | "READING" | "WRITING" | "SPEAKING"}
              onAnswerChange={(answer) => handleAnswerChange(question.id || index, answer)}
            />
          ))}
          
          {/* Submit button */}
          <BasicBox sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <BasicButton
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={examData.isNeedVip && examData.isNeedVip}
            >
              Nộp bài
            </BasicButton>
          </BasicBox>
        </BasicStack>
      </BasicBox>
    </Container>
  );
};

export default PracticeExam;