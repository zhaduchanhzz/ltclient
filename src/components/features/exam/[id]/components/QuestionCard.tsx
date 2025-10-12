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
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { usePostFileMutation } from "@/services/apis/upload";
import { ApiServerURL } from "@/utils/config";
import { API_PATH } from "@/consts/api-path";

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
  onSpeakingAnswerChange?: (questionId: number, audioFilename: string) => void;
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
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const postFileMutation = usePostFileMutation();

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
        // If existing answer is a filename (new flow), use server URL; otherwise try base64 (backward compatibility)
        try {
          if (/\.mp3$/i.test(existingAudio)) {
            const url = `${ApiServerURL}${API_PATH.DOWNLOAD_FILE}${existingAudio}`;
            setAudioURL(url);
          } else {
            // Convert base64 back to blob URL for playback (legacy)
            const byteCharacters = atob(existingAudio);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            const audioBlob = new Blob([byteArray], { type: "audio/mp3" });

            const url = URL.createObjectURL(audioBlob);
            setAudioURL(url);
          }
        } catch (error) {
          console.error("Error setting audio URL from existing data:", error);
          setAudioURL(null);
        }
      } else {
        // Reset audio state for new question without existing audio
        setAudioURL((prevAudioURL) => {
          // Clear previous audio URL and cleanup if it was an object URL
          if (prevAudioURL && prevAudioURL.startsWith("blob:")) {
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

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Upload the recorded file to backend and store returned filename
        try {
          setIsUploading(true);
          const filename = `speaking_${currentQuestion.id}_${Date.now()}.webm`;
          const file = new File([audioBlob], filename, {
            type: audioBlob.type,
          });
          const res: any = await postFileMutation.mutateAsync(file);
          const savedFilename = res ?? "";

          if (savedFilename) {
            onSpeakingAnswerChange?.(currentQuestion.id, savedFilename);
          }
        } catch (e) {
          console.error("Failed to upload speaking file:", e);
        } finally {
          setIsUploading(false);
        }

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
          <Box sx={{ mb: 1 }}>
            <Box
              sx={{
                mb: 0.75,
                fontSize: "0.9rem",
                "& img": { maxWidth: "100%", height: "auto" },
              }}
              dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
            />
            {/* audio area kept commented */}
          </Box>
        );

      case "WRITING":
        return (
          <Box sx={{ mb: 1 }}>
            <Box
              sx={{
                mb: 0.75,
                fontSize: "0.9rem",
                "& img": { maxWidth: "100%", height: "auto" },
              }}
              dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
            />
            <TextField
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Write your response here..."
              value={writingText}
              onChange={handleWritingChange}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block" }}
            >
              Write your paragraph addressing the given topic. Minimum 250 words
              recommended.
            </Typography>
          </Box>
        );

      case "SPEAKING":
        return (
          <Box sx={{ mb: 1 }}>
            <Box
              sx={{
                mb: 0.75,
                fontSize: "0.9rem",
                "& img": { maxWidth: "100%", height: "auto" },
              }}
              dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
            />
            <Box
              sx={{
                p: 1,
                textAlign: "center",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Record your spoken response to the question above
              </Typography>

              <Stack
                direction="row"
                spacing={0.75}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant={isRecording ? "outlined" : "contained"}
                  color={isRecording ? "error" : "primary"}
                  onClick={isRecording ? stopRecording : startRecording}
                  startIcon={isRecording ? <Stop /> : <Mic />}
                  size="small"
                  sx={{ minWidth: 96 }}
                  disabled={isUploading}
                >
                  {isUploading
                    ? "Uploading..."
                    : isRecording
                      ? "Stop"
                      : "Record"}
                </Button>

                {audioURL && (
                  <Button
                    variant="outlined"
                    size="small"
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
                <Box sx={{ mt: 0.75 }}>
                  <Typography variant="caption" color="success.main">
                    {session.answers[currentQuestion.id]?.[0]
                      ? "✓ Audio available for review (will be submitted when you navigate)"
                      : "✓ Recording saved successfully"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        );

      default:
        return (
          <Box
            sx={{
              mb: 1,
              fontSize: "0.9rem",
              "& img": { maxWidth: "100%", height: "auto" },
            }}
            dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
          />
        );
    }
  };

  const renderAnswerOptions = () => {
    if (currentExamType === "WRITING" || currentExamType === "SPEAKING") return null;

    const labelSx = {
      width: "100%",
      m: 0,
      px: 0.5,
      py: 0.25,
      mb: 0.5,
      border: "1px solid",
      borderRadius: 1,
      transition: "all 0.15s",
      cursor: "pointer",
      "& .MuiFormControlLabel-label": { fontSize: "0.85rem", lineHeight: 1.25 },
      "&:hover": { bgcolor: "action.hover", borderColor: "primary.light" },
    } as const;

    return (
      <FormControl component="fieldset" sx={{ width: "100%" }}>
        {currentExamType === "READING" || currentExamType === "LISTENING" ? (
          <RadioGroup
            value={session.answers[currentQuestion.id]?.[0] || ""}
            onChange={(e) => onAnswerChange(currentQuestion.id, parseInt(e.target.value))}
          >
            {currentQuestion.answers.map((answer: any, index: number) => {
              const selected = !!session.answers[currentQuestion.id]?.includes(answer.id.toString());
              return (
                <FormControlLabel
                  key={answer.id}
                  value={answer.id.toString()}
                  control={<Radio size="small" />}
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
                  sx={{
                    ...labelSx,
                    borderColor: selected ? "primary.main" : "divider",
                  }}
                />
              );
            })}
          </RadioGroup>
        ) : (
          <FormGroup>
            {currentQuestion.answers.map((answer: any, index: number) => {
              const checked = !!session.answers[currentQuestion.id]?.includes(answer.id.toString());
              return (
                <FormControlLabel
                  key={answer.id}
                  control={
                    <Checkbox
                      size="small"
                      checked={checked}
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
                  sx={{
                    ...labelSx,
                    borderColor: checked ? "primary.main" : "divider",
                  }}
                />
              );
            })}
          </FormGroup>
        )}
      </FormControl>
    );
  };

  return (
    <>
      {/* Question Card */}
      <Card elevation={1} sx={{ mb: 1 }}>
        <CardContent
          sx={{ padding: "0 !important", marginBottom: "0 !important" }}
        >
          {renderQuestionContent()}
          <Divider sx={{ mb: 0.5 }} />
          {renderAnswerOptions()}
        </CardContent>
      </Card>
    </>
  );
}
