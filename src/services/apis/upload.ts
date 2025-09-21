import { useMutation } from "@tanstack/react-query";
import HttpClient from "@/utils/axios-config";
import { CommonResponse } from "@/types/common";
import { API_PATH } from "@/consts/api-path";

export const usePostFileMutation = () => {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return HttpClient.post<FormData, CommonResponse<string>>(
        `${API_PATH.UPLOAD_FILE}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
  });
};
