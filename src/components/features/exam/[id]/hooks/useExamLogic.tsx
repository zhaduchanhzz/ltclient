import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  useGetAllExamsQuery,
  useSubmitExamMutation,
} from "@/services/apis/exam";
import {
  ExamSubmitRequest,
  ExamTermSession,
  SimulationExam,
} from "@/services/types/exam";

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
  lastSavedAt: number;
};

export function useExamLogic() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const examId = params.id as string;

  const { data: examsData, isLoading, error } = useGetAllExamsQuery(true);
  const submitExamMutation = useSubmitExamMutation();

  const [session, setSession] = useState<ExamTermSession | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Time management state
  const [sectionStatus, setSectionStatus] = useState<
    Record<string, ExamSectionStatus>
  >({});
  const [sectionStartTimes, setSectionStartTimes] = useState<
    Record<string, number>
  >({});
  const [currentSectionTimeRemaining, setCurrentSectionTimeRemaining] =
    useState(0);

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

  // Load persisted state on mount
  useEffect(() => {
    const savedState = loadStateFromLocalStorage();

    if (savedState && savedState.session && !savedState.session.isCompleted) {
      setSession(savedState.session);
      setSectionStatus(savedState.sectionStatus);
      setSectionStartTimes(savedState.sectionStartTimes);

      // Calculate remaining time for current section
      const currentType = savedState.session.currentExamType;
      const startTime = savedState.sectionStartTimes[currentType];

      if (startTime) {
        const timeLimit =
          EXAM_TIME_LIMITS[currentType as keyof typeof EXAM_TIME_LIMITS] * 60;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, timeLimit - elapsed);
        setCurrentSectionTimeRemaining(remaining);
      }
    }
  }, [loadStateFromLocalStorage]);

  // Save state to localStorage whenever critical state changes
  useEffect(() => {
    if (session && !session.isCompleted) {
      const stateToSave: PersistedExamState = {
        session,
        sectionStatus,
        sectionStartTimes,
        lastSavedAt: Date.now(),
      };
      saveStateToLocalStorage(stateToSave);
    }
  }, [session, sectionStatus, sectionStartTimes, saveStateToLocalStorage]);

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [session?.currentQuestionIndex, isMobile]);

  // Generate termId when starting exam
  const generateTermId = () => Math.floor(Math.random() * 100000000);

  // Initialize exam session
  const startExam = () => {
    if (allExams.length === 0) return;

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
      timeLimit:
        EXAM_TIME_LIMITS[examTypes[0] as keyof typeof EXAM_TIME_LIMITS],
      isCompleted: false,
    };

    // Initialize section status - only first section is available
    const initialStatus: Record<string, ExamSectionStatus> = {};
    examTypes.forEach((type, index) => {
      initialStatus[type] = index === 0 ? "in_progress" : "locked";
    });

    // Initialize section start times
    const initialStartTimes: Record<string, number> = {};
    initialStartTimes[examTypes[0]] = Date.now();

    setSession(newSession);
    setSectionStatus(initialStatus);
    setSectionStartTimes(initialStartTimes);
    setCurrentSectionTimeRemaining(
      EXAM_TIME_LIMITS[examTypes[0] as keyof typeof EXAM_TIME_LIMITS] * 60,
    );
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
      setSectionStatus((prev) => ({
        ...prev,
        [examType]: "completed",
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

  // Submit exam
  const submitExam = useCallback(async () => {
    if (!session) return;

    try {
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

      setShowSuccessDialog(true);
      setSession((prev) => (prev ? { ...prev, isCompleted: true } : null));

      // Clear persisted state after successful submission
      clearPersistedState();
    } catch (error) {
      console.error("Failed to submit exam:", error);
      alert("Failed to submit exam. Please try again.");
    }
  }, [session, submitExamMutation, clearPersistedState]);

  // Reset exam
  const resetExam = () => {
    setSession(null);
    setShowSuccessDialog(false);
    setSectionStatus({});
    setSectionStartTimes({});
    setCurrentSectionTimeRemaining(0);

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
    handleAnswerChange,
    navigateToExamTypePart,
    nextQuestion,
    previousQuestion,
    completeSection,
    submitExam,
    resetExam,

    // UI Actions
    setSidebarOpen,
  };
}
