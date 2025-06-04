export interface Order {
  id: string;
  userId: number;
  userName: string;
  vipPackageId: number;
  vipPackageName: string;
  price: number;
  status: "SUCCESS" | "FAILED";
  createdAt: string;
  updatedAt: string;
  isCombinePack: boolean;
  vipMarkAdd: number;
  vipDateAdd: number;
}

export interface OrderCreateRequest {
  userId: number;
  vipPackageId: number;
}

export interface OrderFilterParams {
  status?: "SUCCESS" | "FAILED";
  fromDate?: string;
  toDate?: string;
}
