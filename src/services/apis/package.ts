import { API_PATH } from "@/consts/api-path";
import { CommonResponse } from "@/types/common";
import HttpClient from "@/utils/axios-config";
import { useQuery, useMutation } from "@tanstack/react-query";
import { VipPackage } from "../types/package";

// GET all packages
export const useGetPackagesQuery = (enabled = true) => {
  return useQuery({
    queryKey: [API_PATH.PACKAGE],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<VipPackage[]>>(
        API_PATH.PACKAGE,
      );
    },
    enabled,
  });
};

// GET single package by ID
export const useGetPackageByIdQuery = (packageId: number, enabled = true) => {
  return useQuery({
    queryKey: [API_PATH.PACKAGE, packageId],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<VipPackage>>(
        `${API_PATH.PACKAGE}/${packageId}`,
      );
    },
    enabled,
  });
};

// POST create new package
export const useCreatePackageMutation = () => {
  return useMutation({
    mutationFn: (data: Omit<VipPackage, "id">) => {
      return HttpClient.post<typeof data, CommonResponse<VipPackage>>(
        API_PATH.PACKAGE,
        data,
      );
    },
  });
};

// PUT update package
export const useUpdatePackageMutation = () => {
  return useMutation({
    mutationFn: (data: VipPackage) => {
      if (!data.id) throw new Error("Package ID is required for update");
      return HttpClient.put<typeof data, CommonResponse<VipPackage>>(
        `${API_PATH.PACKAGE}/${data.id}`,
        data,
      );
    },
  });
};

// DELETE package
export const useDeletePackageMutation = () => {
  return useMutation({
    mutationFn: (packageId: number) => {
      return HttpClient.delete<null, CommonResponse<null>>(
        `${API_PATH.PACKAGE}/${packageId}`,
      );
    },
  });
};
