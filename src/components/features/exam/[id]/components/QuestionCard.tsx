import { ExamTermSession } from "@/services/types/exam";
import { Mic, PlayArrow, Stop } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface QuestionCardProps {
  session: ExamTermSession;
  currentExam: any;
  currentQuestion: any;
  questionNumber?: number; // Optional global question number
  examType?: "LISTENING" | "READING" | "WRITING" | "SPEAKING"; // Add examType prop
  onAnswerChange: (
    questionId: number,
    answerId: number,
    isChecked?: boolean,
  ) => void;
  onWritingAnswerChange?: (questionId: number, text: string) => void;
  onSpeakingAnswerChange?: (questionId: number, audioBase64: string) => void;
}

export default function QuestionCard({
  session,
  currentQuestion,
  examType,
  onAnswerChange,
  onWritingAnswerChange,
  onSpeakingAnswerChange,
}: QuestionCardProps) {
  // Audio recording states for SPEAKING
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Audio player states for LISTENING
  // const [audioSrc, setAudioSrc] = useState<string>("");

  // Writing text state
  const [writingText, setWritingText] = useState<string>("");

  // Use the passed examType prop, fallback to session.currentExamType if not provided
  const currentExamType = examType || session.currentExamType;

  // Initialize states from existing answers
  useEffect(() => {
    if (currentExamType === "WRITING") {
      const existingAnswer = session.answers[currentQuestion.id]?.[0] || "";
      setWritingText(existingAnswer);
    }
  }, [currentQuestion.id, currentExamType, session.answers]);

  // useEffect(() => {
  //   // Convert base64 audio to playable URL for LISTENING
  //   if (currentExamType === "LISTENING" && currentQuestion.questionText) {
  //     try {
  //       // Assuming questionText contains base64 audio data
  //       const audioData = currentQuestion.questionText;

  //       if (audioData.startsWith("data:audio")) {
  //         setAudioSrc(audioData);
  //       } else {
  //         // If it's just base64 without data URL prefix
  //         setAudioSrc(`data:audio/mp3;base64,${audioData}`);
  //       }
  //     } catch (error) {
  //       console.error("Error processing audio data:", error);
  //     }
  //   }
  // }, [currentQuestion, currentExamType]);

  // Reset audio recording state when question changes for SPEAKING
  useEffect(() => {
    if (currentExamType === "SPEAKING") {
      // Stop any ongoing recording
      if (
        mediaRecorder.current &&
        mediaRecorder.current.state === "recording"
      ) {
        mediaRecorder.current.stop();
      }

      // Check if there's existing audio for this question
      const existingAudio = session.answers[currentQuestion.id]?.[0];

      if (existingAudio) {
        // Preserve existing audio for review
        try {
          // Convert base64 back to blob URL for playback
          const byteCharacters = atob(existingAudio);
          const byteNumbers = new Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const audioBlob = new Blob([byteArray], { type: "audio/mp3" });
          const url = URL.createObjectURL(audioBlob);

          setAudioURL(url);
        } catch (error) {
          console.error(
            "Error recreating audio URL from existing data:",
            error,
          );
          setAudioURL(null);
        }
      } else {
        // Reset audio state for new question without existing audio
        setAudioURL((prevAudioURL) => {
          // Clear previous audio URL and cleanup
          if (prevAudioURL) {
            URL.revokeObjectURL(prevAudioURL);
          }

          return null;
        });
      }

      // Always reset recording state
      setIsRecording(false);
      audioChunks.current = [];
    }
  }, [currentQuestion.id, currentExamType, session.answers]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Convert to base64
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64 = reader.result as string;
          const base64Audio = base64.split(",")[1]; // Remove data URL prefix

          onSpeakingAnswerChange?.(currentQuestion.id, base64Audio);
        };

        reader.readAsDataURL(audioBlob);

        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  const handleWritingChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = event.target.value;
    setWritingText(text);
    onWritingAnswerChange?.(currentQuestion.id, text);
  };

  const renderQuestionContent = () => {
    switch (currentExamType) {
      case "LISTENING":
        return (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ mb: 2, fontSize: "1rem", "& img": { maxWidth: "100%", height: "auto" } }}
              dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
            />
            {/* {audioSrc && (
              <Box sx={{ mb: 2 }}>
                <audio controls style={{ width: "100%" }}>
                  <source src={audioSrc} type="audio/mp3" />
                  Trình duyệt của bạn không hỗ trợ phát âm thanh.
                </audio>
              </Box>
            )} */}
          </Box>
        );

      case "WRITING":
        return (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ mb: 2, fontSize: "1rem", "& img": { maxWidth: "100%", height: "auto" } }}
              dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
            />
            <TextField
              multiline
              rows={8}
              fullWidth
              variant="outlined"
              placeholder="Write your response here..."
              value={writingText}
              onChange={handleWritingChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Write your paragraph addressing the given topic. Minimum 250 words
              recommended.
            </Typography>
          </Box>
        );

      case "SPEAKING":
        return (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ mb: 2, fontSize: "1rem", "& img": { maxWidth: "100%", height: "auto" } }}
              dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
            />
            <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Record your spoken response to the question above
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant={isRecording ? "outlined" : "contained"}
                  color={isRecording ? "error" : "primary"}
                  onClick={isRecording ? stopRecording : startRecording}
                  startIcon={isRecording ? <Stop /> : <Mic />}
                  size="large"
                  sx={{ minWidth: 120 }}
                >
                  {isRecording ? "Stop" : "Record"}
                </Button>

                {audioURL && (
                  <Button
                    variant="outlined"
                    startIcon={<PlayArrow />}
                    onClick={() => {
                      const audio = new Audio(audioURL);
                      audio.play();
                    }}
                  >
                    Play Recording
                  </Button>
                )}
              </Stack>

              {audioURL && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="success.main">
                    {session.answers[currentQuestion.id]?.[0]
                      ? "✓ Audio available for review (will be submitted when you navigate)"
                      : "✓ Recording saved successfully"}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        );

      default:
        return (
          <Box
            sx={{ mb: 3, fontSize: "1rem", "& img": { maxWidth: "100%", height: "auto" } }}
            dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
          />
        );
    }
  };

  const renderAnswerOptions = () => {
    // For WRITING and SPEAKING, we don't show multiple choice options
    if (currentExamType === "WRITING" || currentExamType === "SPEAKING") {
      return null;
    }

    return (
      <FormControl component="fieldset" sx={{ width: "100%" }}>
        {currentExamType === "READING" || currentExamType === "LISTENING" ? (
          // Radio buttons for single answer questions
          <RadioGroup
            value={session.answers[currentQuestion.id]?.[0] || ""}
            onChange={(e) =>
              onAnswerChange(currentQuestion.id, parseInt(e.target.value))
            }
          >
            {currentQuestion.answers.map((answer: any, index: number) => (
              <Paper
                key={answer.id}
                elevation={
                  session.answers[currentQuestion.id]?.includes(
                    answer.id.toString(),
                  )
                    ? 2
                    : 0
                }
                sx={{
                  p: 1,
                  mb: 2,
                  border: "2px solid",
                  borderColor: session.answers[currentQuestion.id]?.includes(
                    answer.id.toString(),
                  )
                    ? "primary.main"
                    : "divider",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.light",
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => onAnswerChange(currentQuestion.id, answer.id)}
              >
                <FormControlLabel
                  value={answer.id.toString()}
                  control={<Radio />}
                  label={
                    <Box component="span">
                      <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                      <Box
                        component="span"
                        sx={{ "& img": { maxWidth: "100%", height: "auto" } }}
                        dangerouslySetInnerHTML={{ __html: answer.answerText }}
                      />
                    </Box>
                  }
                  sx={{ width: "100%", m: 0 }}
                />
              </Paper>
            ))}
          </RadioGroup>
        ) : (
          // Checkboxes for multiple answer questions (if any other types need them)
          <FormGroup>
            {currentQuestion.answers.map((answer: any, index: number) => (
              <Paper
                key={answer.id}
                elevation={
                  session.answers[currentQuestion.id]?.includes(
                    answer.id.toString(),
                  )
                    ? 2
                    : 0
                }
                sx={{
                  p: 1,
                  mb: 2,
                  border: "2px solid",
                  borderColor: session.answers[currentQuestion.id]?.includes(
                    answer.id.toString(),
                  )
                    ? "primary.main"
                    : "divider",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.light",
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() =>
                  onAnswerChange(
                    currentQuestion.id,
                    answer.id,
                    !session.answers[currentQuestion.id]?.includes(
                      answer.id.toString(),
                    ),
                  )
                }
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        session.answers[currentQuestion.id]?.includes(
                          answer.id.toString(),
                        ) || false
                      }
                      onChange={(e) =>
                        onAnswerChange(
                          currentQuestion.id,
                          answer.id,
                          e.target.checked,
                        )
                      }
                    />
                  }
                  label={
                    <Box component="span">
                      <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                      <Box
                        component="span"
                        sx={{ "& img": { maxWidth: "100%", height: "auto" } }}
                        dangerouslySetInnerHTML={{ __html: answer.answerText }}
                      />
                    </Box>
                  }
                  sx={{ width: "100%", m: 0 }}
                />
              </Paper>
            ))}
          </FormGroup>
        )}
      </FormControl>
    );
  };

  return (
    <>
      {/* Progress Card */}
      <Card
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
        elevation={2}
      >
        {/* <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={{ xs: 2, sm: 0 }}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight="bold">
              {questionNumber ? (
                <>Câu hỏi {questionNumber}</>
              ) : (
                <>Câu hỏi {session.currentQuestionIndex + 1} trên{" "}
                {currentExam.questions.length}</>
              )}
            </Typography>
          </Stack>
        </CardContent> */}
      </Card>

      {/* Question Card */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          {renderQuestionContent()}

          <Divider sx={{ mb: 3 }} />

          {/* Answer Options */}
          {renderAnswerOptions()}
        </CardContent>
      </Card>
    </>
  );
}
