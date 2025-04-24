import { API_PATH } from "@/consts/api-path";
import { CommonResponse } from "@/types/common";
import HttpClient from "@/utils/axios-config";
import { useQuery } from "@tanstack/react-query";

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
