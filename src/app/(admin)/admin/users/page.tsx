"use client";

import ConfirmDialog from "@/components/common/Dialog/ConfirmDialog";
import { useAppContextHandle } from "@/contexts/AppContext";
import {
  useAdminUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "@/services/apis/users";
import {
  CreateUserDtoRequest,
  UpdateUserProfileDtoRequest,
  UserProfileDto,
} from "@/services/types/users";
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
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
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
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

interface UserFormData {
  id?: number;
  username: string;
  password?: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  role: string;
  isEnable: boolean;
  gradeRequest: number;
  expirationVipDate?: string | null;
}

const UsersPage = () => {
  const { updateAppState } = useAppContextHandle();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfileDto>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [vipDate, setVipDate] = useState<Dayjs | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    role: "NOR_USER",
    isEnable: true,
    gradeRequest: 0,
    expirationVipDate: null,
  });

  // API hooks
  const {
    data: usersResponse,
    isLoading,
    refetch,
  } = useAdminUsersQuery({
    page: page,
    size: rowsPerPage,
    keyword: searchQuery,
    role: roleFilter || undefined,
    isEnable: statusFilter ? statusFilter === "active" : undefined,
  });

  const { mutateAsync: createUser } = useCreateUserMutation();
  const { mutateAsync: updateUser } = useUpdateUserMutation(formData.id);
  const { mutateAsync: deleteUser } = useDeleteUserMutation();

  const users = usersResponse?.data?.content || [];
  const totalCount = usersResponse?.data?.totalElements || 0;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (user?: UserProfileDto) => {
    if (user) {
      setIsEditMode(true);
      setFormData({
        id: user.id,
        username: user.username,
        email: user.email || "",
        fullName: user.name || "",
        phoneNumber: user.phone || "",
        address: user.address || "",
        role: user.role || "NOR_USER",
        isEnable: user.isEnable !== false,
        gradeRequest: user.gradeRequest || 0,
        expirationVipDate: user.expirationVipDate,
      });
      setVipDate(user.expirationVipDate ? dayjs(user.expirationVipDate) : null);
    } else {
      setIsEditMode(false);
      setFormData({
        username: "",
        password: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        role: "NOR_USER",
        isEnable: true,
        gradeRequest: 0,
        expirationVipDate: null,
      });
      setVipDate(null);
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      username: "",
      password: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      address: "",
      role: "NOR_USER",
      isEnable: true,
      gradeRequest: 0,
      expirationVipDate: null,
    });
    setVipDate(null);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        const updateData: UpdateUserProfileDtoRequest = {
          id: formData.id || 0,
          fullName: formData.fullName || undefined,
          email: formData.email || undefined,
          address: formData.address || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          username: formData.username,
          role: formData.role,
          gradeRequest: formData.gradeRequest,
          expirationVipDate: vipDate?.toISOString(),
          isEnable: formData.isEnable,
        };
        await updateUser(updateData);
        updateAppState({
          appAlertInfo: {
            message: "Cập nhật người dùng thành công",
            severity: "success",
          },
        });
      } else {
        const createData: CreateUserDtoRequest = {
          username: formData.username,
          password: formData.password || "",
          email: formData.email || undefined,
          fullName: formData.fullName || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          address: formData.address || undefined,
          role: formData.role,
          gradeRequest: formData.gradeRequest,
          expirationVipDate: vipDate?.toISOString(),
          isEnable: formData.isEnable,
        };
        await createUser(createData);
        updateAppState({
          appAlertInfo: {
            message: "Tạo người dùng thành công",
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
    if (!selectedUser?.id) {
      console.error("No user selected or user ID is missing");
      updateAppState({
        appAlertInfo: {
          message: "Không thể xác định người dùng cần xóa",
          severity: "error",
        },
      });
      return;
    }

    try {
      console.log("Deleting user with ID:", selectedUser.id);
      const result = await deleteUser(selectedUser.id);
      console.log("Delete result:", result);

      updateAppState({
        appAlertInfo: {
          message: "Xóa người dùng thành công",
          severity: "success",
        },
      });
      setOpenDeleteDialog(false);
      setSelectedUser(undefined);
      refetch();
    } catch (error: any) {
      console.error("Delete error:", error);
      updateAppState({
        appAlertInfo: {
          message:
            error?.response?.data?.message ||
            "Có lỗi xảy ra khi xóa người dùng",
          severity: "error",
        },
      });
    }
  };

  const getRoleChipColor = (role?: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "error";
      case "LECTURER":
        return "warning";
      default:
        return "primary";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
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
      <Typography variant="h4" sx={{ mb: 3 }}>
        Quản lý người dùng
      </Typography>

      <Stack spacing={3}>
        {/* Search and Actions */}
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="Tìm kiếm người dùng..."
                variant="outlined"
                size="small"
                sx={{ flex: 1 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Thêm người dùng
              </Button>
            </Stack>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={roleFilter}
                  label="Vai trò"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="NOR_USER">Người dùng</MenuItem>
                  <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                  <MenuItem value="VIP_USER">Người dùng VIP</MenuItem>
                  <MenuItem value="LECTURER">Giảng viên</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Card>

        {/* Users Table */}
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên người dùng</TableCell>
                  <TableCell>Thông tin</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>VIP</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2">
                          {user.name || "Chưa cập nhật"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email || "Chưa có email"}
                        </Typography>
                        {user.phone && (
                          <Typography variant="caption" color="text.secondary">
                            {user.phone}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role || "USER"}
                        color={getRoleChipColor(user.role) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.isEnable !== false ? "Hoạt động" : "Đã khóa"
                        }
                        color={user.isEnable !== false ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.expirationVipDate ? (
                        <Stack spacing={0.5}>
                          <Chip label="VIP" color="warning" size="small" />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(user.expirationVipDate)}
                          </Typography>
                        </Stack>
                      ) : (
                        <Chip label="Free" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.createdDate)}</TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(user)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedUser(user);
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
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Không tìm thấy người dùng nào
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
        </Card>
      </Stack>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              {isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small" sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Tên đăng nhập"
                fullWidth
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={isEditMode}
              />
              {!isEditMode && (
                <TextField
                  label="Mật khẩu"
                  fullWidth
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              )}
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Họ và tên"
                fullWidth
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Số điện thoại"
                fullWidth
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
              <TextField
                label="Địa chỉ"
                fullWidth
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={formData.role}
                  label="Vai trò"
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <MenuItem value="NOR_USER">Người dùng</MenuItem>
                  <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                  <MenuItem value="VIP_USER">Người dùng VIP</MenuItem>
                  <MenuItem value="LECTURER">Giảng viên</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Lượt chấm tự luận"
                type="number"
                fullWidth
                value={formData.gradeRequest}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gradeRequest: parseInt(e.target.value) || 0,
                  })
                }
              />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Ngày hết hạn VIP"
                  value={vipDate}
                  onChange={(newValue) => setVipDate(newValue)}
                  sx={{ flex: 1 }}
                  format="DD/MM/YYYY HH:mm"
                />
              </LocalizationProvider>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isEnable}
                    onChange={(e) =>
                      setFormData({ ...formData, isEnable: e.target.checked })
                    }
                  />
                }
                label="Kích hoạt tài khoản"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.username || (!isEditMode && !formData.password)}
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
          setSelectedUser(undefined);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa người dùng "${selectedUser?.username}"? Hành động này không thể hoàn tác.`}
      />
    </Box>
  );
};

export default UsersPage;
