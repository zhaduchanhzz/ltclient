import { useAuthContext } from "@/contexts/AuthContext";
import { createPaymentMomo } from "@/services/apis/payment";
import { useRouter } from "next/navigation";

export const usePayment = () => {
  const { isAuthenticated, userInfo } = useAuthContext();
  const router = useRouter();

  const handlePurchase = async (vipPackageId: number) => {
    if (isAuthenticated) {
      const response = await createPaymentMomo(vipPackageId);

      if (response) {
        window.open(response.payUrl, "_blank");
      }
    } else {
      router.push("/login");
    }
  };

  const handlePurchaseSepay = (vipPackageId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!userInfo?.id) {
      console.error("Missing user id");
      return;
    }

    // Open Sepay page in a new tab/window
    const url = `/payment/sepay/${vipPackageId}`;
    window.open(url, "_blank");
  };

  return { handlePurchase, handlePurchaseSepay };
};
