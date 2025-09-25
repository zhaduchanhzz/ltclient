import { API_PATH } from "@/consts/api-path";
import HttpClient from "@/utils/axios-config";
import { CommonResponse } from "@/types/common";
import { ExamHistoryDetail } from "@/components/common/Dialog/ExamHistoryDetailDialog";
import { useQuery } from "@tanstack/react-query";

export const useExamHistoryDetailQuery = (termId: number | string, enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.EXAMS_HISTORY, termId],
    queryFn: async () => {
      const resp = await HttpClient.get<null, CommonResponse<ExamHistoryDetail[]>>(
  `${API_PATH.EXAMS_HISTORY}/${termId}`,
      );
      return resp;
    },
    enabled,
  });
};
