import { API_PATH } from "@/consts/api-path";
import {
  CreateSettingsRequest,
  SettingsResponse,
  UpdateSettingsRequest,
} from "@/services/types/settings";
import HttpClient from "@/utils/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get all settings configs
export const useGetSettingsQuery = () => {
  return useQuery({
    queryKey: ["settings-configs"],
    queryFn: async () => {
      try {
        const response = await HttpClient.get<SettingsResponse>(
          `${API_PATH.SETTINGS}/configs`,
        );
        // Ensure we always return an object
        return response || {};
      } catch (error) {
        console.error("Error fetching settings:", error);
        // Return empty object on error to prevent undefined
        return {};
      }
    },
    enabled: true,
  });
};

// Create new settings config
export const useCreateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSettingsRequest) => {
      const response = await HttpClient.post<{}>(
        `${API_PATH.SETTINGS}/create?type=${data.type}&content=${data.content}`,
        {},
      );

      return response;
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
      const params = new URLSearchParams();
      if (data.link !== undefined) params.append("link", data.link);

      const response = await HttpClient.put<{}>(
        `${API_PATH.SETTINGS}/update/${data.id}?${params.toString()}`,
        {},
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-configs"] });
    },
  });
};

// Delete settings config
export const useDeleteSettingsConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await HttpClient.delete<any>(
        `${API_PATH.SETTINGS}/${id}`,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-configs"] });
    },
  });
};
