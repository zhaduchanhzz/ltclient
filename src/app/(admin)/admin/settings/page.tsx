"use client";

import { useAppContextHandle } from "@/contexts/AppContext";
import {
  useCreateSettingsMutation,
  useDeleteSettingsConfigMutation,
  useGetSettingsQuery,
} from "@/services/apis/settings";
import { SettingsConfig, SettingsType } from "@/services/types/settings";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
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
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  settingType: SettingsType;
  configs: SettingsConfig[];
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
  settingType,
  configs,
}) => {
  const { updateAppState } = useAppContextHandle();
  const createMutation = useCreateSettingsMutation();

  // For edit mode, combine all contents with semicolon
  const combinedContent = configs.map((c) => c.content).join(";");

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<any>({
    defaultValues: {
      type: settingType,
      content: combinedContent,
    },
  });

  React.useEffect(() => {
    reset({
      type: settingType,
      content: combinedContent,
    });
  }, [settingType, combinedContent, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: any) => {
    try {
      // Use create mutation to update content
      await createMutation.mutateAsync({
        type: data.type,
        content: data.content || "", // Allow empty content
      });

      updateAppState({
        appAlertInfo: {
          message: "Cập nhật cấu hình thành công",
          severity: "success",
        },
      });

      handleClose();
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message:
            error?.data?.message || "Có lỗi xảy ra khi cập nhật cấu hình",
          severity: "error",
        },
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa cấu hình</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Loại cấu hình"
                  fullWidth
                  disabled
                  value={settingType}
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nội dung"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Nhập nội dung cấu hình"
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const SettingsPage = () => {
  const { updateAppState } = useAppContextHandle();
  const { data: settingsData, isLoading, error } = useGetSettingsQuery();
  const deleteMutation = useDeleteSettingsConfigMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SettingsType | null>(null);
  const [selectedConfigs, setSelectedConfigs] = useState<SettingsConfig[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<SettingsType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<SettingsType | "ALL">("ALL");

  // Group settings by type and combine contents
  const groupedSettings = useMemo(() => {
    const grouped: Record<
      string,
      { configs: SettingsConfig[]; combinedContent: string }
    > = {};

    if (settingsData) {
      Object.entries(settingsData).forEach(([type, configs]) => {
        // Include all types, even with empty arrays
        grouped[type] = {
          configs: configs,
          combinedContent: configs
            .map((c) => c.content)
            .filter((c) => c)
            .join(";"),
        };
      });
    }

    return grouped;
  }, [settingsData]);

  // Convert grouped settings to array for table display
  const tableData = useMemo(() => {
    return Object.entries(groupedSettings).map(([type, data]) => ({
      type: type as SettingsType,
      configs: data.configs,
      content: data.combinedContent || "(trống)",
      link: data.configs[0]?.link || "",
    }));
  }, [groupedSettings]);

  // Filter settings based on search and type
  const filteredSettings = useMemo(() => {
    return tableData.filter((setting) => {
      const matchesSearch = searchQuery
        ? setting.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          setting.type.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesType = filterType === "ALL" || setting.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [tableData, searchQuery, filterType]);

  const handleEdit = (type: SettingsType, configs: SettingsConfig[]) => {
    setSelectedType(type);
    setSelectedConfigs(configs);
    setDialogOpen(true);
  };

  const handleDeleteClick = (type: SettingsType) => {
    setTypeToDelete(type);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!typeToDelete) return;

    try {
      // Delete all configs of this type
      const configs = groupedSettings[typeToDelete]?.configs || [];

      for (const config of configs) {
        await deleteMutation.mutateAsync(config.id);
      }

      updateAppState({
        appAlertInfo: {
          message: "Xóa cấu hình thành công",
          severity: "success",
        },
      });
      setDeleteDialogOpen(false);
      setTypeToDelete(null);
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message: error?.data?.message || "Có lỗi xảy ra khi xóa cấu hình",
          severity: "error",
        },
      });
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

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <Typography color="error">
          Lỗi khi tải dữ liệu cấu hình:{" "}
          {(error as any)?.message || "Unknown error"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Quản lý cấu hình
      </Typography>

      {/* Search and Filter Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              placeholder="Tìm kiếm cấu hình..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1 }}
              size="small"
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Lọc theo loại</InputLabel>
              <Select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value as SettingsType | "ALL")
                }
                label="Lọc theo loại"
              >
                <MenuItem value="ALL">Tất cả</MenuItem>
                {Object.values(SettingsType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Settings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loại</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Liên kết</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSettings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    Không tìm thấy cấu hình nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredSettings.map((setting) => (
                <TableRow key={setting.type} hover>
                  <TableCell>
                    <Chip
                      label={setting.type}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        setting.content === "(trống)"
                          ? "Chưa có dữ liệu"
                          : setting.content
                      }
                      arrow
                      placement="top"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color:
                            setting.content === "(trống)"
                              ? "text.secondary"
                              : "text.primary",
                        }}
                      >
                        {setting.content}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: setting.link ? "text.primary" : "text.secondary",
                      }}
                    >
                      {setting.link || "(trống)"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0} justifyContent="center">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleEdit(setting.type, setting.configs)
                          }
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(setting.type)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Settings Dialog */}
      {selectedType && (
        <SettingsDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedType(null);
            setSelectedConfigs([]);
          }}
          settingType={selectedType}
          configs={selectedConfigs}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTypeToDelete(null);
        }}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tất cả cấu hình của loại {typeToDelete}?
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setTypeToDelete(null);
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
