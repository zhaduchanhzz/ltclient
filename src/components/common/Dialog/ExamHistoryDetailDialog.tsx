import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

// Kiểu dữ liệu chi tiết bài thi
export type ExamHistoryDetail = {
  id: number;
  requestMarkSpeak?: {
    requestId: number;
    termId: number;
    examId: number;
    status: string;
    comments: string;
    score: number;
    gradedAt: string;
  };
  requestMarkWrite?: {
    requestId: number;
    termId: number;
    examId: number;
    status: string;
    comments: string;
    score: number;
    gradedAt: string;
  };
  exams: {
    id: number;
    examType: string;
    title: string;
    audioFile?: string;
    description: string;
    isNeedVip: boolean;
    questions: {
      id: number;
      questionText: string;
      answers: {
        id: number;
        answerText: string;
        isCorrect: boolean;
      }[];
    }[];
  };
  content: string;
  score: number;
  selectedTrue: number;
  totalQuestion: number;
};

interface ExamHistoryDetailDialogProps {
  open: boolean;
  onClose: () => void;
  detail?: ExamHistoryDetail[];
}

const ExamHistoryDetailDialog: React.FC<ExamHistoryDetailDialogProps> = ({ open, onClose, detail }) => {
  const theme = useTheme();
  const getBgColor = (light: string, dark: string) => theme.palette.mode === "dark" ? dark : light;
  const [tabIdx, setTabIdx] = useState(0);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết bài thi</DialogTitle>
      <DialogContent>
        {detail && detail.length > 1 && (
          <Box sx={{ position: "sticky", top: 0, zIndex: 10, bgcolor: theme.palette.background.paper }}>
            <Tabs
              value={tabIdx}
              onChange={(_, v) => setTabIdx(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 2,
                borderBottom: `1.5px solid ${theme.palette.divider}`,
                ".MuiTab-root": {
                  bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300],
                  color: theme.palette.text.primary,
                  minWidth: 120,
                  fontWeight: 500,
                  borderRadius: "10px 10px 0 0",
                  mx: 0.5,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderBottom: "none",
                  transition: "background 0.2s",
                  zIndex: 1,
                  boxShadow: theme.palette.mode === "dark" ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.08)",
                },
                ".Mui-selected": {
                  bgcolor: "#cda274",
                  color: "#fff",
                  fontWeight: 700,
                  border: "2px solid #cda274",
                  borderBottom: "none",
                  zIndex: 2,
                  boxShadow: theme.palette.mode === "dark" ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.12)",
                },
              }}
            >
              {detail.map((item, idx) => (
                <Tab key={item.id} label={item.exams.title || `Bài ${idx + 1}`} />
              ))}
            </Tabs>
          </Box>
        )}
        {detail && detail.length > 0 && (
          <Stack spacing={3} sx={{ mb: 2 }}>
            {/* Thông tin bài thi và điểm */}
            <Box component={Stack} spacing={2} sx={{ p: 2, bgcolor: getBgColor("#f7f9fc", theme.palette.background.default), borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="h6" fontWeight={700} color="primary.main">{detail[tabIdx].exams.title}</Typography>
              <Typography variant="body1">Loại: <b>{detail[tabIdx].exams.examType}</b></Typography>
              <Typography variant="body1">Điểm: <b style={{ color: theme.palette.success.main }}>{detail[tabIdx].score}</b></Typography>
              <Typography variant="body1">Đúng: <b>{detail[tabIdx].selectedTrue}/{detail[tabIdx].totalQuestion}</b></Typography>
            </Box>
            {/* Trạng thái chấm Nói/Viết */}
            {(detail[tabIdx].requestMarkSpeak || detail[tabIdx].requestMarkWrite) && (
              <Box component={Stack} spacing={2} sx={{ p: 2, bgcolor: getBgColor("#e3f2fd", theme.palette.background.paper), borderRadius: 2, boxShadow: 1 }}>
                {detail[tabIdx].requestMarkSpeak && (
                  <Stack spacing={1}>
                    <Typography fontWeight={700} color="info.main">Chấm Nói</Typography>
                    <Typography>Trạng thái: <b>{detail[tabIdx].requestMarkSpeak.status}</b></Typography>
                    <Typography>Điểm: <b style={{ color: theme.palette.success.main }}>{detail[tabIdx].requestMarkSpeak.score}</b></Typography>
                    <Typography>Nhận xét: <span style={{ color: theme.palette.text.secondary }}>{detail[tabIdx].requestMarkSpeak.comments}</span></Typography>
                    <Typography>Thời gian chấm: {detail[tabIdx].requestMarkSpeak.gradedAt}</Typography>
                  </Stack>
                )}
                {detail[tabIdx].requestMarkWrite && (
                  <Stack spacing={1}>
                    <Typography fontWeight={700} color="info.main">Chấm Viết</Typography>
                    <Typography>Trạng thái: <b>{detail[tabIdx].requestMarkWrite.status}</b></Typography>
                    <Typography>Điểm: <b style={{ color: theme.palette.success.main }}>{detail[tabIdx].requestMarkWrite.score}</b></Typography>
                    <Typography>Nhận xét: <span style={{ color: theme.palette.text.secondary }}>{detail[tabIdx].requestMarkWrite.comments}</span></Typography>
                    <Typography>Thời gian chấm: {detail[tabIdx].requestMarkWrite.gradedAt}</Typography>
                  </Stack>
                )}
              </Box>
            )}
            {/* Mô tả bài thi */}
            <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2, boxShadow: 1 }}>
              <Typography fontWeight={700} sx={{ mb: 1 }}>Mô tả:</Typography>
              <Box sx={{ p: 1, bgcolor: getBgColor("#fff", theme.palette.background.paper), borderRadius: 1 }}>
                <span dangerouslySetInnerHTML={{ __html: detail[tabIdx].exams.description || "" }} />
              </Box>
            </Box>
            {/* Nội dung bài viết nếu là WRITING */}
            {detail[tabIdx].exams.examType === "WRITING" && (
              <Box sx={{ p: 2, bgcolor: getBgColor("#fce4ec", theme.palette.background.paper), borderRadius: 2, boxShadow: 1 }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>Nội dung bài viết:</Typography>
                <Box sx={{ p: 1, bgcolor: theme.palette.background.paper, borderRadius: 1 }}>
                  {(() => {
                    try {
                      const obj = JSON.parse(detail[tabIdx].content || "{}" );
                      return Object.values(obj).join("\n");
                    } catch {
                      return detail[tabIdx].content;
                    }
                  })()}
                </Box>
              </Box>
            )}
            {/* Danh sách câu hỏi */}
            <Box sx={{ p: 2, bgcolor: getBgColor("#f7f9fc", theme.palette.background.default), borderRadius: 2, boxShadow: 1 }}>
              <Typography fontWeight={700} sx={{ mb: 2 }}>Danh sách câu hỏi:</Typography>
              {detail[tabIdx].exams.questions.map((q) => {
                let selectedAnswerId: number | null = null;

                try {
                  const parsed = JSON.parse(detail[tabIdx].content || "{}" );
                  selectedAnswerId = parsed[q.id];
                } catch {}

                const selectedAnswer = q.answers.find((a) => a.id === selectedAnswerId);
                return (
                  <Box key={q.id} sx={{ mb: 2, p: 2, bgcolor: getBgColor("#fff", theme.palette.background.paper), borderRadius: 2, boxShadow: 0 }}>
                    <Box sx={{ mb: 1 }}>
                      <span dangerouslySetInnerHTML={{ __html: q.questionText }} />
                    </Box>
                    {selectedAnswer && (
                      <Typography variant="body2" sx={{ mb: 1, color: theme.palette.info.main }}>
                        Bạn đã chọn đáp án: <b>{selectedAnswer.answerText}</b> (ID: {selectedAnswerId})
                      </Typography>
                    )}
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {q.answers.map((a) => {
                        const isSelected = selectedAnswerId === a.id;
                        const isCorrect = a.isCorrect;
                        let bgcolor = getBgColor("grey.100", theme.palette.background.paper);
                        let color = theme.palette.text.primary;
                        let border = `1px solid ${theme.palette.divider}`;
                        let icon = null;
                        let label = "";

                        if (isCorrect && isSelected) {
                          bgcolor = theme.palette.primary.main;
                          color = theme.palette.primary.contrastText;
                          border = `3px solid ${theme.palette.primary.main}`;
                          icon = <CheckCircleIcon fontSize="small" sx={{ ml: 0.5 }} />;
                          label = "Bạn đã chọn (Đáp án đúng)";
                        } else if (isCorrect) {
                          bgcolor = theme.palette.success.light;
                          color = theme.palette.getContrastText(theme.palette.success.light);
                          border = `2px solid ${theme.palette.success.main}`;
                          icon = <CheckCircleIcon fontSize="small" sx={{ ml: 0.5 }} />;
                          label = "Đáp án đúng";
                        } else if (isSelected) {
                          bgcolor = theme.palette.error.main;
                          color = theme.palette.getContrastText(theme.palette.error.main);
                          border = `3px solid ${theme.palette.error.main}`;
                          icon = <CancelIcon fontSize="small" sx={{ ml: 0.5 }} />;
                          label = "Bạn đã chọn";
                        }

                        return (
                          <Box key={a.id} sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 120 }}>
                            <Box
                              sx={{
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                bgcolor,
                                color,
                                fontWeight: isSelected ? 700 : 400,
                                border,
                                display: "flex",
                                alignItems: "center",
                                minWidth: 100,
                                mb: 0.5,
                                boxShadow: isSelected ? `0 0 0 2px ${theme.palette.primary.light}` : undefined,
                              }}
                            >
                              {a.answerText}
                              {icon}
                            </Box>
                            {label && (
                              <Typography variant="caption" sx={{ color, fontWeight: 600 }}>{label}</Typography>
                            )}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExamHistoryDetailDialog;
