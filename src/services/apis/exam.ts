import { API_PATH } from "@/consts/api-path";
import { CommonResponse } from "@/types/common";
import HttpClient from "@/utils/axios-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Exam, ExamFilterParams } from "../types/exam";

export const useExamsQuery = (enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<null>>(API_PATH.EXAMS);
    },
    enabled,
  });
};

export const useExamDetailQuery = (examId: string, enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS, examId],
    queryFn: () => {
      return HttpClient.get<string, CommonResponse<null>>(
        API_PATH.EXAMS + "/" + examId,
      );
    },
    enabled,
  });
};

export const useGetFilteredExamsQuery = (
  params: ExamFilterParams,
  enabled = false,
) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS, "filter", params],
    queryFn: () => {
      return HttpClient.get<ExamFilterParams, CommonResponse<Exam[]>>(
        API_PATH.EXAMS + "/filter",
        { params },
      );
    },
    enabled,
  });
};

export const useCreateExamMutation = () => {
  return useMutation({
    mutationFn: (data: Exam) => {
      return HttpClient.post<Exam, CommonResponse<Exam>>(API_PATH.EXAMS, data);
    },
  });
};

export const useUpdateExamMutation = () => {
  return useMutation({
    mutationFn: (data: Exam) => {
      return HttpClient.put<Exam, CommonResponse<Exam>>(API_PATH.EXAMS, data);
    },
  });
};

export const useDeleteExamMutation = () => {
  return useMutation({
    mutationFn: (examId: string) => {
      return HttpClient.delete<null, CommonResponse<null>>(
        API_PATH.EXAMS + "/" + examId,
      );
    },
  });
};
