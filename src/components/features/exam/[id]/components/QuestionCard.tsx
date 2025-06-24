import { ExamTermSession } from "@/services/types/exam";
import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Mic, Stop, PlayArrow, VolumeUp } from "@mui/icons-material";
import { useRef, useState, useEffect } from "react";

interface QuestionCardProps {
  session: ExamTermSession;
  currentExam: any;
  currentQuestion: any;
  progress: number;
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
  currentExam,
  currentQuestion,
  progress,
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
  const [audioSrc, setAudioSrc] = useState<string>("");

  // Writing text state
  const [writingText, setWritingText] = useState<string>("");

  // Initialize states from existing answers
  useEffect(() => {
    if (session.currentExamType === "WRITING") {
      const existingAnswer = session.answers[currentQuestion.id]?.[0] || "";
      setWritingText(existingAnswer);
    }
  }, [currentQuestion.id, session.currentExamType, session.answers]);

  useEffect(() => {
    // Convert base64 audio to playable URL for LISTENING
    if (
      session.currentExamType === "LISTENING" &&
      currentQuestion.questionText
    ) {
      try {
        // Assuming questionText contains base64 audio data
        const audioData = currentQuestion.questionText;

        if (audioData.startsWith("data:audio")) {
          setAudioSrc(audioData);
        } else {
          // If it's just base64 without data URL prefix
          setAudioSrc(`data:audio/mp3;base64,${audioData}`);
        }
      } catch (error) {
        console.error("Error processing audio data:", error);
      }
    }
  }, [currentQuestion, session.currentExamType]);

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
    switch (session.currentExamType) {
      case "LISTENING":
        return (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <VolumeUp /> Listen to the audio and answer the question
            </Typography>
            {audioSrc && (
              <Box sx={{ mb: 2 }}>
                <audio controls style={{ width: "100%" }}>
                  <source src={audioSrc} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
            )}
          </Box>
        );

      case "WRITING":
        return (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {currentQuestion.questionText}
            </Typography>
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              {currentQuestion.questionText}
            </Typography>
            <Paper
              elevation={2}
              sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}
            >
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
                    ✓ Recording saved successfully
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        );

      default:
        return (
          <Typography variant="h5" fontWeight="medium" sx={{ mb: 3 }}>
            {currentQuestion.questionText}
          </Typography>
        );
    }
  };

  const renderAnswerOptions = () => {
    // For WRITING and SPEAKING, we don't show multiple choice options
    if (
      session.currentExamType === "WRITING" ||
      session.currentExamType === "SPEAKING"
    ) {
      return null;
    }

    return (
      <FormControl component="fieldset" sx={{ width: "100%" }}>
        <FormLabel
          component="legend"
          sx={{
            fontSize: "1.1rem",
            fontWeight: "medium",
            mb: 2,
            color: "text.primary",
          }}
        >
          Select your answer:
        </FormLabel>

        {session.currentExamType === "READING" ||
        session.currentExamType === "LISTENING" ? (
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
                  p: 2,
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
                    <Typography>
                      <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                      {answer.answerText}
                    </Typography>
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
                  p: 2,
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
                    <Typography>
                      <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                      {answer.answerText}
                    </Typography>
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
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={{ xs: 2, sm: 0 }}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight="bold">
              Question {session.currentQuestionIndex + 1} of{" "}
              {currentExam.questions.length}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: "rgba(255,255,255,0.2)",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#4caf50",
                borderRadius: 6,
              },
            }}
          />
        </CardContent>
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
