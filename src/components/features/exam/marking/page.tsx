"use client";

import { usePendingGradingRequestsQuery } from "@/services/apis/exam";
import { PendingGradingRequestItem } from "@/services/types/exam";
import {
  Box,
  Card,
  CircularProgress,
  InputAdornment,
  Paper,
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
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const formatDateTime = (iso?: string) => {
  if (!iso) {
    return "";
  }

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

  const { data, isLoading, error } = usePendingGradingRequestsQuery(
    { page, size: rowsPerPage, keyword: searchQuery || undefined },
    true,
  );

  const items: PendingGradingRequestItem[] = data?.data?.content || [];
  const totalElements = data?.data?.totalElements || 0;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // In case backend doesn't support keyword, client-side filter as a fallback
  const displayedItems = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((it) =>
      [
        it.requestId?.toString(),
        it.termId?.toString(),
        it.examId?.toString(),
        it.userId?.toString(),
        it.status?.toString(),
        formatDateTime(it.requestedAt),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, searchQuery]);

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
        Chấm thi
      </Typography>

      <Stack spacing={3}>
        {/* Search */}
        <Card sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Tìm kiếm yêu cầu chấm..."
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Card>

        {/* Table */}
        <Card>
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
                    {(searchQuery ? displayedItems : items).map((row) => (
                      <TableRow key={row.requestId} hover>
                        <TableCell>{row.termId}</TableCell>
                        <TableCell>{row.examId}</TableCell>
                        <TableCell>{row.userId}</TableCell>
                        <TableCell>
                          <Chip label={row.status || "PENDING"} size="small" color={row.status?.toUpperCase() === "PENDING" ? "warning" : row.status?.toUpperCase() === "APPROVED" ? "success" : row.status?.toUpperCase() === "REJECTED" ? "error" : "default"} />
                        </TableCell>
                        <TableCell>{formatDateTime(row.requestedAt)}</TableCell>
                        <TableCell align="center">
                          <ActionButton termId={row.termId} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {(items.length === 0 || (searchQuery && displayedItems.length === 0)) && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
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
