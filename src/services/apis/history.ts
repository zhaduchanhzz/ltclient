import { useQuery } from "@tanstack/react-query";
import { API_PATH } from "@/consts/api-path";
import HttpClient from "@/utils/axios-config";
import { CommonResponse } from "@/types/common";

export const useHistoryQuery = () => {
  return useQuery({
    queryKey: [API_PATH.HISTORY],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<any>>(API_PATH.HISTORY);
    },
  });
};