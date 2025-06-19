import {
  Close,
  Flag,
  Fullscreen,
  FullscreenExit,
  Settings,
  Headphones,
  MenuBook,
  Create,
  Mic,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ExamTermSession, SimulationExam } from "@/services/types/exam";

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

interface ExamSidebarProps {
  sidebarOpen: boolean;
  session: ExamTermSession;
  examsByType: Record<string, SimulationExam[]>;
  examTypes: Array<"LISTENING" | "READING" | "WRITING" | "SPEAKING">;
  sectionStatus: Record<string, ExamSectionStatus>;
  currentSectionTimeRemaining: number;
  flaggedQuestions: Set<number>;
  fullscreen: boolean;
  currentQuestion: any;
  onCloseSidebar: () => void;
  onNavigateToExamTypePart: (examType: string, partIndex: number) => void;
  onToggleQuestionFlag: (questionId: number) => void;
  onToggleFullscreen: () => void;
  onShowSettings: () => void;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default function ExamSidebar({
  sidebarOpen,
  session,
  examsByType,
  examTypes,
  sectionStatus,
  currentSectionTimeRemaining,
  flaggedQuestions,
  fullscreen,
  currentQuestion,
  onCloseSidebar,
  onNavigateToExamTypePart,
  onToggleQuestionFlag,
  onToggleFullscreen,
  onShowSettings,
}: ExamSidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={sidebarOpen}
      onClose={onCloseSidebar}
      sx={{
        width: sidebarOpen ? 300 : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 300,
          boxSizing: "border-box",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRight: "2px solid rgba(0,0,0,0.05)",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" fontWeight="bold">
            Navigation
          </Typography>
          {isMobile && (
            <IconButton onClick={onCloseSidebar}>
              <Close />
            </IconButton>
          )}
        </Stack>

        {/* Exam Sections */}
        <Stack spacing={2}>
          {examTypes.map((examType) => {
            const parts = examsByType[examType] || [];
            const Icon = ExamTypeIcons[examType];
            const color = ExamTypeColors[examType];
            const isActive = session.currentExamType === examType;
            const status = sectionStatus[examType] || "locked";
            const timeLimit =
              EXAM_TIME_LIMITS[examType as keyof typeof EXAM_TIME_LIMITS];

            const getStatusInfo = () => {
              switch (status) {
                case "locked":
                  return {
                    bgColor: "rgba(0,0,0,0.05)",
                    textColor: "text.disabled",
                    icon: "🔒",
                  };
                case "available":
                  return {
                    bgColor: "rgba(76,175,80,0.1)",
                    textColor: "success.main",
                    icon: "▶️",
                  };
                case "in_progress":
                  return {
                    bgColor: "rgba(33,150,243,0.1)",
                    textColor: "primary.main",
                    icon: "⏱️",
                  };
                case "completed":
                  return {
                    bgColor: "rgba(76,175,80,0.2)",
                    textColor: "success.main",
                    icon: "✅",
                  };
                case "expired":
                  return {
                    bgColor: "rgba(244,67,54,0.1)",
                    textColor: "error.main",
                    icon: "⏰",
                  };
                default:
                  return {
                    bgColor: "transparent",
                    textColor: "text.primary",
                    icon: "",
                  };
              }
            };

            const statusInfo = getStatusInfo();
            const isClickable = [
              "available",
              "in_progress", 
              "completed",
              "expired",
            ].includes(status);

            return (
              <Card
                key={examType}
                elevation={isActive ? 3 : 1}
                sx={{
                  border: isActive ? `2px solid ${color}` : "1px solid",
                  borderColor: isActive ? color : "divider",
                  backgroundColor: statusInfo.bgColor,
                  cursor: isClickable ? "pointer" : "not-allowed",
                  opacity: status === "locked" ? 0.6 : 1,
                  transition: "all 0.2s",
                  "&:hover": isClickable
                    ? {
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                      }
                    : {},
                }}
                onClick={() =>
                  isClickable && onNavigateToExamTypePart(examType, 0)
                }
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: status === "locked" ? "grey.400" : color,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color={statusInfo.textColor}
                        >
                          {examType}
                        </Typography>
                        <Typography sx={{ fontSize: "1.2rem" }}>
                          {statusInfo.icon}
                        </Typography>
                      </Stack>

                      <Typography variant="caption" color="text.secondary">
                        {timeLimit} minutes • {parts.length} part
                        {parts.length !== 1 ? "s" : ""}
                      </Typography>

                      {/* Timer for current section */}
                      {status === "in_progress" && isActive && (
                        <Typography
                          variant="body2"
                          color={
                            currentSectionTimeRemaining < 300
                              ? "error.main"
                              : "primary.main"
                          }
                          fontWeight="bold"
                        >
                          ⏱️ {formatTime(currentSectionTimeRemaining)}
                        </Typography>
                      )}

                      {/* Status message */}
                      <Typography
                        variant="caption"
                        color={statusInfo.textColor}
                        fontWeight="medium"
                      >
                        {status === "locked" && "Locked"}
                        {status === "available" && "Click to start"}
                        {status === "in_progress" && "In progress"}
                        {status === "completed" && "Completed"}
                        {status === "expired" && "Time expired"}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Parts navigation - only show for current section */}
                  {isActive && isClickable && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 1 }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1, display: "block" }}
                      >
                        Parts:
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {parts.map((_, partIndex) => {
                          const isCurrentPart =
                            session.currentExamIndex === partIndex;
                          return (
                            <Chip
                              key={partIndex}
                              label={partIndex + 1}
                              size="small"
                              variant={isCurrentPart ? "filled" : "outlined"}
                              color={isCurrentPart ? "primary" : "default"}
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToExamTypePart(examType, partIndex);
                              }}
                              sx={{
                                cursor: "pointer",
                                bgcolor: isCurrentPart ? color : undefined,
                                color: isCurrentPart ? "white" : undefined,
                                minWidth: 32,
                                "&:hover": {
                                  bgcolor: isCurrentPart
                                    ? color
                                    : "action.hover",
                                },
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Quick Actions */}
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Quick Actions
        </Typography>
        <Stack spacing={1}>
          <Button
            startIcon={<Flag />}
            onClick={() => onToggleQuestionFlag(currentQuestion.id)}
            variant={
              flaggedQuestions.has(currentQuestion.id)
                ? "contained"
                : "outlined"
            }
            size="small"
            color="warning"
          >
            {flaggedQuestions.has(currentQuestion.id) ? "Unflag" : "Flag"}{" "}
            Question
          </Button>
          <Button
            startIcon={fullscreen ? <FullscreenExit /> : <Fullscreen />}
            onClick={onToggleFullscreen}
            variant="outlined"
            size="small"
          >
            {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
          <Button
            startIcon={<Settings />}
            onClick={onShowSettings}
            variant="outlined"
            size="small"
          >
            Settings
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}