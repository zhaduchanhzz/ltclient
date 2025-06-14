import { API_PATH } from "@/consts/api-path";
import { CommonResponse } from "@/types/common";
import HttpClient from "@/utils/axios-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserInfo
} from "../types/auth";

export const useLogoutQuery = (enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.LOGOUT],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<null>>(API_PATH.LOGOUT);
    },
    enabled,
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => {
      return HttpClient.post<typeof data, CommonResponse<LoginResponse>>(
        API_PATH.LOGIN,
        data,
      );
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (params: RegisterRequest) => {
      return HttpClient.post<typeof params, CommonResponse<UserInfo>>(
        API_PATH.REGISTER,
        params,
      );
    },
  });
};

export const useProfileQuery = (enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.PROFILE],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<UserInfo>>(API_PATH.PROFILE);
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: false, // Don't retry failed requests
    refetchInterval: false, // Don't automatically refetch
  });
};