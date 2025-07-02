import { useAuthContext } from "@/contexts/AuthContext";
import { createPaymentMomo } from "@/services/apis/payment";
import { useRouter } from "next/navigation";

export const usePayment = () => {
  const { isAuthenticated } = useAuthContext();
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

  return { handlePurchase };
};
