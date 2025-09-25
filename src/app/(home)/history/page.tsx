"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Pagination,
  useMediaQuery,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Switch from UI-only to real API: useGetTermHistoryQuery

import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import ExamHistoryDetailDialog from "@/components/common/Dialog/ExamHistoryDetailDialog";
import { useExamHistoryDetailQuery } from "@/services/apis/exam-history-detail";

// UI item type (mapped from API)
type HistoryItem = {
  readingScore: number | null;
  writingScore: number | null;
  speakingScore: number | null;
  listeningScore: number | null;
  speakingRequestId: number | null;
  writingRequestId: number | null;
  termId: number;
  id: string;
  examName: string;
  type: "Listening" | "Reading" | "Writing" | "Speaking" | "Full";
  date: string; // ISO date
  durationMin: number;
  score?: number; // optional if not graded yet
  status: "" | "PENDING" | "ACCEPTED" | "GRADED";
};


const History: React.FC = () => {
  // State cho popup chi tiết
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

  // Query chi tiết bài thi
  const { data: detailResp, refetch: refetchDetail } =
    useExamHistoryDetailQuery(
      selectedTermId ?? 0,
      detailOpen && !!selectedTermId,
    );

  const handleOpenDetail = (termId: number) => {
    setSelectedTermId(termId);
    setDetailOpen(true);
    refetchDetail();
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedTermId(null);
  };

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // Filters (UI only)
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | HistoryItem["status"]>("");
  const [type, setType] = useState<"" | HistoryItem["type"]>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Notification
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const setNotification = require("@/contexts/NotificationContext").default();

  // Fetch history via API without passing termId
  const { data: apiResp, isLoading, isError, refetch } = require("@/services/apis/exam").useGetHistoryQuery(true);
  const apiItems = apiResp?.data ?? [];

  // Map API data to UI data
  const mapped: HistoryItem[] = useMemo(() => {
    return apiItems.map((it: any) => {
      const total = (it.listeningScore ?? 0) + (it.readingScore ?? 0) + (it.speakingScore ?? 0) + (it.writingScore ?? 0);
      return {
        id: String(it.termId ?? ""),
        examName: `Kỳ thi #${it.termId ?? "?"}`,
        type: "Full",
        date: it.createdAt ?? "",
        durationMin: 0,
        score: total,
        status: (it.speakingRequestId || it.writingRequestId) ? "PENDING" : "Chưa gửi yêu cầu",
        ...it,
      } as HistoryItem;
    });
  }, [apiItems]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return mapped.filter((it) => {
      const matchTerm = !term ||
        it.examName.toLowerCase().includes(term) ||
        it.type.toLowerCase().includes(term);
      const matchStatus = !status || it.status === status;
      const matchType = !type || it.type === type;
      const inFrom = !dateFrom || it.date >= dateFrom;
      const inTo = !dateTo || it.date <= dateTo;
      return matchTerm && matchStatus && matchType && inFrom && inTo;
    });
  }, [mapped, search, status, type, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
  setSearch("");
  setStatus("");
  setType("");
  setDateFrom("");
  setDateTo("");
  setPage(1);

  };





  // Gửi yêu cầu chấm điểm
  const gradingRequestMutation = require("@/services/apis/exam").useGradingRequestMutation();

  const handleGradingRequest = async (termId: number, examId: number) => {
    try {
      await gradingRequestMutation.mutateAsync([{ termId, examId }]);
      setNotification({ message: "Gửi yêu cầu chấm thành công", severity: "success" });
      refetch();
    } catch {
      setNotification({ message: "Gửi yêu cầu chấm thất bại", severity: "error" });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor:
          theme.palette.mode === "dark" ? "background.default" : "#f7f9fc",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
              Lịch sử bài thi
            </Typography>
            <Typography variant="body2" color="text.primary">
              Xem lại các bài thi bạn đã thực hiện.
            </Typography>
          </Box>
          <IconButton
            aria-label="reset filters"
            onClick={resetFilters}
            size="small"
          >
            <ClearIcon />
          </IconButton>
        </Stack>

        {/* Filters */}
        {/*<Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "background.paper", borderRadius: 2 }}>*/}
        {/*  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>*/}
        {/*    <TextField*/}
        {/*      fullWidth*/}
        {/*      label="Tìm kiếm bài thi"*/}
        {/*      placeholder="Nhập tên bài thi hoặc kỹ năng..."*/}
        {/*      value={search}*/}
        {/*      onChange={(e) => {*/}
        {/*        setSearch(e.target.value);*/}
        {/*        setPage(1);*/}
        {/*      }}*/}
        {/*      InputProps={{*/}
        {/*        startAdornment: (*/}
        {/*          <InputAdornment position="start">*/}
        {/*            <SearchIcon />*/}
        {/*          </InputAdornment>*/}
        {/*        ),*/}
        {/*      }}*/}
        {/*    />*/}

        {/*    <FormControl fullWidth>*/}
        {/*      <InputLabel id="status-label">Trạng thái</InputLabel>*/}
        {/*      <Select*/}
        {/*        labelId="status-label"*/}
        {/*        label="Trạng thái"*/}
        {/*        value={status}*/}
        {/*        onChange={(e) => {*/}
        {/*          setStatus(e.target.value as any);*/}
        {/*          setPage(1);*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <MenuItem value="">Tất cả</MenuItem>*/}
        {/*        <MenuItem value="Passed">Đạt</MenuItem>*/}
        {/*        <MenuItem value="Failed">Chưa đạt</MenuItem>*/}
        {/*        <MenuItem value="Pending">Đang chấm</MenuItem>*/}
        {/*      </Select>*/}
        {/*    </FormControl>*/}

        {/*    <FormControl fullWidth>*/}
        {/*      <InputLabel id="type-label">Kỹ năng</InputLabel>*/}
        {/*      <Select*/}
        {/*        labelId="type-label"*/}
        {/*        label="Kỹ năng"*/}
        {/*        value={type}*/}
        {/*        onChange={(e) => {*/}
        {/*          setType(e.target.value as any);*/}
        {/*          setPage(1);*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <MenuItem value="">Tất cả</MenuItem>*/}
        {/*        <MenuItem value="Full">Tổng hợp</MenuItem>*/}
        {/*        <MenuItem value="Listening">Nghe</MenuItem>*/}
        {/*        <MenuItem value="Reading">Đọc</MenuItem>*/}
        {/*        <MenuItem value="Writing">Viết</MenuItem>*/}
        {/*        <MenuItem value="Speaking">Nói</MenuItem>*/}
        {/*      </Select>*/}
        {/*    </FormControl>*/}

        {/*    <TextField*/}
        {/*      fullWidth*/}
        {/*      label="Từ ngày"*/}
        {/*      type="date"*/}
        {/*      value={dateFrom}*/}
        {/*      onChange={(e) => {*/}
        {/*        setDateFrom(e.target.value);*/}
        {/*        setPage(1);*/}
        {/*      }}*/}
        {/*      InputLabelProps={{ shrink: true }}*/}
        {/*    />*/}
        {/*    <TextField*/}
        {/*      fullWidth*/}
        {/*      label="Đến ngày"*/}
        {/*      type="date"*/}
        {/*      value={dateTo}*/}
        {/*      onChange={(e) => {*/}
        {/*        setDateTo(e.target.value);*/}
        {/*        setPage(1);*/}
        {/*      }}*/}
        {/*      InputLabelProps={{ shrink: true }}*/}
        {/*    />*/}
        {/*  </Stack>*/}
        {/*</Paper>*/}

        {/* Results */}
        {isLoading ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Đang tải dữ liệu...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng chờ trong giây lát.
            </Typography>
          </Paper>
        ) : isError ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Lỗi tải dữ liệu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Không thể tải lịch sử ở thời điểm này. Vui lòng thử lại.
            </Typography>
          </Paper>
        ) : pageItems.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Không có dữ liệu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hãy điều chỉnh bộ lọc hoặc thử tìm kiếm với từ khóa khác.
            </Typography>
          </Paper>
        ) : (
          <>
            {isMdUp ? (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 2 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên bài thi</TableCell>
                      <TableCell>Kỹ năng</TableCell>
                      <TableCell>Ngày thi</TableCell>
                      {/* <TableCell>Thời lượng</TableCell> */}
                      <TableCell>Điểm</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageItems.map((it, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{it.examName}</TableCell>
                        <TableCell>{it.type}</TableCell>
                        <TableCell>
                          {new Date(it.date).toLocaleDateString()}
                        </TableCell>
                        {/* <TableCell>{it.durationMin} phút</TableCell> */}
                        <TableCell>
                          <div>Điểm nghe: {it.listeningScore}</div>
                          <div>Điểm nói: {it.speakingScore}</div>
                          <div>Điểm đọc: {it.readingScore}</div>
                          <div>Điểm viết: {it.writingScore}</div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={it.status}
                            size="small"
                            color={
                              it.status?.toUpperCase() === "PENDING"
                                ? "warning"
                                : it.status?.toUpperCase() === "APPROVED"
                                  ? "error"
                                  : "default"
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          {/* {it.status === "ACCEPTED  "} */}
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleOpenDetail(it.termId)}
                          >
                            Xem chi tiết
                          </Button>
                          {!(it.speakingRequestId || it.writingRequestId) && (
                            <BasicButton
                              size="small"
                              onClick={() =>
                                handleGradingRequest(it.termId, Number(it.id))
                              }
                            >
                              Gửi yêu cầu chấm
                            </BasicButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Stack spacing={2}>
                {pageItems.map((it) => (
                  <Paper
                    key={it.id}
                    elevation={0}
                    sx={{ p: 2, borderRadius: 2 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <Typography fontWeight={700}>{it.examName}</Typography>
                      <Chip size="small" label={it.type} />
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Ngày thi: {new Date(it.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Thời lượng: {it.durationMin} phút
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2">
                        Điểm: {typeof it.score === "number" ? it.score : "—"}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {/* <Chip size="small" label={it.status === "Passed" ? "Đạt" : it.status === "Failed" ? "Chưa đạt" : "Đang chấm"} color={statusColor(it.status)} /> */}
                        <IconButton color="primary" aria-label="Xem chi tiết">
                          <ArrowForwardIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}

            {/* Pagination */}
            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                color="primary"
                onChange={(_, p) => setPage(p)}
                showFirstButton
                showLastButton
              />
            </Stack>
          </>
        )}
        {/* Popup chi tiết bài thi */}
        <ExamHistoryDetailDialog
          open={detailOpen}
          onClose={handleCloseDetail}
          detail={detailResp?.data}
        />
      </Container>
    </Box>
  );
};

export default History;
