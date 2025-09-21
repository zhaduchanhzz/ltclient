"use client";

import ConfirmDialog from "@/components/common/Dialog/ConfirmDialog";
import { useAppContextHandle } from "@/contexts/AppContext";
import {
  useGetFilteredOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "@/services/apis/order";
import { useGetPackagesQuery } from "@/services/apis/package";
import { useAdminUsersQuery } from "@/services/apis/users";
import { Order } from "@/services/types/order";
import { UserProfileDto } from "@/services/types/users";
import { formatCurrency } from "@/utils/format";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

interface OrderFormData {
  userId?: number;
  vipPackageId: number;
  status: "SUCCESS" | "FAILED";
}

const OrdersPage = () => {
  const { updateAppState } = useAppContextHandle();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    userId: undefined,
    vipPackageId: 0,
    status: "SUCCESS",
  });

  // API hooks
  const {
    data: ordersResponse,
    isLoading,
    refetch,
  } = useGetFilteredOrdersQuery(
    {
      status: (statusFilter as any) || undefined,
      page: page,
      size: rowsPerPage,
      sortDirection: "desc",
    },
    true,
  );

  const { data: packagesResponse } = useGetPackagesQuery();
  const { data: usersResponse } = useAdminUsersQuery({
    page: 0,
    size: 10,
    keyword: "",
    role: "NOR_USER",
    isEnable: true,
  });

  const { mutateAsync: createOrder } = useCreateOrderMutation();
  const { mutateAsync: updateOrder } = useUpdateOrderMutation();
  const { mutateAsync: deleteOrder } = useDeleteOrderMutation();

  const packages = packagesResponse?.data || [];
  const users = usersResponse?.data?.content || [];

  const currentData = ordersResponse?.data;
  const orders = Array.isArray(currentData)
    ? currentData
    : currentData?.content || [];
  const totalCount = Array.isArray(currentData)
    ? orders.length
    : currentData?.totalElements || 0;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (order?: Order) => {
    if (order) {
      setIsEditMode(true);
      setFormData({
        userId: undefined, // Don't need userId for edit
        vipPackageId: order.vipPackageId,
        status: order.status,
      });
      setSelectedOrder(order);
    } else {
      setIsEditMode(false);
      setFormData({
        userId: undefined,
        vipPackageId: 0,
        status: "SUCCESS",
      });
      setSelectedOrder(null);
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      userId: undefined,
      vipPackageId: 0,
      status: "SUCCESS",
    });
    setSelectedOrder(null);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && selectedOrder) {
        await updateOrder({
          id: selectedOrder.id,
          vipPackageId: formData.vipPackageId,
          status: formData.status,
        });
        updateAppState({
          appAlertInfo: {
            message: "Cập nhật đơn hàng thành công",
            severity: "success",
          },
        });
      } else {
        if (!formData.userId || !formData.vipPackageId) {
          updateAppState({
            appAlertInfo: {
              message: "Vui lòng chọn người dùng và gói VIP",
              severity: "error",
            },
          });
          return;
        }

        await createOrder({
          userId: formData.userId,
          vipPackageId: formData.vipPackageId,
        });
        updateAppState({
          appAlertInfo: {
            message: "Tạo đơn hàng thành công",
            severity: "success",
          },
        });
      }

      handleCloseDialog();
      refetch();
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message:
            error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
          severity: "error",
        },
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;

    try {
      await deleteOrder(selectedOrder.id);
      updateAppState({
        appAlertInfo: {
          message: "Xóa đơn hàng thành công",
          severity: "success",
        },
      });
      setOpenDeleteDialog(false);
      setSelectedOrder(null);
      refetch();
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message:
            error?.response?.data?.message || "Có lỗi xảy ra khi xóa đơn hàng",
          severity: "error",
        },
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "Thành công";
      case "FAILED":
        return "Thất bại";
      case "PENDING":
        return "Đang xử lý";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ fontWeight: "bold", color: "text.primary" }}
      >
        Quản lý đơn hàng
      </Typography>

      <Stack spacing={3}>
        {/* Unified Header + Table Block */}
        <Card sx={{ p: 2 }}>
          {/* Header: Search + Filters + Add */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            useFlexGap
          >
            {/* Left: Search + Status */}
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap sx={{ flex: 1, minWidth: 240 }}>
              <TextField
                placeholder="Tìm kiếm đơn hàng..."
                variant="outlined"
                size="small"
                sx={{ minWidth: 240, flex: 1 }}
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

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="PENDING">Đang xử lý</MenuItem>
                  <MenuItem value="SUCCESS">Thành công</MenuItem>
                  <MenuItem value="FAILED">Thất bại</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Right: Add */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Thêm đơn hàng
            </Button>
          </Stack>

          {/* Table */}
          <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã đơn hàng</TableCell>
                    <TableCell>Người dùng</TableCell>
                    <TableCell>Gói VIP</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell align="center">Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {order.id.slice(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order.userName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.vipPackageName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatCurrency(order.price)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(order.status)}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(order)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenDeleteDialog(true);
                            }}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Không tìm thấy đơn hàng nào
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
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng mỗi trang:"
            />
          </Box>
        </Card>
      </Stack>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              {isEditMode ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng mới"}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small" sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {!isEditMode && (
              <FormControl fullWidth>
                <InputLabel>Người dùng</InputLabel>
                <Select
                  value={formData.userId || ""}
                  label="Người dùng"
                  onChange={(e) =>
                    setFormData({ ...formData, userId: Number(e.target.value) })
                  }
                >
                  {Array.isArray(users) &&
                    users.map((user: UserProfileDto) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.username} - {user.name || user.email || "N/A"}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth>
              <InputLabel>Gói VIP</InputLabel>
              <Select
                value={formData.vipPackageId || ""}
                label="Gói VIP"
                onChange={(e) => {
                  const packageId = Number(e.target.value);
                  setFormData({ ...formData, vipPackageId: packageId });
                }}
              >
                {packages.map((pkg) => (
                  <MenuItem key={pkg.id} value={pkg.id}>
                    {pkg.name} - {formatCurrency(pkg.price)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {isEditMode && (
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  label="Trạng thái"
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                >
                  <MenuItem value="PENDING">Đang xử lý</MenuItem>
                  <MenuItem value="SUCCESS">Thành công</MenuItem>
                  <MenuItem value="FAILED">Thất bại</MenuItem>
                </Select>
              </FormControl>
            )}

            {formData.vipPackageId > 0 && (
              <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Thông tin gói:
                </Typography>
                {packages.find((p) => p.id === formData.vipPackageId) && (
                  <>
                    <Typography variant="body2">
                      Giá:{" "}
                      {formatCurrency(
                        packages.find((p) => p.id === formData.vipPackageId)
                          ?.price || 0,
                      )}
                    </Typography>
                    <Typography variant="body2">
                      VIP +
                      {
                        packages.find((p) => p.id === formData.vipPackageId)
                          ?.vipDateAdd
                      }{" "}
                      ngày
                    </Typography>
                    <Typography variant="body2">
                      Điểm +
                      {
                        packages.find((p) => p.id === formData.vipPackageId)
                          ?.vipMarkAdd
                      }
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !isEditMode
                ? !formData.userId || !formData.vipPackageId
                : !formData.vipPackageId
            }
          >
            {isEditMode ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa đơn hàng của "${selectedOrder?.userName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </Box>
  );
};

export default OrdersPage;
