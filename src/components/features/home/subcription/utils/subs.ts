import { useGetPackagesQuery } from "@/services/apis/package";
import { PackageType, VipPackage } from "@/services/types/package";

export type Subscription = {
  id: string;
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

  const getPackagePrefix = (type: PackageType): string => {
    switch (type) {
      case "DE_THI_VIP":
        return "vip";
      case "CHAM_TU_LUAN":
        return "essay";
      case "COMBO_UU_DAI":
        return "combo";
    }
  };

  const baseSub: Omit<Subscription, "features" | "icon" | "saving"> = {
    id: `${getPackagePrefix(pkg.packageType)}-${pkg.id}`,
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
// export const VIP_SUBSCRIPTIONS = [
//   {
//     id: "vip-7",
//     type: "vip",
//     title: "VIP 7 NGÀY",
//     price: 40000,
//     priceUnit: "VND",
//     features: [
//       { label: "Truy cập không giới hạn đề thi", checked: true },
//       { label: "Truy cập không giới hạn lượt thi", checked: true },
//       { label: "Thời gian", value: "7 ngày" },
//     ],
//     button: "Thanh toán ngay",
//     icon: "\uD83D\uDCC5",
//   },
//   {
//     id: "vip-30",
//     type: "vip",
//     title: "VIP 30 NGÀY",
//     price: 50000,
//     priceUnit: "VND",
//     features: [
//       { label: "Truy cập không giới hạn đề thi", checked: true },
//       { label: "Truy cập không giới hạn lượt thi", checked: true },
//       { label: "Thời gian", value: "30 ngày" },
//       { label: "Tiết kiệm hơn", value: "250%" },
//     ],
//     button: "Thanh toán ngay",
//     icon: "\uD83D\uDCC5",
//   },
//   {
//     id: "vip-90",
//     type: "vip",
//     title: "VIP 90 NGÀY",
//     price: 120000,
//     priceUnit: "VND",
//     features: [
//       { label: "Truy cập không giới hạn đề thi", checked: true },
//       { label: "Truy cập không giới hạn lượt thi", checked: true },
//       { label: "Thời gian", value: "90 ngày" },
//       { label: "Tiết kiệm hơn", value: "400%" },
//     ],
//     button: "Thanh toán ngay",
//     icon: "\uD83D\uDCC5",
//   },
// ];

// export const MARK_SUBSCRIPTIONS = [
//   {
//     id: "essay-1",
//     type: "essay",
//     title: "CHẤM TỰ LUẬN 1 LƯỢT",
//     price: 40000,
//     priceUnit: "VND",
//     features: [
//       { label: "Nhận điểm thi từng tiêu chí VSTEP", checked: true },
//       { label: "Nhận phản hồi chi tiết từ giám khảo", checked: true },
//       { label: "Thời gian nhận kết quả", value: "1-3 ngày" },
//       { label: "Lượt đăng ký chấm tự luận", value: "1 lượt" },
//     ],
//     button: "Thanh toán ngay",
//     icon: "\uD83D\uDC4C",
//   },
//   {
//     id: "essay-5",
//     type: "essay",
//     title: "CHẤM TỰ LUẬN 5 LƯỢT",
//     price: 150000,
//     priceUnit: "VND",
//     features: [
//       { label: "Nhận điểm thi từng tiêu chí VSTEP", checked: true },
//       { label: "Nhận phản hồi chi tiết từ giám khảo", checked: true },
//       { label: "Thời gian nhận kết quả", value: "1-3 ngày" },
//       { label: "Lượt đăng ký chấm tự luận", value: "5 lượt" },
//       { label: "Tiết kiệm hơn", value: "130%" },
//     ],
//     button: "Thanh toán ngay",
//     icon: "\uD83D\uDC4C",
//   },
//   {
//     id: "essay-10",
//     type: "essay",
//     title: "CHẤM TỰ LUẬN 10 LƯỢT",
//     price: 250000,
//     priceUnit: "VND",
//     features: [
//       { label: "Nhận điểm thi từng tiêu chí VSTEP", checked: true },
//       { label: "Nhận phản hồi chi tiết từ giám khảo", checked: true },
//       { label: "Thời gian nhận kết quả", value: "1-3 ngày" },
//       { label: "Lượt đăng ký chấm tự luận", value: "10 lượt" },
//       { label: "Tiết kiệm hơn", value: "160%" },
//     ],
//     button: "Thanh toán ngay",
//     icon: "\uD83D\uDC4C",
//   },
// ];

// export const COMBO_SUBSCRIPTIONS = [
//   {
//     id: "combo-30-5",
//     type: "combo",
//     title: "ĐỀ VIP 30 NGÀY + CHẤM TỰ LUẬN 5 LƯỢT",
//     price: 180000,
//     priceUnit: "VND",
//     features: [
//       { label: "Toàn bộ quyền lợi gói đề thi VIP", checked: true },
//       { label: "Toàn bộ quyền lợi gói chấm tự luận", checked: true },
//       { label: "Tiết kiệm hơn", value: "200%" },
//     ],
//     button: "Thanh toán ngay",
//     icon: "🚀",
//   },
//   {
//     id: "combo-90-10",
//     type: "combo",
//     title: "ĐỀ VIP 90 NGÀY + CHẤM TỰ LUẬN 10 LƯỢT",
//     price: 330000,
//     priceUnit: "VND",
//     features: [
//       { label: "Toàn bộ quyền lợi gói đề thi VIP", checked: true },
//       { label: "Toàn bộ quyền lợi gói chấm tự luận", checked: true },
//       { label: "Tiết kiệm hơn", value: "275%" },
//     ],
//     button: "Thanh toán ngay",
//     icon: "🚀",
//   },
// ];
