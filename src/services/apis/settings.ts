import { API_PATH } from "@/consts/api-path";
import {
  CreateSettingsRequest,
  SettingsConfig,
  SettingsFormData,
  SettingsResponse,
  UpdateSettingsRequest,
} from "@/services/types/settings";
import { CommonResponse } from "@/types/common";
import HttpClient from "@/utils/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get all settings configs
export const useGetSettingsQuery = () => {
  return useQuery({
    queryKey: ["settings-configs"],
    queryFn: async () => {
      const response = await HttpClient.get<
        SettingsResponse,
        CommonResponse<SettingsResponse>
      >(`${API_PATH.SETTINGS}/configs`);
      return response.data;
    },
    enabled: true,
  });
};

// Create new settings config
export const useCreateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSettingsRequest) => {
      const formData = new FormData();

      if (data.file) {
        formData.append("file", data.file);
      }

      const response = await HttpClient.post<any, CommonResponse<SettingsConfig>>(
        `${API_PATH.SETTINGS}/create?type=${data.type}&content=${data.content}`,
        formData as any,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-configs"] });
    },
  });
};

// Update settings config
export const useUpdateSettingsConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSettingsRequest) => {
      const formData = new FormData();

      if (data.file) {
        formData.append("file", data.file);
      }

      const queryParams = new URLSearchParams();
      if (data.title !== undefined) queryParams.append("title", data.title);
      if (data.link !== undefined) queryParams.append("link", data.link);
      if (data.order !== undefined)
        queryParams.append("order", data.order.toString());
      if (data.active !== undefined)
        queryParams.append("active", data.active.toString());

      const response = await HttpClient.put<any, CommonResponse<SettingsConfig>>(
        `${API_PATH.SETTINGS}/update/${data.id}?${queryParams.toString()}`,
        formData as any,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-configs"] });
    },
  });
};

// Mock mutations for settings page functionality
// These will need to be implemented with real API endpoints when available

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<SettingsFormData>) => {
      // Mock API call - replace with real endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

export const useResetSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Mock API call - replace with real endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

export const useExportSettingsMutation = () => {
  return useMutation({
    mutationFn: async () => {
      // Mock API call - replace with real endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockSettings = {
        general: {
          siteName: "VSTEP Platform",
          siteDescription: "Nền tảng luyện thi VSTEP trực tuyến",
          contactEmail: "support@vstep.edu.vn",
          contactPhone: "1900 1234",
          address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
          workingHours: "8:00 - 17:00 (Thứ 2 - Thứ 6)",
        },
        email: {
          smtpHost: "smtp.gmail.com",
          smtpPort: 587,
          smtpUsername: "noreply@vstep.edu.vn",
          smtpPassword: "********",
          fromEmail: "noreply@vstep.edu.vn",
          fromName: "VSTEP Platform",
          emailTemplates: {
            welcome: "Chào mừng bạn đến với VSTEP Platform",
            passwordReset: "Yêu cầu đặt lại mật khẩu",
            orderConfirmation: "Xác nhận đơn hàng",
          },
        },
        payment: {
          momoEnabled: true,
          momoPartnerCode: "MOMO",
          momoAccessKey: "********",
          momoSecretKey: "********",
          bankTransferEnabled: true,
          bankAccount: "0123456789",
          bankName: "Vietcombank",
          bankBranch: "Chi nhánh Quận 5",
        },
        seo: {
          metaTitle: "VSTEP Platform - Luyện thi VSTEP online",
          metaDescription:
            "Nền tảng luyện thi VSTEP trực tuyến hàng đầu Việt Nam",
          metaKeywords: "vstep, luyện thi vstep, vstep online",
          googleAnalyticsId: "G-XXXXXXXXXX",
          facebookPixelId: "XXXXXXXXXXXXXXX",
          sitemapEnabled: true,
          robotsTxt: "User-agent: *\nAllow: /",
        },
        system: {
          maintenanceMode: false,
          maintenanceMessage: "Hệ thống đang bảo trì, vui lòng quay lại sau",
          cacheEnabled: true,
          cacheDuration: 3600,
          maxUploadSize: 10,
          allowedFileTypes: ["jpg", "png", "pdf", "doc", "docx"],
          debugMode: false,
          logLevel: "info",
        },
      };
      return mockSettings;
    },
  });
};

export const useImportSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Mock API call - replace with real endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};
