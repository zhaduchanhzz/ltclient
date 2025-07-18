import { API_PATH } from "@/consts/api-path";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HttpClient from "@/utils/axios-config";
import { CommonResponse } from "@/types/common";
import {
  ExamSchedule,
  ExamScheduleFilterParams,
  ExamScheduleRecentParams,
  PageExamSchedule,
  PageExamScheduleRecentDto,
} from "../types/exam-schedule";

// Get all exam schedules
export const useGetExamSchedulesQuery = (enabled = true) => {
  return useQuery({
    queryKey: [API_PATH.EXAM_SCHEDULES],
    queryFn: async () => {
      const response = await HttpClient.get<ExamSchedule[]>(
        API_PATH.EXAM_SCHEDULES
      );
      return response;
    },
    enabled,
  });
};

// Get exam schedule by ID
export const useGetScheduleByIdQuery = (id: number, enabled = true) => {
  return useQuery({
    queryKey: [API_PATH.EXAM_SCHEDULES, id],
    queryFn: async () => {
      const response = await HttpClient.get<ExamSchedule>(
        `${API_PATH.EXAM_SCHEDULES}/${id}`
      );
      return response;
    },
    enabled: enabled && !!id,
  });
};

// Get recent exam schedules (last 2 months) with pagination
export const useGetRecentSchedulesQuery = (params?: ExamScheduleRecentParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.size !== undefined) queryParams.append("size", params.size.toString());

  return useQuery({
    queryKey: [API_PATH.EXAM_SCHEDULES_RECENT, params],
    queryFn: async () => {
      const response = await HttpClient.get<
        PageExamScheduleRecentDto,
        CommonResponse<PageExamScheduleRecentDto>
      >(`${API_PATH.EXAM_SCHEDULES_RECENT}?${queryParams.toString()}`);
      return response;
    },
  });
};

// Filter exam schedules
export const useFilterSchedulesQuery = (params?: ExamScheduleFilterParams) => {
  const queryParams = new URLSearchParams();
  if (params?.organization) queryParams.append("organization", params.organization);
  if (params?.registrationDeadline) queryParams.append("registrationDeadline", params.registrationDeadline);
  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.size !== undefined) queryParams.append("size", params.size.toString());

  return useQuery({
    queryKey: [API_PATH.EXAM_SCHEDULES_FILTER, params],
    queryFn: async () => {
      const response = await HttpClient.get<
        PageExamSchedule,
        CommonResponse<PageExamSchedule>
      >(`${API_PATH.EXAM_SCHEDULES_FILTER}?${queryParams.toString()}`);
      return response;
    },
  });
};

// Create exam schedule
export const useCreateScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ExamSchedule, "id">) => {
      const response = await HttpClient.post<
        Omit<ExamSchedule, "id">,
        CommonResponse<ExamSchedule>
      >(API_PATH.EXAM_SCHEDULES, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAM_SCHEDULES] });
      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAM_SCHEDULES_RECENT] });
      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAM_SCHEDULES_FILTER] });
    },
  });
};

// Update exam schedule
export const useUpdateScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: ExamSchedule) => {
      const response = await HttpClient.put<
        Omit<ExamSchedule, "id">,
        CommonResponse<ExamSchedule>
      >(`${API_PATH.EXAM_SCHEDULES}/${id}`, data);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAM_SCHEDULES] });
      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAM_SCHEDULES, variables.id] });
      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAM_SCHEDULES_RECENT] });
      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAM_SCHEDULES_FILTER] });
    },
  });
};

// Delete exam schedule
export const useDeleteScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await HttpClient.delete(
        `${API_PATH.EXAM_SCHEDULES}/${id}`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAM_SCHEDULES] });
      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAM_SCHEDULES_RECENT] });
      queryClient.invalidateQueries({ queryKey: [API_PATH.EXAM_SCHEDULES_FILTER] });
    },
  });
};
