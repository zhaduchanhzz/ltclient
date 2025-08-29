"use client";
import { PlayArrow } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

interface PracticeReviewQuestionCardProps {
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
  userAnswer: any;
}

export default function PracticeReviewQuestionCard({
  question,
  index,
  examType,
  userAnswer,
}: PracticeReviewQuestionCardProps) {
  // Play audio for speaking review
  const playAudio = (base64Audio: string) => {
    try {
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Question {index + 1}
        </Typography>

        <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-wrap" }}>
          {question.questionText}
        </Typography>

        {/* Multiple Choice Review (LISTENING/READING) */}
        {(examType === "LISTENING" || examType === "READING") &&
          question.answers && (
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Your Answer:
              </Typography>
              {userAnswer ? (
                <RadioGroup value={userAnswer.toString()}>
                  {question.answers.map((answer) => {
                    const isUserAnswer = parseInt(userAnswer) === answer.id;

                    return (
                      <FormControlLabel
                        key={answer.id}
                        value={answer.id.toString()}
                        control={<Radio disabled checked={isUserAnswer} />}
                        label={answer.answerText}
                      />
                    );
                  })}
                </RadioGroup>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", ml: 2 }}
                >
                  Not answered
                </Typography>
              )}
            </Box>
          )}

        {/* Writing Review */}
        {examType === "WRITING" && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Your Answer:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              value={userAnswer || "No answer provided"}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                mt: 1,
                backgroundColor: "background.paper",
                "& .MuiInputBase-input": {
                  color: userAnswer ? "text.primary" : "text.secondary",
                },
              }}
            />
          </Box>
        )}

        {/* Speaking Review */}
        {examType === "SPEAKING" && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Your Recording:
            </Typography>
            {userAnswer ? (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => playAudio(userAnswer)}
                color="primary"
              >
                Play Your Recording
              </Button>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                No recording submitted
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
