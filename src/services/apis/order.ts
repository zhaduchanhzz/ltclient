import { API_PATH } from "@/consts/api-path";
import { CommonResponse } from "@/types/common";
import HttpClient from "@/utils/axios-config";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Order, OrderCreateRequest, OrderFilterParams } from "../types/order";

// GET all orders
export const useGetOrdersQuery = (enabled = true) => {
  return useQuery({
    queryKey: [API_PATH.ORDERS],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<Order[]>>(API_PATH.ORDERS);
    },
    enabled,
  });
};

// GET order by ID
export const useGetOrderByIdQuery = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: [API_PATH.ORDERS, orderId],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<Order>>(
        `${API_PATH.ORDERS}/${orderId}`,
      );
    },
    enabled,
  });
};

// GET filtered orders
export const useGetFilteredOrdersQuery = (
  params: OrderFilterParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: [API_PATH.ORDERS, "filter", params],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<Order[]>>(
        `${API_PATH.ORDERS}/filter`,
        { params },
      );
    },
    enabled,
  });
};

// POST create new order
export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: (data: OrderCreateRequest) => {
      return HttpClient.post<typeof data, CommonResponse<Order>>(
        API_PATH.ORDERS,
        data,
      );
    },
  });
};

// PUT update order
export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: (data: {
      id: string;
      vipPackageId: number;
      status: "SUCCESS" | "FAILED";
    }) => {
      return HttpClient.put<typeof data, CommonResponse<Order>>(
        `${API_PATH.ORDERS}/${data.id}`,
        data,
      );
    },
  });
};

// DELETE order
export const useDeleteOrderMutation = () => {
  return useMutation({
    mutationFn: (orderId: string) => {
      return HttpClient.delete<null, CommonResponse<null>>(
        `${API_PATH.ORDERS}/${orderId}`,
      );
    },
  });
};
