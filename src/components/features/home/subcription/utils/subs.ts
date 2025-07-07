import { useGetPackagesQuery } from "@/services/apis/package";
import { PackageType, VipPackage } from "@/services/types/package";

export type Subscription = {
  id: number;
  packageType: PackageType;
  title: string;
  price: number;
  priceUnit: string;
  features: { label: string; checked?: boolean; value?: string }[];
  button: string;
  icon: string;
  saving?: number;
};

const calculateSaving = (
  firstItemPrice: number,
  currentPrice: number,
  pkg: VipPackage,
  firstPkg: VipPackage,
) => {
  if (pkg.packageType === "DE_THI_VIP") {
    // Calculate based on days ratio for VIP packages
    const daysRatio = pkg.vipDateAdd / firstPkg.vipDateAdd;
    const priceRatio = currentPrice / firstItemPrice;
    const saving = ((daysRatio - priceRatio) / priceRatio) * 100;
    return Math.round(saving);
  } else if (pkg.packageType === "CHAM_TU_LUAN") {
    // For essay packages, use fixed percentages based on number of marks
    if (pkg.vipMarkAdd === 5) return 130; // For 5-mark package
    if (pkg.vipMarkAdd === 10) return 160; // For 10-mark package
    return 0;
  } else {
    // For combo packages, use the hardcoded values as they combine both VIP and Essay
    if (pkg.vipDateAdd === 30) return 200; // For 30-day combo
    if (pkg.vipDateAdd === 90) return 275; // For 90-day combo
    return 0;
  }
};

const transformPackageToSubscription = (
  pkg: VipPackage,
  firstItemPrice: number | null,
  firstPkg: VipPackage | null,
): Subscription => {
  const baseFeatures = [
    { label: "Truy cập không giới hạn đề thi", checked: true },
    { label: "Truy cập không giới hạn lượt thi", checked: true },
  ];

  const baseSub: Omit<Subscription, "features" | "icon" | "saving"> = {
    id: pkg.id,
    packageType: pkg.packageType,
    title: pkg.name,
    price: pkg.price,
    priceUnit: "VND",
    button: "Thanh toán ngay",
  };

  // Calculate saving for all packages except the first one in each type
  const saving =
    firstItemPrice && firstPkg && pkg !== firstPkg
      ? calculateSaving(firstItemPrice, pkg.price, pkg, firstPkg)
      : undefined;

  const savingFeature = saving
    ? [{ label: "Tiết kiệm hơn", value: `${saving}%` }]
    : [];

  if (pkg.packageType === "COMBO_UU_DAI") {
    return {
      ...baseSub,
      features: [
        { label: "Toàn bộ quyền lợi gói đề thi VIP", checked: true },
        { label: "Toàn bộ quyền lợi gói chấm tự luận", checked: true },
        { label: "Thời gian VIP", value: `${pkg.vipDateAdd} ngày` },
        { label: "Lượt chấm tự luận", value: `${pkg.vipMarkAdd} lượt` },
        ...savingFeature,
      ],
      icon: "🚀",
      saving,
    };
  }

  if (pkg.packageType === "CHAM_TU_LUAN") {
    return {
      ...baseSub,
      features: [
        { label: "Nhận điểm thi từng tiêu chí VSTEP", checked: true },
        { label: "Nhận phản hồi chi tiết từ giám khảo", checked: true },
        { label: "Thời gian nhận kết quả", value: "1-3 ngày" },
        { label: "Lượt đăng ký chấm tự luận", value: `${pkg.vipMarkAdd} lượt` },
        ...savingFeature,
      ],
      icon: "👌",
      saving,
    };
  }

  return {
    ...baseSub,
    features: [
      ...baseFeatures,
      { label: "Thời gian", value: `${pkg.vipDateAdd} ngày` },
      ...savingFeature,
    ],
    icon: "📅",
    saving,
  };
};

export const useSubscriptions = () => {
  const { data } = useGetPackagesQuery();
  const packages = data?.data || [];

  // Group packages by type
  const groupedPackages = packages.reduce<Record<PackageType, VipPackage[]>>(
    (acc, pkg) => {
      if (!acc[pkg.packageType]) {
        acc[pkg.packageType] = [];
      }

      acc[pkg.packageType].push(pkg);
      return acc;
    },
    {} as Record<PackageType, VipPackage[]>,
  );

  // Transform each group with proper savings calculation
  const transformGroup = (pkgs: VipPackage[]) => {
    const firstItemPrice = pkgs.length > 0 ? pkgs[0].price : null;
    const firstPkg = pkgs.length > 0 ? pkgs[0] : null;
    return pkgs.map((pkg) =>
      transformPackageToSubscription(pkg, firstItemPrice, firstPkg),
    );
  };

  const subscriptions = {
    VIP_SUBSCRIPTIONS: transformGroup(groupedPackages["DE_THI_VIP"] || []),
    MARK_SUBSCRIPTIONS: transformGroup(groupedPackages["CHAM_TU_LUAN"] || []),
    COMBO_SUBSCRIPTIONS: transformGroup(groupedPackages["COMBO_UU_DAI"] || []),
  };

  return subscriptions;
};

// Keeping these for reference of the structure, but they should not be used anymore
