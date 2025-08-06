import { AccessTime, CheckCircle } from "@mui/icons-material";
import {
  AppBar,
  Chip,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { ExamTermSession } from "@/services/types/exam";

const ExamTypeColors = {
  LISTENING: "#2196f3",
  READING: "#4caf50",
  WRITING: "#ff9800",
  SPEAKING: "#9c27b0",
};

interface ExamHeaderProps {
  session: ExamTermSession;
  currentSectionTimeRemaining: number;
  answeredCount: number;
  totalCount: number;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default function ExamHeader({
  session,
  currentSectionTimeRemaining,
  answeredCount,
  totalCount,
}: ExamHeaderProps) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ flexGrow: 1 }}
        >
          <Typography variant="h6" fontWeight="bold">
            VSTEP Exam
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            - {session.currentExamType}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip
            icon={<CheckCircle />}
            label={`${answeredCount}/${totalCount} câu`}
            sx={{
              bgcolor: "rgba(76,175,80,0.2)",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            icon={<AccessTime />}
            label={formatTime(currentSectionTimeRemaining)}
            color={currentSectionTimeRemaining < 300 ? "error" : "default"}
            sx={{
              bgcolor:
                currentSectionTimeRemaining < 300
                  ? "#f44336"
                  : "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          />
          <Chip
            label={`Part ${session.currentExamIndex + 1}`}
            sx={{
              bgcolor: ExamTypeColors[session.currentExamType],
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
