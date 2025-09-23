import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMediaQuery, useTheme } from "@mui/material";
import { useSubmitExamMutation, useSubmitAllExamsMutation, useGradingRequestMutation } from "@/services/apis/exam";
import {
  ExamSubmitRequest,
  ExamTermSession,
  SimulationExam,
  TakeExamRequest,
} from "@/services/types/exam";
import { useAuthContext } from "@/contexts/AuthContext";

type ExamSectionStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed"
  | "expired";

const EXAM_TIME_LIMITS = {
  LISTENING: 47,
  READING: 60,
  WRITING: 60,
  SPEAKING: 12,
};

// Persistence key for localStorage
const EXAM_STATE_KEY = "exam_session_state";

// Extended types for persistence
type PersistedExamState = {
  session: ExamTermSession | null;
  sectionStatus: Record<string, ExamSectionStatus>;
  sectionStartTimes: Record<string, number>;
  examData: TakeExamRequest | null;
  lastSavedAt: number;
};

export function useExamLogic() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { id: examId } = useParams() as { id: string };
  const submitExamMutation = useSubmitExamMutation();
  const submitAllExamsMutation = useSubmitAllExamsMutation();
  const gradingRequestMutation = useGradingRequestMutation();
  const { userInfo } = useAuthContext();

  // Track submitted speaking questions to avoid duplicates
  const [submittedSpeakingQuestions, setSubmittedSpeakingQuestions] = useState<
    Set<number>
  >(new Set());

  // State management
  const [session, setSession] = useState<ExamTermSession | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [examData, setExamData] = useState<TakeExamRequest | null>(null);
  const [sectionStatus, setSectionStatus] = useState<
    Record<string, ExamSectionStatus>
  >({});
  const [sectionStartTimes, setSectionStartTimes] = useState<
    Record<string, number>
  >({});
  const [currentSectionTimeRemaining, setCurrentSectionTimeRemaining] =
    useState(0);
  const [examExpired, setExamExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter exams based on user account type
  const filterExamsByAccountType = useCallback(
    (exams: SimulationExam[]) => {
      if (!userInfo) {
        // If no user info, show no exams for safety
        return [];
      }

      if (userInfo.accountType === "VIP") {
        // VIP users can access all exams
        return exams;
      } else {
        // FREE users can only access non-VIP exams
        return exams.filter((exam) => !exam.isNeedVip);
      }
    },
    [userInfo],
  );

  // Persistence functions
  const saveStateToLocalStorage = useCallback(
    (state: PersistedExamState) => {
      try {
        localStorage.setItem(
          EXAM_STATE_KEY + "_" + examId,
          JSON.stringify(state),
        );
      } catch (error) {
        console.error("Failed to save exam state:", error);
      }
    },
    [examId],
  );

  const loadStateFromLocalStorage =
    useCallback((): PersistedExamState | null => {
      try {
        const saved = localStorage.getItem(EXAM_STATE_KEY + "_" + examId);

        if (saved) {
          const state: PersistedExamState = JSON.parse(saved);
          // Check if saved state is less than 6 hours old
          const maxAge = 6 * 60 * 60 * 1000; // 6 hours in ms

          if (Date.now() - state.lastSavedAt < maxAge) {
            return state;
          }
        }
      } catch (error) {
        console.error("Failed to load exam state:", error);
      }

      return null;
    }, [examId]);

  const clearPersistedState = useCallback(() => {
    try {
      localStorage.removeItem(EXAM_STATE_KEY + "_" + examId);
    } catch (error) {
      console.error("Failed to clear exam state:", error);
    }
  }, [examId]);

  // Load persisted state or exam data on mount
  useEffect(() => {
    const loadExamData = () => {
      setIsLoading(true);
      setError(null);

      try {
        // First try to load from localStorage
        const savedState = loadStateFromLocalStorage();

        if (savedState && savedState.examData) {
          // Validate the exam data structure
          if (
            !savedState.examData.exams ||
            !Array.isArray(savedState.examData.exams)
          ) {
            console.error(
              "Invalid exam data structure - missing or invalid exams array",
            );
            setError("Invalid exam data format");
            setIsLoading(false);
            return;
          }

          setExamData(savedState.examData);

          // If there's also a session and it's not completed, restore the session
          if (savedState.session && !savedState.session.isCompleted) {
            console.log("Loading ongoing exam from saved state");
            setSession(savedState.session);
            setSectionStatus(savedState.sectionStatus);
            setSectionStartTimes(savedState.sectionStartTimes);

            // Calculate remaining time for current section
            const currentType = savedState.session.currentExamType;
            const startTime = savedState.sectionStartTimes[currentType];

            if (startTime) {
              const timeLimit =
                EXAM_TIME_LIMITS[currentType as keyof typeof EXAM_TIME_LIMITS] *
                60;
              const elapsed = Math.floor((Date.now() - startTime) / 1000);
              const remaining = Math.max(0, timeLimit - elapsed);
              setCurrentSectionTimeRemaining(remaining);
            }
          }

          setIsLoading(false);
          setExamExpired(false);
        } else {
          // If no saved state, this means the exam data is not available
          console.log("No exam data found - exam not available");
          console.log(
            "Expected localStorage key:",
            EXAM_STATE_KEY + "_" + examId,
          );
          setExamExpired(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading exam data:", error);
        setError("Failed to load exam data");
        setIsLoading(false);
      }
    };

    loadExamData();
  }, [loadStateFromLocalStorage, examId]);

  // Convert API exam data to SimulationExam format
  const convertToSimulationExams = (
    apiExams: TakeExamRequest["exams"],
  ): SimulationExam[] => {
    try {
      return apiExams.map((exam) => {
        return {
          id: parseInt(exam.id),
          examType: exam.examType,
          title: exam.title,
          description: exam.description,
          isNeedVip: exam.isNeedVip, // Now correctly handles boolean
          questions: exam.questions.map((question) => ({
            id: parseInt(question.id),
            questionText: question.questionText,
            answers: question.answers.map((answer) => ({
              id: parseInt(answer.id),
              answerText: answer.answerText, // Now using correct field name
              isCorrect: answer.isCorrect || false,
            })),
          })),
        };
      });
    } catch (error) {
      console.error("Error converting exam data:", error);
      console.error("Raw exam data:", apiExams);
      throw new Error("Failed to convert exam data");
    }
  };

  // Organize exams by type
  const examsByType = useMemo(() => {
    if (!examData?.exams) {
      return {};
    }

    const simulationExams = convertToSimulationExams(examData.exams);
    const freeExams = filterExamsByAccountType(simulationExams);

    const organized = freeExams.reduce(
      (acc: Record<string, SimulationExam[]>, exam: SimulationExam) => {
        // Only include exams that have questions
        if (exam.questions && exam.questions.length > 0) {
          if (!acc[exam.examType]) {
            acc[exam.examType] = [];
          }

          acc[exam.examType].push(exam);
        } else {
          console.log(
            `Skipping exam ${exam.id} (${exam.examType}) - no questions`,
          );
        }

        return acc;
      },
      {} as Record<string, SimulationExam[]>,
    );

    return organized;
  }, [examData, filterExamsByAccountType]);

  const examTypes = Object.keys(examsByType) as Array<
    "LISTENING" | "READING" | "WRITING" | "SPEAKING"
  >;
  const allExams = Object.values(examsByType).flat();

  // Save state to localStorage whenever critical state changes
  useEffect(() => {
    if (session && examData && !session.isCompleted) {
      const stateToSave: PersistedExamState = {
        session,
        sectionStatus,
        sectionStartTimes,
        examData,
        lastSavedAt: Date.now(),
      };
      saveStateToLocalStorage(stateToSave);
    }
  }, [
    session,
    sectionStatus,
    sectionStartTimes,
    examData,
    saveStateToLocalStorage,
  ]);

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [session?.currentQuestionIndex, isMobile]);

  // Initialize exam session with provided exam data
  const startExamWithData = (apiExamData: TakeExamRequest) => {
    try {
      setExamData(apiExamData);

      const simulationExams = convertToSimulationExams(apiExamData.exams);
      const freeExams = filterExamsByAccountType(simulationExams);

      if (freeExams.length === 0) {
        const hasVipExams = simulationExams.some((exam) => exam.isNeedVip);
        const errorMessage =
          hasVipExams && userInfo?.accountType === "FREE"
            ? "Các đề thi này yêu cầu tài khoản VIP. Vui lòng nâng cấp tài khoản để truy cập."
            : "No available exam parts found";
        setError(errorMessage);
        return;
      }

      const examTypeOrder: Array<
        "LISTENING" | "READING" | "WRITING" | "SPEAKING"
      > = ["READING", "LISTENING", "WRITING", "SPEAKING"];

      // Filter to only include exam types that have exams with questions
      const availableTypes = examTypeOrder.filter((type) =>
        freeExams.some(
          (exam) =>
            exam.examType === type &&
            exam.questions &&
            exam.questions.length > 0,
        ),
      );

      if (availableTypes.length === 0) {
        setError("No exam questions available");
        return;
      }

      const termId = parseInt(apiExamData.termId);
      const newSession: ExamTermSession = {
        termId,
        examId: parseInt(examId),
        exams: freeExams,
        currentExamType: availableTypes[0],
        currentExamIndex: 0,
        currentQuestionIndex: 0,
        answers: {},
        startTime: Date.now(),
        timeLimit:
          EXAM_TIME_LIMITS[availableTypes[0] as keyof typeof EXAM_TIME_LIMITS],
        isCompleted: false,
      };

      // Initialize section status - only first section is available
      const initialStatus: Record<string, ExamSectionStatus> = {};
      availableTypes.forEach((type, index) => {
        initialStatus[type] = index === 0 ? "in_progress" : "locked";
      });

      // Initialize section start times
      const initialStartTimes: Record<string, number> = {};
      initialStartTimes[availableTypes[0]] = Date.now();

      setSession(newSession);
      setSectionStatus(initialStatus);
      setSectionStartTimes(initialStartTimes);
      setCurrentSectionTimeRemaining(
        EXAM_TIME_LIMITS[availableTypes[0] as keyof typeof EXAM_TIME_LIMITS] *
          60,
      );
      setExamExpired(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error starting exam:", error);
      setError("Failed to start exam. Please check the exam data format.");
      setIsLoading(false);
    }
  };

  // Start exam using available exam data
  const startExam = () => {
    if (!examData) {
      setError("No exam data available");
      return;
    }

    startExamWithData(examData);
  };

  // Timer effect for current section
  useEffect(() => {
    if (!session || session.isCompleted) return;

    const currentType = session.currentExamType;
    const currentStatus = sectionStatus[currentType];

    if (currentStatus !== "in_progress") return;

    const timer = setInterval(() => {
      const startTime = sectionStartTimes[currentType];
      if (!startTime) return;

      const timeLimit =
        EXAM_TIME_LIMITS[currentType as keyof typeof EXAM_TIME_LIMITS] * 60;
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, timeLimit - elapsed);

      setCurrentSectionTimeRemaining(remaining);

      if (remaining <= 0) {
        autoSubmitSection(currentType);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.currentExamType, sectionStartTimes, sectionStatus]);

  // Get current exam and question
  const getCurrentExamAndQuestion = () => {
    if (!session) return { exam: null, question: null };

    const currentTypeExams = examsByType[session.currentExamType] || [];
    const currentExam = currentTypeExams[session.currentExamIndex];
    const currentQuestion =
      currentExam?.questions[session.currentQuestionIndex];

    if (!currentQuestion && currentExam) {
      console.error(
        `No question found at index ${session.currentQuestionIndex} in exam ${currentExam.id}`,
      );
    }

    return { exam: currentExam, question: currentQuestion };
  };

  // Handle answer selection
  const handleAnswerChange = (
    questionId: number,
    answerId: number,
    isChecked?: boolean,
  ) => {
    if (!session) return;

    setSession((prev) => {
      if (!prev) return prev;

      const currentAnswers = prev.answers[questionId] || [];
      let newAnswers;

      if (isChecked === undefined) {
        newAnswers = [answerId.toString()];
      } else {
        if (isChecked) {
          newAnswers = [...currentAnswers, answerId.toString()];
        } else {
          newAnswers = currentAnswers.filter(
            (id) => id !== answerId.toString(),
          );
        }
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

  // Handle writing answer
  const handleWritingAnswerChange = (questionId: number, text: string) => {
    if (!session) return;

    setSession((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: [text], // Store the text as an array for consistency
        },
      };
    });
  };

  // Submit individual speaking question - called when user records audio
  const submitSpeakingQuestion = useCallback(
    async (questionId: number, speakingFile: string) => {
      if (!session) return;

      try {
        // Find the exam that contains this question
        let targetExamId: number | null = null;

        allExams.forEach((exam) => {
          const question = exam.questions.find((q) => q.id === questionId);

          if (question && exam.examType === "SPEAKING") {
            targetExamId = exam.id;
          }
        });

        if (targetExamId === null) {
          console.error(
            `Could not find exam for speaking question ${questionId}`,
          );
          return;
        }

        // Simplified request body for speaking submissions
        const submitRequest = {
          examId: targetExamId, // Use the individual exam ID from take-exam response (e.g., 21)
          responses: {
            [questionId]: "speaking_response",
          },
          termId: session.termId, // Use termId from take-exam response (e.g., 69)
          speakingFile, // Base64 audio file
        };

        console.log(
          `Submitting speaking question ${questionId} for exam ${targetExamId}:`,
          submitRequest,
        );
        await submitExamMutation.mutateAsync(
          submitRequest as unknown as ExamSubmitRequest,
        );

        console.log(
          `Successfully submitted speaking question ${questionId} for exam ${targetExamId}`,
        );
      } catch (error) {
        console.error(
          `Failed to submit speaking question ${questionId}:`,
          error,
        );
        alert("Failed to submit speaking response. Please try again.");
      }
    },
    [session, submitExamMutation, allExams],
  );

  // Handle speaking answer (audio base64) - store audio without auto-submit
  const handleSpeakingAnswerChange = useCallback(
    (questionId: number, audioBase64: string) => {
      if (!session) return;

      setSession((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: [audioBase64], // Store the base64 audio as an array for consistency
          },
        };
      });

      // Note: Submission now happens on navigation, not recording completion
    },
    [session],
  );

  // Auto submit section when time expires
  const autoSubmitSection = useCallback(
    (examType: string) => {
      console.log(`Auto-submitting section: ${examType}`);

      setSectionStatus((prev) => ({
        ...prev,
        [examType]: "expired",
      }));

      const currentIndex = examTypes.indexOf(examType as any);
      const nextIndex = currentIndex + 1;

      if (nextIndex < examTypes.length) {
        const nextType = examTypes[nextIndex];
        setSectionStatus((prev) => ({
          ...prev,
          [nextType]: "in_progress",
        }));

        setSectionStartTimes((prev) => ({
          ...prev,
          [nextType]: Date.now(),
        }));

        setSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentExamType: nextType,
            currentExamIndex: 0,
            currentQuestionIndex: 0,
          };
        });

        setCurrentSectionTimeRemaining(
          EXAM_TIME_LIMITS[nextType as keyof typeof EXAM_TIME_LIMITS] * 60,
        );
      } else {
        submitExam();
      }
    },
    [examTypes, submitExamMutation],
  );

  // Complete current section and move to next
  const completeSection = useCallback(
    (examType: string) => {
      console.log(`Completing section: ${examType}`);

      setSectionStatus((prev) => ({
        ...prev,
        [examType]: "completed",
      }));

      const currentIndex = examTypes.indexOf(examType as any);
      const nextIndex = currentIndex + 1;

      console.log(
        `Current exam type index: ${currentIndex}, Next index: ${nextIndex}`,
      );
      console.log(`Available exam types: ${examTypes.join(", ")}`);

      // Special handling for SPEAKING - automatically show results (for non-final questions)
      if (examType === "SPEAKING") {
        setShowSuccessDialog(true);
        setSession((prev) => (prev ? { ...prev, isCompleted: true } : null));
        return;
      }

      if (nextIndex < examTypes.length) {
        const nextType = examTypes[nextIndex];
        console.log(`Moving to next exam type: ${nextType}`);

        setSectionStatus((prev) => ({
          ...prev,
          [nextType]: "in_progress",
        }));

        setSectionStartTimes((prev) => ({
          ...prev,
          [nextType]: Date.now(),
        }));

        setSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentExamType: nextType,
            currentExamIndex: 0,
            currentQuestionIndex: 0,
          };
        });

        setCurrentSectionTimeRemaining(
          EXAM_TIME_LIMITS[nextType as keyof typeof EXAM_TIME_LIMITS] * 60,
        );
      } else {
        console.log("All sections completed, submitting exam");
        submitExam();
      }
    },
    [examTypes, setShowSuccessDialog],
  );

  // Enhanced navigation logic with completed section locking
  const navigateToExamTypePart = (examType: string, partIndex: number) => {
    if (!session) return;

    const targetStatus = sectionStatus[examType];

    if (examType !== session.currentExamType) {
      if (!["available", "in_progress"].includes(targetStatus)) {
        return;
      }

      if (targetStatus === "available") {
        setSectionStatus((prev) => ({
          ...prev,
          [examType]: "in_progress",
        }));

        setSectionStartTimes((prev) => ({
          ...prev,
          [examType]: Date.now(),
        }));

        setCurrentSectionTimeRemaining(
          EXAM_TIME_LIMITS[examType as keyof typeof EXAM_TIME_LIMITS] * 60,
        );
      }
    }

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

  // Submit current speaking question during navigation
  const submitCurrentSpeakingQuestion = useCallback(async () => {
    if (!session || session.currentExamType !== "SPEAKING") return;

    const currentTypeExams = examsByType[session.currentExamType] || [];
    const currentExam = currentTypeExams[session.currentExamIndex];

    if (!currentExam) return;

    const currentQuestion = currentExam.questions[session.currentQuestionIndex];
    if (!currentQuestion) return;

    // Check if this question has audio recorded and hasn't been submitted yet
    const hasAudio = session.answers[currentQuestion.id]?.[0];
    const alreadySubmitted = submittedSpeakingQuestions.has(currentQuestion.id);

    if (hasAudio && !alreadySubmitted) {
      try {
        await submitSpeakingQuestion(currentQuestion.id, hasAudio);
        setSubmittedSpeakingQuestions((prev) =>
          new Set(prev).add(currentQuestion.id),
        );
        console.log(
          `Successfully submitted speaking question ${currentQuestion.id} during navigation`,
        );
      } catch (error) {
        console.error(
          `Failed to submit speaking question ${currentQuestion.id} during navigation:`,
          error,
        );
        // Don't block navigation if submission fails, just log the error
      }
    }
  }, [
    session,
    examsByType,
    submitSpeakingQuestion,
    submittedSpeakingQuestions,
  ]);

  // Submit final speaking question and complete exam
  const submitFinalSpeaking = useCallback(async () => {
    if (!session || session.currentExamType !== "SPEAKING") return;

    try {
      // Submit current speaking question first
      await submitCurrentSpeakingQuestion();

      // TODO: Add API call to set room time to 0 to lock it
      // This would be something like: await lockExamRoom(session.examId);

      console.log("Final speaking submission completed, locking room...");

      // Show results dialog
      setShowSuccessDialog(true);
      setSession((prev) => (prev ? { ...prev, isCompleted: true } : null));

      // Send grading request for all SPEAKING parts automatically
      clearPersistedState();
    } catch (error) {
      console.error("Failed to submit final speaking response:", error);
      alert("Failed to submit final speaking response. Please try again.");
    }
  }, [session, submitCurrentSpeakingQuestion, clearPersistedState]);

  // Navigate to next question (modified to submit speaking questions)
  const nextQuestion = useCallback(async () => {
    if (!session) return;

    // Submit current speaking question before navigation
    await submitCurrentSpeakingQuestion();

    setSession((prev) => {
      if (!prev) return prev;

      const currentTypeExams = examsByType[prev.currentExamType] || [];
      const currentExam = currentTypeExams[prev.currentExamIndex];

      if (!currentExam) return prev;

      const isLastQuestion =
        prev.currentQuestionIndex >= currentExam.questions.length - 1;

      if (isLastQuestion) {
        const isLastPartInType =
          prev.currentExamIndex >= currentTypeExams.length - 1;

        if (isLastPartInType) {
          const currentTypeIndex = examTypes.indexOf(prev.currentExamType);
          const isLastExamType = currentTypeIndex >= examTypes.length - 1;

          if (isLastExamType) {
            completeSection(prev.currentExamType);
            return prev;
          } else {
            completeSection(prev.currentExamType);
            return prev;
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
  }, [
    session,
    examsByType,
    examTypes,
    completeSection,
    submitCurrentSpeakingQuestion,
  ]);

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
        // Don't allow navigation to previous completed sections
        const currentTypeIndex = examTypes.indexOf(prev.currentExamType);

        if (currentTypeIndex > 0) {
          const prevExamType = examTypes[currentTypeIndex - 1];
          const prevStatus = sectionStatus[prevExamType];

          // Only allow if previous section is still in progress
          if (prevStatus === "in_progress") {
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
      }

      return prev;
    });
  };

  // Submit writing exams - called when user clicks "Complete WRITING"
  const submitWritingExam = useCallback(async () => {
    if (!session) return;

    try {
      // Group writing questions by their exam ID
      const writingExamSubmissions: Record<
        number,
        { responses: Record<string, string> }
      > = {};

      // Build responses grouped by exam for writing questions only
      Object.entries(session.answers).forEach(([questionId, answers]) => {
        const questionIdNum = parseInt(questionId);

        // Find the question and its exam
        allExams.forEach((exam) => {
          const question = exam.questions.find((q) => q.id === questionIdNum);

          if (question && exam.examType === "WRITING") {
            if (!writingExamSubmissions[exam.id]) {
              writingExamSubmissions[exam.id] = { responses: {} };
            }
            // For writing questions, the answer is text from user input

            writingExamSubmissions[exam.id].responses[questionId] =
              answers[0] || "";
          }
        });
      });

      // Submit each writing exam separately using their individual exam ID
      const submissionPromises = Object.entries(writingExamSubmissions).map(
        async ([examId, { responses }]) => {
          const submitRequest: ExamSubmitRequest = {
            examId: parseInt(examId), // Use the individual exam ID from take-exam response (e.g., 13, 20)
            responses, // Format: { "17": "user input text", "26": "user input text" }
            termId: session.termId,
          };

          console.log(`Submitting writing exam ${examId}:`, submitRequest);
          return submitExamMutation.mutateAsync(submitRequest);
        },
      );

      // Wait for all writing exams to be submitted
      await Promise.all(submissionPromises);

      console.log("All writing exams submitted successfully");

      // After successful writing submissions, send grading request(s) for WRITING exams
      try {
        const examIdsForGrading = Object.keys(writingExamSubmissions).map((id) => parseInt(id));

        if (examIdsForGrading.length > 0) {
          await Promise.allSettled(
            examIdsForGrading.map((id) =>
              gradingRequestMutation.mutateAsync([{ termId: session.termId, examId: id }]),
            ),
          );
          console.log("Grading requests submitted for writing exams:", examIdsForGrading);
        }
      } catch (e) {
        console.error("Failed to send grading request(s) for writing exams:", e);
      }

      // Continue to next section
      completeSection("WRITING");
    } catch (error) {
      console.error("Failed to submit writing exam:", error);
      alert("Failed to submit writing exam. Please try again.");
    }
  }, [session, submitExamMutation, allExams, completeSection]);

  // Submit exam (for listening/reading or final submission)
  const submitExam = useCallback(async () => {
    if (!session) return;

    try {
      const responses: Record<string, string> = {};
      let speakingFile: string | undefined;

      // Build responses for listening/reading questions only (not writing)
      Object.entries(session.answers).forEach(([questionId, answers]) => {
        const questionIdNum = parseInt(questionId);

        // Find the question to determine its type
        let isSpeakingQuestion = false;
        let isListeningOrReadingQuestion = false;

        // Search through all exams to find this question
        allExams.forEach((exam) => {
          const question = exam.questions.find((q) => q.id === questionIdNum);

          if (question) {
            isSpeakingQuestion = exam.examType === "SPEAKING";
            isListeningOrReadingQuestion =
              exam.examType === "LISTENING" || exam.examType === "READING";
          }
        });

        if (isSpeakingQuestion) {
          // For speaking questions, the answer is base64 audio
          speakingFile = answers[0] || "";
          responses[questionId] = "speaking_response";
        } else if (isListeningOrReadingQuestion) {
          // For listening/reading questions, the answer is answer IDs
          responses[questionId] = answers.join(",");
        }
        // Note: Writing questions are handled separately in submitWritingExam
      });

      const submitRequest: ExamSubmitRequest = {
        examId: session.examId,
        responses,
        termId: session.termId,
        speakingFile,
      };

      await submitExamMutation.mutateAsync(submitRequest);

      setShowSuccessDialog(true);
      setSession((prev) => (prev ? { ...prev, isCompleted: true } : null));

      // Clear persisted state after successful submission
      clearPersistedState();
    } catch (error) {
      console.error("Failed to submit exam:", error);
      alert("Failed to submit exam. Please try again.");
    }
  }, [session, submitExamMutation, clearPersistedState, allExams]);

  // Submit all exams at once (unified single API call)
  const submitAllExams = useCallback(async () => {
    if (!session) return { success: false, error: "No session available" };

    try {
      // Build a map of examId -> responses for all types
      const examResponsesMap: Record<number, Record<string, string>> = {};

      allExams.forEach((exam) => {
        exam.questions.forEach((q) => {
          const answers = session.answers[q.id];
          if (!answers || answers.length === 0) return;

          if (!examResponsesMap[exam.id]) examResponsesMap[exam.id] = {};

          if (exam.examType === "LISTENING" || exam.examType === "READING") {
            // Multiple choice: join selected answer IDs with comma
            examResponsesMap[exam.id][q.id.toString()] = answers.join(",");
          } else if (exam.examType === "WRITING") {
            // Text answer
            examResponsesMap[exam.id][q.id.toString()] = answers[0] || "";
          } else if (exam.examType === "SPEAKING") {
            // Place base64 audio directly as content in responses
            examResponsesMap[exam.id][q.id.toString()] = answers[0] || "";
          }
        });
      });

      const payload = {
        termId: session.termId,
        exams: Object.entries(examResponsesMap).map(([examId, responses]) => ({
          examId: parseInt(examId),
          responses,
        })),
      };

      // Call the unified endpoint (same path), expecting bulk response
      const res = await submitAllExamsMutation.mutateAsync(payload as any);

      const success = !!res?.success;
      const message = res?.message || (success ? "Exam submitted successfully!" : "Submit failed");
      const details = res?.data?.results || [];

      if (success) {
        setSession((prev) => (prev ? { ...prev, isCompleted: true } : null));
        clearPersistedState();
        return {
          success: true,
          message,
          failedTypes: [],
          details,
        };
      }

      return {
        success: false,
        error: message || "Failed to submit exam.",
        partial: false,
        details,
      };
    } catch (error: any) {
      console.error("Failed to submit all exams (unified):", error);
      const errMsg = error?.message || "An unexpected error occurred during submission.";
      return {
        success: false,
        error: errMsg,
        partial: false,
      };
    }
  }, [session, submitAllExamsMutation, clearPersistedState, allExams]);

  // Navigate to specific question index within the current exam type
  const navigateToQuestion = useCallback(
    async (globalQuestionIndex: number) => {
      if (!session) return;

      // Submit current speaking question before navigation
      await submitCurrentSpeakingQuestion();

      const currentTypeExams = examsByType[session.currentExamType] || [];
      let questionCount = 0;
      let targetExamIndex = 0;
      let targetQuestionIndex = 0;

      // Find which exam and question index corresponds to the global index
      for (
        let examIndex = 0;
        examIndex < currentTypeExams.length;
        examIndex++
      ) {
        const exam = currentTypeExams[examIndex];
        const examQuestionCount = exam.questions.length;

        if (questionCount + examQuestionCount > globalQuestionIndex) {
          targetExamIndex = examIndex;
          targetQuestionIndex = globalQuestionIndex - questionCount;
          break;
        }

        questionCount += examQuestionCount;
      }

      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentExamIndex: targetExamIndex,
          currentQuestionIndex: targetQuestionIndex,
        };
      });
    },
    [session, examsByType, submitCurrentSpeakingQuestion],
  );

  // Reset exam
  const resetExam = () => {
    setSession(null);
    setShowSuccessDialog(false);
    setSectionStatus({});
    setSectionStartTimes({});
    setCurrentSectionTimeRemaining(0);
    setExamData(null);
    setExamExpired(false);

    clearPersistedState();
  };

  return {
    // Data
    examId,
    isLoading,
    error,
    session,
    examsByType,
    examTypes,
    allExams,

    // UI State
    showSuccessDialog,
    sidebarOpen,
    examExpired,

    // Exam State
    sectionStatus,
    currentSectionTimeRemaining,

    // Computed
    getCurrentExamAndQuestion,
    isMobile,
    router,
    submitExamMutation,

    // Actions
    startExam,
    startExamWithData,
    handleAnswerChange,
    handleWritingAnswerChange,
    handleSpeakingAnswerChange,
    navigateToExamTypePart,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    completeSection,
    submitExam,
    submitAllExams,
    submitWritingExam,
    submitSpeakingQuestion,
    submitFinalSpeaking,
    resetExam,

    // UI Actions
    setSidebarOpen,
    setShowSuccessDialog,
  };
}
