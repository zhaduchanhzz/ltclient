import { API_PATH } from "@/consts/api-path";
import { CommonResponse } from "@/types/common";
import HttpClient from "@/utils/axios-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  UserResponsesPage,
  UserResponsesParams,
  GradeRequest,
  GradeResponse,
  DashboardStats,
} from "../types/lecturer";

// Get user responses for grading
export const useGetUserResponsesQuery = (
  params?: UserResponsesParams,
  enabled = true
) => {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params?.size !== undefined)
    queryParams.append("size", params.size.toString());
  if (params?.userId !== undefined)
    queryParams.append("userId", params.userId.toString());
  if (params?.questionId !== undefined)
    queryParams.append("questionId", params.questionId.toString());
  if (params?.termId !== undefined)
    queryParams.append("termId", params.termId.toString());

  return useQuery<UserResponsesPage>({
    queryKey: [API_PATH.LECTURER_USER_RESPONSES, params],
    queryFn: async () => {
      const response = await HttpClient.get<
        UserResponsesPage,
        CommonResponse<UserResponsesPage>
      >(`${API_PATH.LECTURER_USER_RESPONSES}?${queryParams.toString()}`);
      
      // Handle response structure
      if (!response) {
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: params?.size || 10,
          number: params?.page || 0,
          empty: true,
        };
      }
      
      // Handle wrapped response
      if ('data' in response && response.data) {
        return response.data;
      }
      
      // Handle direct response
      if ('content' in response) {
        return response as UserResponsesPage;
      }
      
      // Default empty response
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: params?.size || 10,
        number: params?.page || 0,
        empty: true,
      };
    },
    enabled,
  });
};

// Submit grade for a response
export const useGradeResponseMutation = () => {
  return useMutation({
    mutationFn: async (data: GradeRequest) => {
      const response = await HttpClient.post<
        GradeRequest,
        CommonResponse<GradeResponse>
      >(API_PATH.LECTURER_GRADE, data);
      return response;
    },
  });
};

// Get dashboard statistics (mock for now, can be replaced with real API)
export const useGetDashboardStatsQuery = (enabled = true) => {
  return useQuery<DashboardStats>({
    queryKey: ["lecturer-dashboard-stats"],
    queryFn: async () => {
      // This could be a real API endpoint later
      // For now, we'll calculate from user responses
      const responses = await HttpClient.get<
        UserResponsesPage,
        CommonResponse<UserResponsesPage>
      >(`${API_PATH.LECTURER_USER_RESPONSES}?page=0&size=1000`);
      
      const data = responses?.data || responses;
      const content = data?.content || [];
      
      const graded = content.filter(r => r.score !== null).length;
      const ungraded = content.filter(r => r.score === null).length;
      
      return {
        graded,
        inGrading: 0, // This would need a separate status field
        ungraded,
        totalResponses: content.length,
      };
    },
    enabled,
  });
};