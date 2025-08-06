import { API_PATH } from "@/consts/api-path";
import { CommonResponse } from "@/types/common";
import {
  AdminUsersQueryParams,
  CreateUserDtoRequest,
  CreateUserDtoResponse,
  PaginationResponseUserProfileDto,
  UpdateUserProfileDtoRequest,
  UserProfileDto,
} from "@/services/types/users";
import HttpClient from "@/utils/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// List users with pagination and filters
export const useAdminUsersQuery = (params: AdminUsersQueryParams) => {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params.size !== undefined)
        queryParams.append("size", params.size.toString());
      if (params.keyword) queryParams.append("keyword", params.keyword);
      if (params.role) queryParams.append("role", params.role);
      if (params.isEnable !== undefined)
        queryParams.append("isEnable", params.isEnable.toString());

      const response = await HttpClient.get<
        PaginationResponseUserProfileDto,
        CommonResponse<PaginationResponseUserProfileDto>
      >(`${API_PATH.ADMIN_USERS}?${queryParams.toString()}`);
      return response;
    },
    enabled: true,
  });
};

// Create new user
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserDtoRequest) => {
      const response = await HttpClient.post<
        any,
        CommonResponse<CreateUserDtoResponse>
      >(API_PATH.ADMIN_CREATE_USER, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};

// Update user profile
export const useUpdateUserMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserProfileDtoRequest) => {
      const response = await HttpClient.patch<
        any,
        CommonResponse<UserProfileDto>
      >(`${API_PATH.ADMIN_UPDATE_USER}/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};

// Delete user
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await HttpClient.delete<string, CommonResponse<string>>(
        `${API_PATH.ADMIN_DELETE_USER}/${id}`,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};
