"use client";

import { usePendingGradingRequestsQuery } from "@/services/apis/exam";
import { PendingGradingRequestItem } from "@/services/types/exam";
import {
  Box,
  Card,
  CircularProgress,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Chip,
  Button,
  Paper,
  MenuItem,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  { label: "Tất cả", value: "" },
  { label: "Đang chờ", value: "PENDING" },
  { label: "Đã chấp nhận", value: "ACCEPTED" },
  { label: "Đã chấm", value: "GRADED" },
];

const formatDateTime = (iso?: string) => {
  if (!iso) return "";

  try {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN");
  } catch {
    return iso;
  }
};

const ActionButton = ({ termId }: { termId: number }) => {
  const router = useRouter();
  return (
    <Button
      variant="contained"
      size="small"
      onClick={() => router.push(`/admin/exams/marking/${termId}`)}
    >
      Chấm bài
    </Button>
  );
};

const MarkingRequestsPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, error } = usePendingGradingRequestsQuery(
    { status: status || undefined, keyword: searchQuery || undefined },
    true,
  );

  const items: PendingGradingRequestItem[] = data?.data || [];
  // Filtering (client-side)
  const displayedItems = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((it) =>
      [
        it.requestId?.toString(),
        it.termId?.toString(),
        it.examId?.toString(),
        it.userId?.toString(),
        it.userName?.toString(),
        it.status?.toString(),
        formatDateTime(it.requestedAt),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, searchQuery]);

  const filtered = searchQuery ? displayedItems : items;
  const totalElements = filtered.length;
  const paginatedItems = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
        Chấm thi
      </Typography>

      <Stack spacing={2}>
        {/* Card gom Search + Table */}
        <Card>
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", gap: 2, display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="Tìm kiếm yêu cầu chấm..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 240, maxWidth: 350, flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Trạng thái"
              size="small"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 160 }}
            >
              {statuses.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box p={3}>
              <Typography color="error">
                Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã lượt thi</TableCell>
                      <TableCell>Mã bài thi</TableCell>
                      <TableCell>Tên người thi</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Thời gian yêu cầu</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedItems.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{row.termId}</TableCell>
                        <TableCell>{row.examId}</TableCell>
                        <TableCell>{row.userName ?? row.userId}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status || "PENDING"}
                            size="small"
                            color={
                              row.status?.toUpperCase() === "PENDING"
                                ? "warning"
                                : row.status?.toUpperCase() === "APPROVED"
                                  ? "success"
                                  : row.status?.toUpperCase() === "REJECTED"
                                    ? "error"
                                    : "default"
                            }
                          />
                        </TableCell>
                        <TableCell>{formatDateTime(row.requestedAt)}</TableCell>
                        <TableCell align="center">
                          <ActionButton termId={row.termId} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            {searchQuery ? "Không tìm thấy yêu cầu phù hợp" : "Không có yêu cầu chấm nào"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng mỗi trang:"
              />
            </>
          )}
        </Card>
      </Stack>
    </Box>
  );
};

export default MarkingRequestsPage;
