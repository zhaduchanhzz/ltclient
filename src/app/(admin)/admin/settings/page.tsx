"use client";

import { useAppContextHandle } from "@/contexts/AppContext";
import {
  useExportSettingsMutation,
  useGetSettingsQuery,
  useImportSettingsMutation,
  useResetSettingsMutation,
  useUpdateSettingsMutation,
} from "@/services/apis/settings";
import { SettingsFormData } from "@/services/types/settings";
import {
  Download as DownloadIcon,
  RestartAlt as ResetIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SettingsPage = () => {
  const { updateAppState } = useAppContextHandle();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // API hooks
  const { isLoading } = useGetSettingsQuery();
  const updateSettingsMutation = useUpdateSettingsMutation();
  const resetSettingsMutation = useResetSettingsMutation();
  const exportSettingsMutation = useExportSettingsMutation();
  const importSettingsMutation = useImportSettingsMutation();

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
    watch,
  } = useForm<SettingsFormData>({
    defaultValues: {
      general: {
        siteName: "",
        siteDescription: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
        workingHours: "",
      },
      email: {
        smtpHost: "",
        smtpPort: 587,
        smtpUsername: "",
        smtpPassword: "",
        fromEmail: "",
        fromName: "",
        emailTemplates: {
          welcome: "",
          passwordReset: "",
          orderConfirmation: "",
        },
      },
      payment: {
        momoEnabled: false,
        momoPartnerCode: "",
        momoAccessKey: "",
        momoSecretKey: "",
        bankTransferEnabled: false,
        bankAccount: "",
        bankName: "",
        bankBranch: "",
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        googleAnalyticsId: "",
        facebookPixelId: "",
        sitemapEnabled: false,
        robotsTxt: "",
      },
      system: {
        maintenanceMode: false,
        maintenanceMessage: "",
        cacheEnabled: false,
        cacheDuration: 3600,
        maxUploadSize: 10,
        allowedFileTypes: [],
        debugMode: false,
        logLevel: "info",
      },
    },
  });

  const watchMaintenanceMode = watch("system.maintenanceMode");
  const watchCacheEnabled = watch("system.cacheEnabled");

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateSettingsMutation.mutateAsync(data);
      updateAppState({
        appAlertInfo: {
          message: "Cập nhật cài đặt thành công",
          severity: "success",
        },
      });
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message: error?.data?.message || "Có lỗi xảy ra khi cập nhật cài đặt",
          severity: "error",
        },
      });
    }
  };

  const handleReset = async () => {
    try {
      await resetSettingsMutation.mutateAsync();
      updateAppState({
        appAlertInfo: {
          message: "Đã khôi phục cài đặt mặc định",
          severity: "success",
        },
      });
      setShowResetDialog(false);
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message:
            error?.data?.message || "Có lỗi xảy ra khi khôi phục cài đặt",
          severity: "error",
        },
      });
    }
  };

  const handleExport = async () => {
    try {
      const settingsData = await exportSettingsMutation.mutateAsync();
      const blob = new Blob([JSON.stringify(settingsData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `settings-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      updateAppState({
        appAlertInfo: {
          message: "Xuất cài đặt thành công",
          severity: "success",
        },
      });
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message: error?.data?.message || "Có lỗi xảy ra khi xuất cài đặt",
          severity: "error",
        },
      });
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    try {
      await importSettingsMutation.mutateAsync();
      updateAppState({
        appAlertInfo: {
          message: "Nhập cài đặt thành công",
          severity: "success",
        },
      });
      setImportFile(null);
    } catch (error: any) {
      updateAppState({
        appAlertInfo: {
          message: error?.data?.message || "Có lỗi xảy ra khi nhập cài đặt",
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

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Cài đặt hệ thống
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={exportSettingsMutation.isPending}
          >
            Xuất cài đặt
          </Button>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
          >
            Nhập cài đặt
            <input
              type="file"
              hidden
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setImportFile(file);
                  handleImport();
                }
              }}
            />
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<ResetIcon />}
            onClick={() => setShowResetDialog(true)}
          >
            Khôi phục mặc định
          </Button>
        </Stack>
      </Stack>

      {/* Search Bar */}
      <Card sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm cài đặt..."
          variant="outlined"
          size="small"
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
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Cài đặt chung" />
            <Tab label="Email" />
            <Tab label="Thanh toán" />
            <Tab label="SEO" />
            <Tab label="Hệ thống" />
          </Tabs>

          {/* General Settings Tab */}
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <Controller
                name="general.siteName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tên website"
                    fullWidth
                    required
                  />
                )}
              />

              <Controller
                name="general.siteDescription"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mô tả website"
                    fullWidth
                    multiline
                    rows={2}
                  />
                )}
              />

              <Divider />

              <Typography variant="h6">Thông tin liên hệ</Typography>

              <Controller
                name="general.contactEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email liên hệ"
                    fullWidth
                    type="email"
                  />
                )}
              />

              <Controller
                name="general.contactPhone"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Số điện thoại" fullWidth />
                )}
              />

              <Controller
                name="general.address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Địa chỉ"
                    fullWidth
                    multiline
                    rows={2}
                  />
                )}
              />

              <Controller
                name="general.workingHours"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Giờ làm việc"
                    fullWidth
                    placeholder="8:00 - 17:00 (Thứ 2 - Thứ 6)"
                  />
                )}
              />
            </Stack>
          </TabPanel>

          {/* Email Settings Tab */}
          <TabPanel value={tabValue} index={1}>
            <Stack spacing={3}>
              <Typography variant="h6">Cấu hình SMTP</Typography>

              <Controller
                name="email.smtpHost"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="SMTP Host"
                    fullWidth
                    placeholder="smtp.gmail.com"
                  />
                )}
              />

              <Controller
                name="email.smtpPort"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="SMTP Port"
                    fullWidth
                    type="number"
                    placeholder="587"
                  />
                )}
              />

              <Controller
                name="email.smtpUsername"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="SMTP Username" fullWidth />
                )}
              />

              <Controller
                name="email.smtpPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="SMTP Password"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Divider />

              <Typography variant="h6">Cài đặt gửi email</Typography>

              <Controller
                name="email.fromEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email người gửi"
                    fullWidth
                    type="email"
                  />
                )}
              />

              <Controller
                name="email.fromName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Tên người gửi" fullWidth />
                )}
              />
            </Stack>
          </TabPanel>

          {/* Payment Settings Tab */}
          <TabPanel value={tabValue} index={2}>
            <Stack spacing={3}>
              <Typography variant="h6">Cổng thanh toán Momo</Typography>

              <Controller
                name="payment.momoEnabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch checked={field.value} onChange={field.onChange} />
                    }
                    label="Kích hoạt thanh toán Momo"
                  />
                )}
              />

              <Controller
                name="payment.momoPartnerCode"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Momo Partner Code" fullWidth />
                )}
              />

              <Controller
                name="payment.momoAccessKey"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Momo Access Key" fullWidth />
                )}
              />

              <Controller
                name="payment.momoSecretKey"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Momo Secret Key"
                    fullWidth
                    type="password"
                  />
                )}
              />

              <Divider />

              <Typography variant="h6">Chuyển khoản ngân hàng</Typography>

              <Controller
                name="payment.bankTransferEnabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch checked={field.value} onChange={field.onChange} />
                    }
                    label="Kích hoạt chuyển khoản ngân hàng"
                  />
                )}
              />

              <Controller
                name="payment.bankAccount"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Số tài khoản" fullWidth />
                )}
              />

              <Controller
                name="payment.bankName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Tên ngân hàng" fullWidth />
                )}
              />

              <Controller
                name="payment.bankBranch"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Chi nhánh" fullWidth />
                )}
              />
            </Stack>
          </TabPanel>

          {/* SEO Settings Tab */}
          <TabPanel value={tabValue} index={3}>
            <Stack spacing={3}>
              <Controller
                name="seo.metaTitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Meta Title"
                    fullWidth
                    helperText="Tiêu đề hiển thị trên kết quả tìm kiếm"
                  />
                )}
              />

              <Controller
                name="seo.metaDescription"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Meta Description"
                    fullWidth
                    multiline
                    rows={3}
                    helperText="Mô tả hiển thị trên kết quả tìm kiếm"
                  />
                )}
              />

              <Controller
                name="seo.metaKeywords"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Meta Keywords"
                    fullWidth
                    helperText="Các từ khóa, cách nhau bằng dấu phẩy"
                  />
                )}
              />

              <Divider />

              <Typography variant="h6">Tracking & Analytics</Typography>

              <Controller
                name="seo.googleAnalyticsId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Google Analytics ID"
                    fullWidth
                    placeholder="G-XXXXXXXXXX"
                  />
                )}
              />

              <Controller
                name="seo.facebookPixelId"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Facebook Pixel ID" fullWidth />
                )}
              />

              <Controller
                name="seo.sitemapEnabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch checked={field.value} onChange={field.onChange} />
                    }
                    label="Tạo sitemap tự động"
                  />
                )}
              />

              <Controller
                name="seo.robotsTxt"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Robots.txt"
                    fullWidth
                    multiline
                    rows={5}
                    helperText="Nội dung file robots.txt"
                  />
                )}
              />
            </Stack>
          </TabPanel>

          {/* System Settings Tab */}
          <TabPanel value={tabValue} index={4}>
            <Stack spacing={3}>
              <Controller
                name="system.maintenanceMode"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        color="warning"
                      />
                    }
                    label="Chế độ bảo trì"
                  />
                )}
              />

              <Controller
                name="system.maintenanceMessage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Thông báo bảo trì"
                    fullWidth
                    multiline
                    rows={3}
                    disabled={!watchMaintenanceMode}
                  />
                )}
              />

              <Divider />

              <Typography variant="h6">Cài đặt bộ nhớ đệm</Typography>

              <Controller
                name="system.cacheEnabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch checked={field.value} onChange={field.onChange} />
                    }
                    label="Bật bộ nhớ đệm"
                  />
                )}
              />

              <Controller
                name="system.cacheDuration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Thời gian lưu cache (giây)"
                    fullWidth
                    type="number"
                    disabled={!watchCacheEnabled}
                  />
                )}
              />

              <Divider />

              <Typography variant="h6">Cài đặt tải lên</Typography>

              <Controller
                name="system.maxUploadSize"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Dung lượng tối đa (MB)"
                    fullWidth
                    type="number"
                  />
                )}
              />

              <Controller
                name="system.allowedFileTypes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value?.join(", ") || ""}
                    onChange={(e) => {
                      const types = e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                      field.onChange(types);
                    }}
                    label="Định dạng file cho phép"
                    fullWidth
                    helperText="Ví dụ: jpg, png, pdf, doc"
                  />
                )}
              />

              <Divider />

              <Typography variant="h6">Cài đặt gỡ lỗi</Typography>

              <Controller
                name="system.debugMode"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch checked={field.value} onChange={field.onChange} />
                    }
                    label="Chế độ debug"
                  />
                )}
              />

              <Controller
                name="system.logLevel"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Mức độ log</InputLabel>
                    <Select {...field} label="Mức độ log">
                      <MenuItem value="error">Error</MenuItem>
                      <MenuItem value="warn">Warning</MenuItem>
                      <MenuItem value="info">Info</MenuItem>
                      <MenuItem value="debug">Debug</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Stack>
          </TabPanel>

          {/* Action Buttons */}
          <Box sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => reset()}
                disabled={!isDirty}
              >
                Hủy thay đổi
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={!isDirty || updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending
                  ? "Đang lưu..."
                  : "Lưu cài đặt"}
              </Button>
            </Stack>
          </Box>
        </Card>
      </form>

      {/* Reset Dialog */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Xác nhận khôi phục cài đặt</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn khôi phục tất cả cài đặt về mặc định? Hành
            động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Hủy</Button>
          <Button
            color="warning"
            variant="contained"
            onClick={handleReset}
            disabled={resetSettingsMutation.isPending}
          >
            {resetSettingsMutation.isPending
              ? "Đang khôi phục..."
              : "Khôi phục"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
