"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Container, Typography, Box, Paper } from "@mui/material";

// Sample exam data for testing - using the exact structure from the user's data
const sampleExamData = {
  termId: "test-123",
  userId: "user-123",
  createdAt: new Date().toISOString(),
  exams: [
    {
      id: "24",
      examType: "READING" as const,
      title: "Reading Comprehension 1",
      description: "Reading practice on environment topics",
      isNeedVip: false,
      questions: [
        {
          id: "33",
          questionText: "What is the main idea of the passage?",
          answers: [
            {
              id: "26",
              answerText: "Environmental challenges in modern cities",
              isCorrect: true
            },
            {
              id: "27",
              answerText: "Space exploration history",
              isCorrect: false
            },
            {
              id: "28",
              answerText: "Biography of a famous author",
              isCorrect: false
            },
            {
              id: "29",
              answerText: "Basics of web development",
              isCorrect: false
            }
          ]
        },
        {
          id: "34",
          questionText: "What does the author suggest as a solution?",
          answers: [
            {
              id: "30",
              answerText: "Promoting public transport",
              isCorrect: true
            },
            {
              id: "31",
              answerText: "Building more highways",
              isCorrect: false
            },
            {
              id: "32",
              answerText: "Encouraging fossil fuel use",
              isCorrect: false
            },
            {
              id: "33",
              answerText: "Avoiding technology",
              isCorrect: false
            }
          ]
        }
      ]
    },
    {
      id: "26",
      examType: "READING" as const,
      title: "Reading Comprehension 3",
      description: "Understanding academic texts on history",
      isNeedVip: false,
      questions: [
        {
          id: "35",
          questionText: "What is the main idea of the passage?",
          answers: [
            {
              id: "34",
              answerText: "Environmental challenges in modern cities",
              isCorrect: true
            },
            {
              id: "35",
              answerText: "Space exploration history",
              isCorrect: false
            },
            {
              id: "36",
              answerText: "Biography of a famous author",
              isCorrect: false
            },
            {
              id: "37",
              answerText: "Basics of web development",
              isCorrect: false
            }
          ]
        },
        {
          id: "36",
          questionText: "What does the author suggest as a solution?",
          answers: [
            {
              id: "38",
              answerText: "Promoting public transport",
              isCorrect: true
            },
            {
              id: "39",
              answerText: "Building more highways",
              isCorrect: false
            },
            {
              id: "40",
              answerText: "Encouraging fossil fuel use",
              isCorrect: false
            },
            {
              id: "41",
              answerText: "Avoiding technology",
              isCorrect: false
            }
          ]
        }
      ]
    },
    {
      id: "12",
      examType: "READING" as const,
      title: "Basic Listening Comprehension",
      description: "Listen to a short audio clip and answer the questions.",
      isNeedVip: false,
      questions: [
        {
          id: "15",
          questionText: "What is the main topic of the conversation?",
          answers: [
            {
              id: "16",
              answerText: "Weather",
              isCorrect: true
            },
            {
              id: "17",
              answerText: "Travel plans",
              isCorrect: false
            },
            {
              id: "18",
              answerText: "Work schedule",
              isCorrect: false
            },
            {
              id: "19",
              answerText: "Food preferences",
              isCorrect: false
            }
          ]
        },
        {
          id: "16",
          questionText: "Who is speaking in the audio?",
          answers: [
            {
              id: "20",
              answerText: "A weather forecaster",
              isCorrect: true
            },
            {
              id: "21",
              answerText: "A travel agent",
              isCorrect: false
            },
            {
              id: "22",
              answerText: "A manager",
              isCorrect: false
            }
          ]
        }
      ]
    },
    {
      id: "29",
      examType: "LISTENING" as const,
      title: "Listening Practice 1",
      description: "Listen and answer questions about daily conversations",
      isNeedVip: false,
      questions: [
        {
          id: "41",
          questionText: "What is the main idea of the passage?",
          answers: [
            {
              id: "58",
              answerText: "Environmental challenges in modern cities",
              isCorrect: true
            },
            {
              id: "59",
              answerText: "Space exploration history",
              isCorrect: false
            },
            {
              id: "60",
              answerText: "Biography of a famous author",
              isCorrect: false
            },
            {
              id: "61",
              answerText: "Basics of web development",
              isCorrect: false
            }
          ]
        },
        {
          id: "42",
          questionText: "What does the author suggest as a solution?",
          answers: [
            {
              id: "62",
              answerText: "Promoting public transport",
              isCorrect: true
            },
            {
              id: "63",
              answerText: "Building more highways",
              isCorrect: false
            },
            {
              id: "64",
              answerText: "Encouraging fossil fuel use",
              isCorrect: false
            },
            {
              id: "65",
              answerText: "Avoiding technology",
              isCorrect: false
            }
          ]
        }
      ]
    },
    {
      id: "33",
      examType: "WRITING" as const,
      title: "Writing Task 1",
      description: "Write an essay about environmental issues",
      isNeedVip: false,
      questions: [
        {
          id: "100",
          questionText: "Write an essay about the impact of technology on education (minimum 250 words).",
          answers: []
        }
      ]
    },
    {
      id: "13",
      examType: "WRITING" as const,
      title: "ut laboris in dolor",
      description: "sit non proident ipsum",
      isNeedVip: true,
      questions: [
        {
          id: "17",
          questionText: "ullamco sunt",
          answers: []
        }
      ]
    },
    {
      id: "15",
      examType: "SPEAKING" as const,
      title: "ut laboris in dolor",
      description: "sit non proident ipsum",
      isNeedVip: true,
      questions: [
        {
          id: "19",
          questionText: "ullamco sunt",
          answers: []
        }
      ]
    }
  ],
};

export default function ExamTestPage() {
  const router = useRouter();

  const loadTestData = () => {
    const termId = "test-123";
    const examStateKey = `exam_session_state_${termId}`;
    const examState = {
      session: null,
      sectionStatus: {},
      sectionStartTimes: {},
      examData: sampleExamData,
      lastSavedAt: Date.now(),
    };

    try {
      localStorage.setItem(examStateKey, JSON.stringify(examState));
      console.log("Test exam data loaded successfully");
      router.push(`/exam/${termId}`);
    } catch (error) {
      console.error("Failed to load test data:", error);
      alert("Failed to load test data");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Exam Test Page
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Click the button below to load sample exam data for testing
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={loadTestData}
          >
            Load Test Exam Data
          </Button>
        </Box>
        <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
          This will create a test exam session with sample questions
        </Typography>
      </Paper>
    </Container>
  );
}