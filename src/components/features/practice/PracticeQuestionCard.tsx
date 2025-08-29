"use client";
import { Mic, PlayArrow, Stop } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface PracticeQuestionCardProps {
  question: {
    id: number;
    questionText: string;
    answers?: Array<{
      id: number;
      answerText: string;
      isCorrect: boolean;
    }>;
  };
  index: number;
  examType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  onAnswerChange: (answer: any) => void;
}

export default function PracticeQuestionCard({
  question,
  index,
  examType,
  onAnswerChange,
}: PracticeQuestionCardProps) {
  // State for multiple choice answers (LISTENING/READING)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  // State for writing answer
  const [writingText, setWritingText] = useState<string>("");

  // Audio recording states for SPEAKING
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Handle multiple choice answer selection
  const handleMultipleChoiceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const answerId = event.target.value;
    setSelectedAnswer(answerId);
    onAnswerChange(parseInt(answerId));
  };

  // Handle writing text change
  const handleWritingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setWritingText(text);
    onAnswerChange(text);
  };

  // Start audio recording for SPEAKING
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Convert to base64 for submission
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result?.toString().split(",")[1];

          if (base64String) {
            onAnswerChange(base64String);
          }
        };
        
        reader.readAsDataURL(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // Play recorded audio
  const playAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Question {index + 1}
        </Typography>

        <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-wrap" }}>
          {question.questionText}
        </Typography>

        {/* Multiple Choice Questions (LISTENING/READING) */}
        {(examType === "LISTENING" || examType === "READING") &&
          question.answers && (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAnswer}
                onChange={handleMultipleChoiceChange}
              >
                {question.answers.map((answer) => (
                  <FormControlLabel
                    key={answer.id}
                    value={answer.id.toString()}
                    control={<Radio />}
                    label={answer.answerText}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}

        {/* Writing Questions */}
        {examType === "WRITING" && (
          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            placeholder="Write your answer here..."
            value={writingText}
            onChange={handleWritingChange}
            sx={{ mt: 2 }}
          />
        )}

        {/* Speaking Questions */}
        {examType === "SPEAKING" && (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              {!isRecording ? (
                <Button
                  variant="contained"
                  startIcon={<Mic />}
                  onClick={startRecording}
                  color="primary"
                >
                  Start Recording
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Stop />}
                  onClick={stopRecording}
                  color="error"
                >
                  Stop Recording
                </Button>
              )}

              {audioURL && (
                <Button
                  variant="outlined"
                  startIcon={<PlayArrow />}
                  onClick={playAudio}
                >
                  Play Recording
                </Button>
              )}
            </Box>

            {isRecording && (
              <Typography variant="body2" color="error">
                Recording in progress...
              </Typography>
            )}

            {audioURL && !isRecording && (
              <Typography variant="body2" color="success.main">
                Recording completed
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
