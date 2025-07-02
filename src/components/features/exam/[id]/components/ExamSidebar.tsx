import { Close, Headphones, MenuBook, Create, Mic } from "@mui/icons-material";
import {
  Avatar,
  Box,
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
  onCloseSidebar: () => void;
  onNavigateToExamTypePart: (examType: string, partIndex: number) => void;
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
  onCloseSidebar,
  onNavigateToExamTypePart,
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
          {examTypes.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              No exam sections available
            </Typography>
          ) : (
            examTypes.map((examType) => {
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
              const isClickable = ["available", "in_progress"].includes(status);

              // Show lock icon for completed/expired sections to indicate they're locked
              const displayIcon =
                status === "completed" || status === "expired"
                  ? "🔒"
                  : statusInfo.icon;
              const displayTextColor =
                status === "completed" || status === "expired"
                  ? "text.disabled"
                  : statusInfo.textColor;

              return (
                <Card
                  key={examType}
                  elevation={isActive ? 3 : 1}
                  sx={{
                    border: isActive ? `2px solid ${color}` : "1px solid",
                    borderColor: isActive ? color : "divider",
                    backgroundColor: statusInfo.bgColor,
                    cursor: isClickable ? "pointer" : "not-allowed",
                    opacity:
                      status === "locked" ||
                      status === "completed" ||
                      status === "expired"
                        ? 0.6
                        : 1,
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
                          bgcolor:
                            status === "locked" ||
                            status === "completed" ||
                            status === "expired"
                              ? "grey.400"
                              : color,
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
                            color={displayTextColor}
                          >
                            {examType}
                          </Typography>
                          <Typography sx={{ fontSize: "1.2rem" }}>
                            {displayIcon}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="caption"
                          color="black"
                          fontWeight="bold"
                        >
                          {timeLimit} phút • {parts.length} phần thi
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
                          variant="body2"
                          color="black"
                          fontWeight="bold"

                        >
                          {status === "locked" && "Đã khóa"}
                          {status === "available" && "Nhấn để bắt đầu"}
                          {status === "in_progress" && "Đang tiến hành"}
                          {status === "completed" && "\nĐã hoàn thành (Đã khóa)"}
                          {status === "expired" && "Thời gian đã hết (Đã khóa)"}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Parts navigation - only show for current section and if clickable */}
                    {isActive && isClickable && (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography
                          variant="caption"
                          color="black"
                          sx={{ mb: 1, display: "block" }}
                        >
                          Phần thi:
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
            })
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}
