// import { CommonResponse } from "../types";
import { API_PATH } from "@/consts/api-path";
import { CommonResponse } from "@/types/common";
import HttpClient from "@/utils/axios-config";
import { Payment } from "../types/payment";

// export const useCreatePaymentMutation = (vipPackageId: number) => {
//   return useMutation({
//     mutationFn: () => {
//       return HttpClient.post<{ vipPackageId: number }, CommonResponse<Payment>>(
//         `${API_PATH.PAYMENT}/momo/create`,
//         { vipPackageId },
//       );
//     },
//   });
// };

export const createPaymentMomo = async (vipPackageId: number) => {
  try {
    const response = await HttpClient.post<
      { vipPackageId: number },
      CommonResponse<Payment>
    >(`${API_PATH.PAYMENT}/momo/create`, { vipPackageId });
    return response.data;
  } catch (error) {
    throw error;
  }
};
