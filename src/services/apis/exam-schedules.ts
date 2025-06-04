import { API_PATH } from "@/consts/api-path";
import { useMutation, useQuery } from "@tanstack/react-query";
import HttpClient from "@/utils/axios-config";
import { CommonResponse } from "@/types/common";
import { ExamSchedule } from "../types/exam-schedule";

export const useGetExamSchedulesQuery = (enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.EXAM_SCHEDULES],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<ExamSchedule[]>>(
        API_PATH.EXAM_SCHEDULES,
      );
    },
    enabled,
  });
};

export const useUpdateExamScheduleMutation = () => {
  return useMutation({
    mutationFn: (data: ExamSchedule) => {
      return HttpClient.put<ExamSchedule, CommonResponse<ExamSchedule>>(
        API_PATH.EXAM_SCHEDULES,
        data,
      );
    },
  });
};
