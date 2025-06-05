export type PackageType = "DE_THI_VIP" | "CHAM_TU_LUAN" | "COMBO_UU_DAI";

export type VipPackage = {
  id: number;
  name: string;
  packageType: PackageType;
  vipMarkAdd: number;
  vipDateAdd: number;
  price: number;
};
