"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, Button, Card, CircularProgress, Stack, Typography, Chip, Divider, TextField } from "@mui/material";
import { useGetTermHistoryQuery, useMarkGradingRequestMutation } from "@/services/apis/exam";
import { API_PATH } from "@/consts/api-path";
import { ApiServerURL } from "@/utils/config";

export default function MarkingTermDetailPage() {
  const [form, setForm] = React.useState<Record<number, { scoreMark: string; comments: string; done?: boolean }>>({});
  const router = useRouter();
  const params = useParams();
  const termId = params?.termId as string;

  const { data, isLoading, error, refetch } = useGetTermHistoryQuery(termId, !!termId);
  const { mutateAsync: markAsync, isPending: isMarking } = useMarkGradingRequestMutation();
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

      <Card sx={{ p: 2 }}>
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
                      <Chip label={ex.exams?.examType || "UNKNOWN"} size="small" color="warning" />
                      <Typography fontWeight={600}>
                        Exam ID: {ex.exams?.id} {ex.exams?.title ? `- ${ex.exams?.title}` : ""}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Điểm: {ex.score} | Đúng: {ex.selectedTrue}/{ex.totalQuestion}
                    </Typography>
                    {/* Only show submitted content for WRITING/SPEAKING */}
                    {(ex.exams?.examType === "WRITING" || ex.exams?.examType === "SPEAKING") && ex.content && (
                      <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: "#fafafa", border: "1px solid", borderColor: "divider" }}>
                        {(() => {
                          /* eslint-disable padding-line-between-statements */
                          const type = ex.exams?.examType as string;
                          let raw = String(ex.content ?? "");
                          let text = raw;
                          // Try to extract meaningful text if the content is a JSON map
                          try {
                            const parsed = JSON.parse(raw);
                            if (parsed && typeof parsed === "object") {
                              const values = Object.values(parsed as Record<string, unknown>);
                              if (values.length === 1) {
                                text = String(values[0] ?? "");
                              } else {
                                text = JSON.stringify(parsed, null, 2);
                              }
                            }
                          } catch {
                            // keep raw as text
                          }

                          if (type === "WRITING") {
                            return (
                              <>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                  Bài viết đã nộp
                                </Typography>
                                <TextField
                                  value={text}
                                  multiline
                                  fullWidth
                                  minRows={6}
                                  InputProps={{ readOnly: true }}
                                  sx={{ bgcolor: "background.paper" }}
                                />
                              </>
                            );
                          }

                          // SPEAKING: try to render audio
                          const looksLikeUrl = /^https?:\/\//i.test(text) || text.startsWith("data:audio");
                          let audioSrc = "";
                          if (looksLikeUrl) {
                            audioSrc = text;
                          } else if (text) {
                            // Assume it's a stored filename; build a download URL
                            audioSrc = text.startsWith("/") ? text : `${ApiServerURL + API_PATH.DOWNLOAD_FILE}${text}`;
                          }

                          const ui = (
                            <>
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                Bài nói đã nộp
                              </Typography>
                              {audioSrc ? (
                                <>
                                  <audio controls src={audioSrc} style={{ width: "100%" }} />
                                </>
                              ) : (
                                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{text}</Typography>
                              )}
                            </>
                          );
                          /* eslint-enable padding-line-between-statements */
                          return ui;
                        })()}
                      </Box>
                    )}
                    {(ex.exams?.examType === "WRITING" || ex.exams?.examType === "SPEAKING") && (
                      <Stack spacing={1} direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "flex-end" }}>
                        <TextField
                          label="Điểm chấm"
                          type="number"
                          size="small"
                          inputProps={{ min: 0 }}
                          value={form[ex.id]?.scoreMark ?? ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              [ex.id]: { ...prev[ex.id], scoreMark: e.target.value },
                            }))
                          }
                          sx={{ width: 140 }}
                        />
                        <TextField
                          label="Nhận xét"
                          size="small"
                          multiline
                          minRows={1}
                          value={form[ex.id]?.comments ?? ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              [ex.id]: { ...prev[ex.id], comments: e.target.value },
                            }))
                          }
                          sx={{ flex: 1 }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          disabled={isMarking || form[ex.id]?.done}
                          onClick={async () => {
                            const scoreNum = Number(form[ex.id]?.scoreMark);
                            if (Number.isNaN(scoreNum)) return;

                            try {
                              await markAsync({ id: ex.id, scoreMark: scoreNum, comments: form[ex.id]?.comments || "" });
                              setForm((prev) => ({ ...prev, [ex.id]: { ...(prev[ex.id] || { scoreMark: "", comments: "" }), done: true } }));
                              await refetch();
                            } catch {
                              // noop - error UI can be added later
                            }
                          }}
                        >
                          {form[ex.id]?.done ? "Đã chấm" : "Chấm điểm"}
                        </Button>
                      </Stack>
                    )}
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
