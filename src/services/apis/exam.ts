import { API_PATH } from "@/consts/api-path";
import { CommonResponse } from "@/types/common";
import HttpClient from "@/utils/axios-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateExamRequest,
  Exam,
  ExamResponse,
  ExamFilterParams,
  ExamsDetail,
  ExamSubmitRequest,
  ExamSubmitResponse,
  GradingRequestDto,
  GradingResponseDto,
  ListExamByTypeResponse,
  SimulationExam,
  TakeExamResponse,
  UpdateExamRequest,
  UserHistoryResponse,
  UserWriting,
  BulkExamSubmitRequest,
  BulkExamSubmitResponseData,
} from "../types/exam";

export const useExamsQuery = (enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<ExamsDetail>>(API_PATH.EXAMS);
    },
    enabled,
  });
};

export const useExamDetailQuery = (examId: string, enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS, examId],
    queryFn: () => {
      return HttpClient.get<string, CommonResponse<ExamsDetail>>(
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
    mutationFn: (data: CreateExamRequest) => {
      return HttpClient.post<CreateExamRequest, CommonResponse<Exam>>(
        API_PATH.EXAMS,
        data,
      );
    },
  });
};

export const useUpdateExamMutation = () => {
  return useMutation({
    mutationFn: (data: UpdateExamRequest) => {
      return HttpClient.put<UpdateExamRequest, CommonResponse<ExamResponse>>(API_PATH.EXAMS + `/${data.id}`, data);
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

export const useGetUserWritingQuery = (enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS, "user-writing"],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<UserWriting[]>>(
        API_PATH.EXAMS + "/user-writing",
      );
    },
    enabled,
  });
};

export const useGetUserHistoryQuery = (enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS, "history"],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<UserHistoryResponse>>(
        API_PATH.EXAMS + "/history",
      );
    },
    enabled,
  });
};

export const useTakeExamMutation = () => {
  return useMutation({
    mutationFn: () => {
      return HttpClient.post<null, CommonResponse<TakeExamResponse>>(
        API_PATH.TAKE_EXAM,
      );
    },
  });
};

export const useGetExamByIdQuery = (termId: string) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS, termId],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<Exam>>(
        API_PATH.EXAMS + "/" + termId,
      );
    },
  });
};

export const useGetAllExamsQuery = (enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS, "all"],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<SimulationExam[]>>(
        API_PATH.EXAMS,
      );
    },
    enabled,
  });
};

export const useSubmitExamMutation = () => {
  return useMutation({
    mutationFn: (data: ExamSubmitRequest) => {
      return HttpClient.post<
        ExamSubmitRequest,
        CommonResponse<ExamSubmitResponse>
      >(API_PATH.EXAMS + "/submit", data);
    },
  });
};

// Unified bulk submission (same endpoint, unified body)
export const useSubmitAllExamsMutation = () => {
  return useMutation({
    mutationFn: (data: BulkExamSubmitRequest) => {
      return HttpClient.post<
        BulkExamSubmitRequest,
        CommonResponse<BulkExamSubmitResponseData>
      >(API_PATH.EXAMS + "/submit", data);
    },
  });
};

export const useGradingRequestMutation = () => {
  return useMutation({
    mutationFn: (data: GradingRequestDto) => {
      return HttpClient.post<
        GradingRequestDto,
        CommonResponse<GradingResponseDto>
      >(API_PATH.GRADING_REQUEST, data);
    },
  });
};

export const useListExamsByTypeQuery = (enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS_LIST_BY_TYPE],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<ListExamByTypeResponse>>(
        API_PATH.EXAMS_LIST_BY_TYPE,
      );
    },
    enabled,
  });
};
