import { AccessTime, Menu } from "@mui/icons-material";
import {
  AppBar,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { ExamTermSession } from "@/services/types/exam";

const EXAM_TIME_LIMITS = {
  LISTENING: 47,
  READING: 60,
  WRITING: 60,
  SPEAKING: 12,
};

const ExamTypeColors = {
  LISTENING: "#2196f3",
  READING: "#4caf50",
  WRITING: "#ff9800",
  SPEAKING: "#9c27b0",
};

interface ExamHeaderProps {
  session: ExamTermSession;
  sidebarOpen: boolean;
  currentSectionTimeRemaining: number;
  onToggleSidebar: () => void;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default function ExamHeader({
  session,
  sidebarOpen,
  currentSectionTimeRemaining,
  onToggleSidebar,
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
        {!sidebarOpen && (
          <IconButton color="inherit" onClick={onToggleSidebar} sx={{ mr: 2 }}>
            <Menu />
          </IconButton>
        )}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ flexGrow: 1 }}
        >
          <Typography variant="h6" fontWeight="bold">
            VSTEP Exam
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
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
            label={`${session.currentExamType} - Part ${session.currentExamIndex + 1}`}
            sx={{
              bgcolor: ExamTypeColors[session.currentExamType],
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            label={`${EXAM_TIME_LIMITS[session.currentExamType as keyof typeof EXAM_TIME_LIMITS]} phút`}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              color: "white",
            }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
