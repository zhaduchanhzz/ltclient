"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
  Alert,
  Slider,
  Chip,
} from "@mui/material";
import { UserResponse } from "@/services/types/lecturer";
import { useGradeResponseMutation } from "@/services/apis/lecturer";
import { useAppContextHandle } from "@/contexts/AppContext";
import { useQueryClient } from "@tanstack/react-query";
import { API_PATH } from "@/consts/api-path";

interface GradingDialogProps {
  open: boolean;
  onClose: () => void;
  response: UserResponse | null;
}

const GradingDialog: React.FC<GradingDialogProps> = ({
  open,
  onClose,
  response,
}) => {
  const [score, setScore] = useState<number>(0);
  const { updateAppState } = useAppContextHandle();
  const queryClient = useQueryClient();
  const { mutate: gradeResponse, isPending } = useGradeResponseMutation();

  // Reset form when dialog opens with new response
  useEffect(() => {
    if (response) {
      setScore(response.score || 0);
    }
  }, [response]);

  const handleSubmit = () => {
    if (!response) return;

    gradeResponse(
      {
        userResponseId: response.id,
        score,
      },
      {
        onSuccess: () => {
          updateAppState({
            appAlertInfo: {
              message: "Chấm điểm thành công!",
              severity: "success",
            },
          });
          // Invalidate queries to refresh the data
          queryClient.invalidateQueries({
            queryKey: [API_PATH.LECTURER_USER_RESPONSES],
          });
          onClose();
        },
        onError: (error: any) => {
          updateAppState({
            appAlertInfo: {
              message: error?.message || "Có lỗi xảy ra khi chấm điểm",
              severity: "error",
            },
          });
        },
      },
    );
  };

  const getScoreColor = (score: number): "success" | "warning" | "error" => {
    if (score >= 8) return "success";
    if (score >= 6) return "warning";
    return "error";
  };

  if (!response) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chấm điểm bài thi</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Exam Information */}
          <Box>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Chip
                label={`Mã câu hỏi: ${response.questionId}`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>

          {/* Question */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Câu hỏi:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {response.questionText}
            </Typography>
          </Box>

          {/* Response Content */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Bài làm của học viên:
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 1,
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {response.content || "(Không có nội dung)"}
              </Typography>
            </Box>
          </Box>

          {/* Score Input */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Điểm số (0-10):
            </Typography>
            <Stack spacing={2} direction="row" alignItems="center">
              <Slider
                value={score}
                onChange={(_, value) => setScore(value as number)}
                min={0}
                max={10}
                step={0.5}
                marks
                valueLabelDisplay="on"
                sx={{ flex: 1 }}
              />
              <TextField
                type="number"
                value={score}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);

                  if (!isNaN(val) && val >= 0 && val <= 10) {
                    setScore(val);
                  }
                }}
                inputProps={{
                  min: 0,
                  max: 10,
                  step: 0.5,
                }}
                sx={{ width: 100 }}
                size="small"
              />
              <Chip
                label={`${score}/10`}
                color={getScoreColor(score)}
                size="small"
              />
            </Stack>
          </Box>

          {/* Info Alert */}
          <Alert severity="info" variant="outlined">
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontWeight: 500, fontStyle: "italic" }}
            >
              Lưu ý: Điểm số sẽ được lưu vĩnh viễn và không thể thay đổi sau khi
              xác nhận.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isPending}
          color="primary"
        >
          {isPending ? "Đang lưu..." : "Xác nhận chấm điểm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GradingDialog;
