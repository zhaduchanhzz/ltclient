/* eslint-disable padding-line-between-statements */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// Real Exam Page: Similar to simulation exam page but DISALLOWS navigating back to previous sections
// once their time has expired or they are completed.

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
  Paper,
  Slide,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useExamLogic } from "../[id]/hooks/useExamLogic";
import ExamHeader from "../[id]/components/ExamHeader";
import QuestionCard from "../[id]/components/QuestionCard";
import { API_PATH } from "@/consts/api-path";
import { ApiServerURL } from "@/utils/config";
import { useAppContextHandle } from "@/contexts/AppContext";
import { useTakeExamMutation, useGradingRequestMutation } from "@/services/apis/exam";
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

const restrictBackAfterExpire = true; // core difference for real exam

export default function RealExamPage() {
  const {
    examId,
    isLoading,
    error,
    session,
    examsByType,
    examTypes,
    allExams,
    examExpired,
    currentSectionTimeRemaining,
    getCurrentExamAndQuestion,
    router,
    startExam,
    handleAnswerChange,
    handleWritingAnswerChange,
    handleSpeakingAnswerChange,
    submitAllExams,
    sectionStatus,
  } = useExamLogic();

  const { updateAppState } = useAppContextHandle();
  const { mutateAsync: takeExam } = useTakeExamMutation();
  const gradingRequestMutation = useGradingRequestMutation();

  const [currentExamPartIndex, setCurrentExamPartIndex] = useState(0);
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionsRef = useRef<Record<number, { leftTop: number; rightTop: number }>>({});

  const allExamsFlat = useMemo(() => {
    const result: any[] = [];
    examTypes.forEach((examType) => {
      (examsByType[examType] || []).forEach((exam) => result.push(exam));
    });
    return result;
  }, [examTypes, examsByType]);

  const currentExamPart = allExamsFlat[currentExamPartIndex];

  // ===== Added derived state & helpers (restored) =====
  // Restriction helpers
  const isSectionLockedForReturn = (targetExamType: string) => {
    if (!restrictBackAfterExpire || !session) return false;
    if (targetExamType === session.currentExamType) return false;
    const status = sectionStatus[targetExamType];
    return status === "expired" || status === "completed";
  };

  const isPartDisabled = (index: number) => {
    const part = allExamsFlat[index];
    if (!part || !session) return true;
    if (part.examType === session.currentExamType) return false;
    return isSectionLockedForReturn(part.examType);
  };

  // Per-part answered count
  const calculateCurrentPartAnswered = () => {
    if (!session || !currentExamPart) return { answered: 0, total: 0 };
    let answered = 0;
    const total = currentExamPart.questions.length;
    currentExamPart.questions.forEach((q: any) => {
      if (session.answers[q.id]?.length) answered++;
    });
    return { answered, total };
  };
  const { answered: partAnswered, total: partTotal } = calculateCurrentPartAnswered();

  // Total answered across all parts
  const calculateAllAnswered = () => {
    if (!session) return { answered: 0, total: 0 };
    let answered = 0;
    let total = 0;
    allExamsFlat.forEach((exam) => {
      exam.questions.forEach((q: any) => {
        total++;
        if (session.answers[q.id]?.length) answered++;
      });
    });
    return { answered, total };
  };
  const { answered: totalAnswered, total: totalQuestions } = calculateAllAnswered();

  // Calculate results by type similar to test exam UI
  const examResultsByType = useMemo(() => {
    if (!session || !allExams) return {} as Record<string, { correct: number; total: number; percentage?: number; status: string }>;
    const results: Record<string, { correct: number; total: number; percentage?: number; status: string }> = {};

    examTypes.forEach((type) => {
      const typeExams = allExams.filter((e) => e.examType === type);
      let correct = 0;
      let total = 0;
      let status = "Completed";

      typeExams.forEach((exam) => {
        exam.questions.forEach((q) => {
          total++;
          const userAnswers = session.answers[q.id] || [];
          if (type === "LISTENING" || type === "READING") {
            const correctIds = q.answers.filter((a) => a.isCorrect).map((a) => a.id.toString());
            const aSet = new Set(userAnswers);
            const cSet = new Set(correctIds);
            const isCorrect = aSet.size === cSet.size && [...aSet].every((id) => cSet.has(id));
            if (isCorrect) correct++;
          } else {
            if (userAnswers.length > 0) correct++;
            status = "Pending Grading";
          }
        });
      });

      const percentage = total > 0 && (type === "LISTENING" || type === "READING") ? Math.round((correct / total) * 100) : undefined;
      results[type] = { correct, total, percentage, status };
    });

    return results;
  }, [session, allExams, examTypes]);

  const grandTotal = useMemo(() => {
    const init = { answered: 0, total: 0 };
    return Object.values(examResultsByType).reduce((acc, r) => {
      acc.answered += r.correct;
      acc.total += r.total;
      return acc;
    }, init);
  }, [examResultsByType]);

  // Navigation functions
  const navigateToPreviousPart = () => {
    if (currentExamPartIndex === 0) return;
    const prevIndex = currentExamPartIndex - 1;
    const prevPart = allExamsFlat[prevIndex];
    if (!prevPart) return;
    if (isSectionLockedForReturn(prevPart.examType)) return; // block going back to expired/completed
    setCurrentExamPartIndex(prevIndex);
  };

  const navigateToNextPart = () => {
    if (currentExamPartIndex >= allExamsFlat.length - 1) return;
    setCurrentExamPartIndex(currentExamPartIndex + 1);
  };

  const navigateToPart = (index: number) => {
    if (index === currentExamPartIndex) return;
    if (index < 0 || index >= allExamsFlat.length) return;
    if (isPartDisabled(index)) return;
    setCurrentExamPartIndex(index);
  };

  // Submission state & handler
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionDialog, setSubmissionDialog] = useState<{
    open: boolean;
    success: boolean;
    message: string;
    failedTypes?: string[];
    partial?: boolean;
    details?: any[];
  }>({ open: false, success: false, message: "" });

  const handleSubmitAllAnswers = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitAllExams();
      if (result.success) {
        setSubmissionDialog({
          open: true,
          success: true,
          message: result.message || "Exam submitted successfully!",
          failedTypes: [],
          details: Array.isArray(result.details) ? result.details : result.details ? [result.details] : [],
        });
      } else {
        setSubmissionDialog({
          open: true,
            success: false,
            message: result.error || "Failed to submit exam",
            failedTypes: result.failedTypes || [],
            partial: result.partial,
            details: Array.isArray(result.details) ? result.details : result.details ? [result.details] : [],
        });
      }
    } catch (e: any) {
      setSubmissionDialog({ open: true, success: false, message: e?.message || "Unexpected submission error", failedTypes: ["WRITING", "SPEAKING"] });
    } finally {
      setIsSubmitting(false);
    }
  };
  // ===== end added logic =====

  // Ensure we don't stay on an expired/completed section; allow forward navigation otherwise
  useEffect(() => {
    if (!session) return;
    const currentType = currentExamPart?.examType;

    // If current viewed section is locked (expired/completed), redirect to an allowed one
    if (currentType && isSectionLockedForReturn(currentType)) {
      // Prefer active section if available and not locked
      let targetIndex = allExamsFlat.findIndex((p) => p.examType === session.currentExamType);
      if (targetIndex === -1 || isPartDisabled(targetIndex)) {
        // Fallback: first non-locked part
        targetIndex = allExamsFlat.findIndex((p) => !isSectionLockedForReturn(p.examType));
      }
      if (targetIndex !== -1 && targetIndex !== currentExamPartIndex) {
        setCurrentExamPartIndex(targetIndex);
      }
    }
  }, [session?.currentExamType, sectionStatus, allExamsFlat, currentExamPart?.examType, currentExamPartIndex]);

  // Restore scroll per part
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
    };
    const id = window.setTimeout(apply, 0);
    return () => window.clearTimeout(id);
  }, [currentExamPartIndex]);

  const handleLeftScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const pos = scrollPositionsRef.current[currentExamPartIndex] || { leftTop: 0, rightTop: 0 };
    pos.leftTop = e.currentTarget.scrollTop;
    scrollPositionsRef.current[currentExamPartIndex] = pos;
  };
  const handleRightScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const pos = scrollPositionsRef.current[currentExamPartIndex] || { leftTop: 0, rightTop: 0 };
    pos.rightTop = e.currentTarget.scrollTop;
    scrollPositionsRef.current[currentExamPartIndex] = pos;
  };

  const getGlobalQuestionOffset = useMemo(() => {
    let offset = 0;
    for (let i = 0; i < currentExamPartIndex; i++) {
      if (allExamsFlat[i]) offset += allExamsFlat[i].questions.length;
    }
    return offset;
  }, [currentExamPartIndex, allExamsFlat]);

  // Function to request a new real exam (persist under key exam_session_state_real)
  const createRealExam = async () => {
    try {
      updateAppState({ appAlertInfo: { message: "Đang tạo bài thi...", severity: "info" } });
      const response = await takeExam();
      if (response.success) {
        const examStateKey = `exam_session_state_${examId}`; // examId = 'real'
        const examState = {
          session: null,
          sectionStatus: {},
          sectionStartTimes: {},
          examData: response.data,
          lastSavedAt: Date.now(),
        };
        localStorage.setItem(examStateKey, JSON.stringify(examState));
        updateAppState({ appAlertInfo: { message: "Đã tạo đề thi thành công!", severity: "success" } });
        // Reload logic hook state
        window.location.reload();
      } else {
        updateAppState({ appAlertInfo: { message: response.message || "Tạo đề thi thất bại", severity: "error" } });
      }
    } catch (err: any) {
      updateAppState({ appAlertInfo: { message: err?.message || "Lỗi tạo bài thi", severity: "error" } });
    }
  };

  // Grading request for WRITING/SPEAKING like test exam
  const handleGradingRequest = async () => {
    if (!session?.termId || !allExams) return;
    const gradable = allExams.filter((e) => e.examType === "WRITING" || e.examType === "SPEAKING");
    if (gradable.length === 0) {
      updateAppState({ appAlertInfo: { message: "Không có phần thi nào cần chấm điểm.", severity: "info" } });
      return;
    }
    try {
      const payload: Array<{ termId: number; examType: "WRITING" | "SPEAKING" }> = [];
      if (gradable.some((g) => g.examType === "WRITING")) payload.push({ termId: session.termId, examType: "WRITING" });
      if (gradable.some((g) => g.examType === "SPEAKING")) payload.push({ termId: session.termId, examType: "SPEAKING" });
      await gradingRequestMutation.mutateAsync(payload as any);
      updateAppState({ appAlertInfo: { message: "Đã gửi yêu cầu chấm điểm!", severity: "success" } });
      router.push("/");
    } catch {
      updateAppState({ appAlertInfo: { message: "Gửi yêu cầu chấm điểm thất bại. Vui lòng thử lại.", severity: "error" } });
    }
  };

  // Loading / error states
  if (isLoading) return <Container sx={{ display: "flex", justifyContent: "center", p: 4 }}><Typography variant="caption">Loading exam...</Typography></Container>;

  if (examExpired) {
    // If this is the real exam route, allow user to create a new exam rather than just error
    if (examId === "real") {
      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Avatar sx={{ width: 72, height: 72, mx: "auto", mb: 2, bgcolor: "primary.main" }}>
              <AccessTime sx={{ fontSize: 38 }} />
            </Avatar>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Bắt đầu bài thi mô phỏng
            </Typography>
            <Typography variant="caption" sx={{ mb: 3, display: "block" }}>
              Nhấn nút bên dưới để nhận đề thi. Sau khi hết thời gian của một kỹ năng, bạn sẽ không thể quay lại kỹ năng đó.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" size="large" onClick={createRealExam} startIcon={<PlayArrow />}>Nhận đề thi</Button>
              <Button variant="outlined" size="large" onClick={() => router.push("/exam/room")}>Về phòng thi</Button>
            </Stack>
          </Paper>
        </Container>
      );
    }
    // fallback original not available UI
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center", background: "linear-gradient(135deg, #f44336 0%, #e91e63 100%)", color: "white", borderRadius: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2, bgcolor: "rgba(255,255,255,0.2)" }}><AccessTime sx={{ fontSize: 40 }} /></Avatar>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Exam Not Available</Typography>
          <Typography variant="caption" sx={{ mb: 3, display: "block" }}>Không tìm thấy dữ liệu đề thi. Vui lòng tạo bài thi mới.</Typography>
          <Button variant="contained" onClick={() => router.push("/exam/room")}>Quay lại phòng thi</Button>
        </Paper>
      </Container>
    );
  }

  if (error) return <Container sx={{ p: 4 }}><Alert severity="error">Failed to load exam data. {error}</Alert></Container>;

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Slide direction="up" in mountOnEnter unmountOnExit>
          <Paper sx={{ p: 4, textAlign: "center", background: "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)", color: "white", borderRadius: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2, bgcolor: "rgba(255,255,255,0.15)" }}><Quiz sx={{ fontSize: 40 }} /></Avatar>
            <Typography variant="h6" fontWeight="bold" gutterBottom>VSTEP REAL EXAM</Typography>
            <Typography variant="caption" sx={{ mb: 4, opacity: .9, display: "block" }}>Bài thi mô phỏng - không thể quay lại phần trước sau khi hết thời gian.</Typography>
            <Grid2 container spacing={3} sx={{ mb: 4 }}>
              <Grid2 size={{ xs:12, sm:6 }}>
                <Card sx={{ bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)" }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <AccessTime />
                      <Typography variant="caption">Tổng thời gian</Typography>
                    </Stack>
                    <Typography variant="subtitle1" fontWeight="bold">{Object.values(EXAM_TIME_LIMITS).reduce((a, b) => a + b, 0)} phút</Typography>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs:12, sm:6 }}>
                <Card sx={{ bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)" }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Assignment />
                      <Typography variant="caption">Số phần thi</Typography>
                    </Stack>
                    <Typography variant="subtitle1" fontWeight="bold">{allExams.length}</Typography>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>
            <Button variant="contained" size="large" startIcon={<PlayArrow />} disabled={allExams.length===0} onClick={startExam} sx={{ py:2, px:6, fontSize:"1.1rem", fontWeight:"bold" }}>Bắt đầu thi</Button>
            {allExams.length===0 && <Alert severity="warning" sx={{ mt:3 }}>Không có phần thi khả dụng.</Alert>}
          </Paper>
        </Slide>
      </Container>
    );
  }

  const { exam: currentExam, question: currentQuestion } = getCurrentExamAndQuestion();
  if (!currentExam || !currentQuestion) {
    return <Container><Alert severity="error">Failed to load current question.</Alert></Container>;
  }

  const isReading = currentExamPart?.examType === "READING";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <ExamHeader session={session} currentSectionTimeRemaining={currentSectionTimeRemaining} answeredCount={totalAnswered} totalCount={totalQuestions} />

      {/*<Paper elevation={2} sx={{ px:3, py:0.5, display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom: "1px solid", borderColor:"divider" }}>*/}
      {/*  <Typography variant="subtitle2" fontWeight="bold">Part {currentExamPartIndex + 1} / {allExamsFlat.length}</Typography>*/}
      {/*  <Box sx={{ display:"flex", gap:1 }}>*/}
      {/*    <Button variant="outlined" size="small" onClick={navigateToPreviousPart} disabled={currentExamPartIndex===0 || (currentExamPartIndex>0 && isSectionLockedForReturn(allExamsFlat[currentExamPartIndex-1].examType))}>Previous Part</Button>*/}
      {/*    <Button variant="outlined" size="small" onClick={navigateToNextPart} disabled={currentExamPartIndex===allExamsFlat.length-1}>Next Part</Button>*/}
      {/*  </Box>*/}
      {/*</Paper>*/}

      {isReading ? (
        <Box sx={{ flexGrow:1, display:"flex", flexDirection:{ xs:"column", md:"row" }, overflow:"hidden", height:"calc(100vh - 120px)" }}>
          <Box ref={leftPanelRef} onScroll={handleLeftScroll} sx={{ width:{ xs:"100%", md:"50%"}, height:{ xs:"40%", md:"100%"}, overflow:"auto", borderRight:{ md:"1px solid"}, borderBottom:{ xs:"1px solid", md:"none"}, borderColor:"divider", p: 1 }}>
            <Paper elevation={2} sx={{ p:1, mb:1.5, bgcolor: ExamTypeColors[currentExamPart.examType as keyof typeof ExamTypeColors] || "#607d8b", color:"white", position:"sticky", top:0, zIndex:10, borderRadius:2 }}>
              {currentExamPart.title ? <Box sx={{ fontSize:"0.85rem", "& img":{ maxWidth:"100%" } }} dangerouslySetInnerHTML={{ __html: currentExamPart.title }} /> : <Typography variant="subtitle2">{`${currentExamPart.examType} - Part ${currentExamPartIndex+1}`}</Typography>}
              <Typography variant="caption" sx={{ mt:0.5, opacity:.9 }}>Questions {getGlobalQuestionOffset + 1} - {getGlobalQuestionOffset + currentExamPart.questions.length} • {partAnswered}/{partTotal} answered</Typography>
            </Paper>

            {currentExamPart.description && (
              <Paper elevation={1} sx={{ p: 1 }}>
                <Typography variant="caption" sx={{ mb:1, display: "block" }}>Instructions / Passage</Typography>
                <Box sx={{ fontSize:"0.85rem", lineHeight:1.6, "& img":{ maxWidth:"100%" } }} dangerouslySetInnerHTML={{ __html: currentExamPart.description }} />
              </Paper>
            )}
          </Box>

          <Box ref={rightPanelRef} onScroll={handleRightScroll} sx={{ width:{ xs:"100%", md:"50%"}, height:{ xs:"60%", md:"100%"}, overflow:"auto", p:0 }}>
            <Box sx={{ p: 1 }}>
              {currentExamPart.questions.map((question: any, index: number) => {
                const globalQuestionNumber = getGlobalQuestionOffset + index + 1;
                return (
                  <Paper key={question.id} elevation={1} sx={{ p: 1, mb:1.5 }}>
                    <Typography variant="caption" sx={{ mb:1, color:"primary.main", display: "block" }}>Question {globalQuestionNumber}</Typography>
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
        <Box ref={rightPanelRef} onScroll={handleRightScroll} sx={{ flexGrow:1, overflow:"auto", height:"calc(100vh - 120px)", bgcolor:"background.default" }}>
          <Box sx={{ p: 1, maxWidth: 1200, mx: "auto" }}>
            <Paper elevation={2} sx={{ p: 1, mb:1.5, bgcolor: ExamTypeColors[currentExamPart.examType as keyof typeof ExamTypeColors] || "#607d8b", color:"white", position:"sticky", top:0, zIndex:10, borderRadius:2 }}>
              {currentExamPart.title ? (
                <Box sx={{ fontSize:"0.85rem", "& img":{ maxWidth:"100%" } }} dangerouslySetInnerHTML={{ __html: currentExamPart.title }} />
              ) : (
                <Typography variant="subtitle2">{`${currentExamPart.examType} - Part ${currentExamPartIndex+1}`}</Typography>
              )}
              <Typography variant="caption" sx={{ mt:0.5, opacity:.9 }}>Questions {getGlobalQuestionOffset + 1} - {getGlobalQuestionOffset + currentExamPart.questions.length} • {partAnswered}/{partTotal} answered</Typography>
            </Paper>

            {currentExamPart.examType === "LISTENING" && currentExamPart.audioFile && (
              <Paper elevation={1} sx={{ p: 1, mb:1.5 }}>
                <Typography variant="caption" sx={{ mb:1, display: "block" }}>Listening Audio</Typography>
                {(() => {
                  const raw = currentExamPart.audioFile as string;
                  const audioSrc = raw.startsWith("http")
                    ? raw
                    : raw.startsWith("/audio/")
                      ? `${ApiServerURL}${raw}`
                      : `${ApiServerURL}${API_PATH.DOWNLOAD_FILE}${raw}`;
                  return (
                    <audio controls style={{ width:"100%" }}>
                      <source src={audioSrc} />
                      Your browser does not support the audio element.
                    </audio>
                  );
                })()}
              </Paper>
            )}

            {currentExamPart.description && (
              <Paper elevation={1} sx={{ p: 1, mb:1.5 }}>
                <Typography variant="caption" sx={{ mb:1, display: "block" }}>Instructions</Typography>
                <Box sx={{ fontSize:"0.85rem", lineHeight:1.6, "& img":{ maxWidth:"100%" } }} dangerouslySetInnerHTML={{ __html: currentExamPart.description }} />
              </Paper>
            )}

            {currentExamPart.questions.map((question: any, index: number) => {
              const globalQuestionNumber = getGlobalQuestionOffset + index + 1;
              return (
                <Paper key={question.id} elevation={1} sx={{ p: 1, mb:1.5 }}>
                  <Typography variant="caption" sx={{ mb:1, color:"primary.main", display: "block" }}>Question {globalQuestionNumber}</Typography>
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

      <Paper elevation={2} sx={{ p:0.5, borderTop:"1px solid", borderColor:"divider" }}>
        <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Button variant="contained" size="small" onClick={navigateToPreviousPart} disabled={currentExamPartIndex===0 || (currentExamPartIndex>0 && isSectionLockedForReturn(allExamsFlat[currentExamPartIndex-1].examType))}>← Previous Part</Button>
          <Box sx={{ display:"flex", gap:0.5, overflowX:"auto" }}>
            {allExamsFlat.map((exam, index) => {
              const Icon = ExamTypeIcons[exam.examType as keyof typeof ExamTypeIcons];
              const isCurrent = index === currentExamPartIndex;
              let questionsInPart = exam.questions.length;
              let answeredInPart = exam.questions.reduce((acc: number, q: any) => acc + (session.answers[q.id]?.length ? 1 : 0), 0);
              const disabled = isPartDisabled(index);
              return (
                <Button
                  key={index}
                  variant={isCurrent ? "contained" : "outlined"}
                  color={isCurrent ? "primary" : "inherit"}
                  onClick={() => navigateToPart(index)}
                  startIcon={<Icon />}
                  size="small"
                  disabled={disabled}
                  sx={{ whiteSpace:"nowrap", opacity: disabled && !isCurrent ? .5 : 1 }}
                >
                  {`Part ${index + 1} (${answeredInPart}/${questionsInPart})`}
                </Button>
              );
            })}
          </Box>
          {currentExamPartIndex === allExamsFlat.length - 1 ? (
            <Button variant="contained" size="medium" color="success" onClick={handleSubmitAllAnswers} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit All"}</Button>
          ) : (
            <Button variant="contained" size="small" onClick={navigateToNextPart}>Next Part →</Button>
          )}
        </Box>
      </Paper>

      <Dialog open={submissionDialog.open} onClose={() => setSubmissionDialog({ ...submissionDialog, open:false })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
            {submissionDialog.success ? <CheckCircle color="success" /> : <AccessTime color="error" />}
            {submissionDialog.success ? "Đã hoàn thành bài thi" : "Submission Failed"}
          </Box>
        </DialogTitle>
        <DialogContent>
          {submissionDialog.success ? (
            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p:2, borderRadius:2 }}>
                <Stack direction={{ xs:"column", sm:"row" }} spacing={2} alignItems={{ xs:"start", sm:"center" }} justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Mã bài thi</Typography>
                    <Typography variant="h6" fontWeight={700}>{session?.termId}</Typography>
                  </Box>
                  <Divider flexItem orientation="vertical" sx={{ display: { xs: "none", sm: "block" } }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Tổng tiến độ</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight={700}>{grandTotal.answered}/{grandTotal.total}</Typography>
                      <Chip size="small" label={`${grandTotal.total ? Math.round((grandTotal.answered/grandTotal.total)*100) : 0}%`} color={grandTotal.total ? (Math.round((grandTotal.answered/grandTotal.total)*100) >= 70 ? "success" : "warning") : "default"} />
                    </Stack>
                  </Box>
                </Stack>
              </Paper>

              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Kết quả theo kỹ năng</Typography>
              <Grid2 container spacing={2}>
                {examTypes.map((examType) => {
                  const Icon = ExamTypeIcons[examType as keyof typeof ExamTypeIcons] || Quiz;
                  const color = ExamTypeColors[examType as keyof typeof ExamTypeColors] || "#1976d2";
                  const isAuto = examType === "LISTENING" || examType === "READING";
                  const r = examResultsByType[examType] || { correct: 0, total: 0 };
                  const percent = r.total > 0 && isAuto ? Math.round((r.correct/r.total)*100) : undefined;
                  return (
                    <Grid2 key={examType} size={{ xs:12, sm:6 }}>
                      <Paper variant="outlined" sx={{ p:2, borderRadius:2, borderLeft: `4px solid ${color}` }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Avatar sx={{ bgcolor: color, width: 36, height: 36 }}><Icon sx={{ fontSize: 20 }} /></Avatar>
                          <Typography variant="subtitle1" fontWeight={700}>{examType}</Typography>
                          <Chip size="small" variant="outlined" color={isAuto ? "success" : "default"} label={isAuto ? "Chấm tự động" : "Chấm thủ công"} sx={{ ml: "auto" }} />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                          <Typography variant="h5" fontWeight={800} color={isAuto ? (percent! >= 70 ? "success.main" : percent! >= 50 ? "warning.main" : "error.main") : "text.primary"}>
                            {r.correct}/{r.total}
                          </Typography>
                          {isAuto && <Chip size="small" color={percent! >= 70 ? "success" : percent! >= 50 ? "warning" : "error"} label={`${percent}% đúng`} />}
                          {!isAuto && <Typography variant="body2" color="text.secondary">Đang chờ chấm điểm chi tiết</Typography>}
                        </Stack>
                      </Paper>
                    </Grid2>
                  );
                })}
              </Grid2>

              <Paper variant="outlined" sx={{ p:2, borderRadius:2 }}>
                <Typography variant="body2">• Các phần thi Nghe/Đọc đã được chấm tự động • Các phần thi Viết/Nói cần gửi yêu cầu chấm điểm để nhận phản hồi chi tiết</Typography>
              </Paper>
            </Stack>
          ) : (
            <Alert severity="error" sx={{ mt:2 }}>{submissionDialog.message}</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 1.5, gap:1 }}>
          <Button onClick={() => router.push("/exam/room")} variant="outlined" fullWidth>Về phòng thi</Button>
          {submissionDialog.success && (
            <Button onClick={handleGradingRequest} variant="contained" fullWidth startIcon={<School />}>Yêu cầu chấm điểm</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
