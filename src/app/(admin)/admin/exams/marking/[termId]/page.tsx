"use client";

import { useRouter, useParams } from "next/navigation";
import { Box, Button, Card, CircularProgress, Stack, Typography, Chip, Divider } from "@mui/material";
import { useGetTermHistoryQuery } from "@/services/apis/exam";

export default function MarkingTermDetailPage() {
  const router = useRouter();
  const params = useParams();
  const termId = params?.termId as string;

  const { data, isLoading, error } = useGetTermHistoryQuery(termId, !!termId);
  const items = data?.data || [];

  const totalScore = Array.isArray(items)
    ? items.reduce((sum: number, it: any) => sum + (Number(it?.score) || 0), 0)
    : 0;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: "bold", color: "text.primary" }}>
          Chi tiết chấm thi - Term {termId}
        </Typography>
        <Button variant="outlined" onClick={() => router.push("/admin/exams/marking")}>Quay lại danh sách</Button>
      </Stack>

      <Card sx={{ p: 3 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={240}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Không thể tải dữ liệu bài thi. Vui lòng thử lại sau.</Typography>
        ) : !items || items.length === 0 ? (
          <Typography>Không có dữ liệu cho term này.</Typography>
        ) : (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={`Term ID: ${termId}`} color="primary" size="small" />
              <Chip label={`Tổng điểm: ${totalScore}`} color="success" size="small" />
              <Chip label={`Số bài: ${items.length}`} size="small" />
            </Stack>

            <Divider />

            <Typography variant="h6">Danh sách bài thi</Typography>
            <Stack spacing={1}>
              {items.map((ex: any, idx: number) => (
                <Card key={idx} sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={ex.examType} size="small" color="warning" />
                      <Typography fontWeight={600}>Exam ID: {ex.examId}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Điểm: {ex.score} | Đúng: {ex.selectedTrue}/{ex.totalQuestion}
                    </Typography>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        )}
      </Card>
    </Box>
  );
}
