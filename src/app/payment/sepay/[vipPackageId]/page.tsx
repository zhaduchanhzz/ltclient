"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { createSepayQr } from "@/services/apis/payment";
import type { SepayCreateQrResponse } from "@/services/types/payment";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { useGetOrderByIdQuery } from "@/services/apis/order";

export default function SepayQrPage() {
  const { isAuthenticated, userInfo } = useAuthContext();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SepayCreateQrResponse | null>(null);

  const vipPackageId = useMemo(() => {
    const raw = params?.vipPackageId;
    if (typeof raw === "string") return Number(raw);
    if (Array.isArray(raw)) return Number(raw[0]);
    return NaN;
  }, [params]);

  useEffect(() => {

    if (!userInfo?.id || !vipPackageId || Number.isNaN(vipPackageId)) {
      setError("Thiếu thông tin người dùng hoặc gói VIP không hợp lệ.");
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await createSepayQr({
          userId: Number(userInfo.id),
          vipPackageId: Number(vipPackageId),
        });


        // Validate minimal fields
        if (!data.qrImageUrl || !data.accountNumber || !data.bankName) {
          setError("Dữ liệu trả về không hợp lệ.");
          return;
        }

        setResult(data);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Đã xảy ra lỗi khi tạo QR thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [isAuthenticated, router, userInfo?.id, vipPackageId]);

  const copyAccount = async () => {
    if (!result?.accountNumber) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.accountNumber);
      // Optional: you can add a toast here if your project uses one
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  const formatAmount = (v?: string) => {
    if (!v) return "";
    const num = Number(v);
    if (Number.isNaN(num)) return v;

    try {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(num);
    } catch {
      return `${num.toLocaleString("vi-VN")} ₫`;
    }
  };

  // Start order status polling once we have an orderId
  const orderId = result?.orderId || "";
  const { data: orderResp, refetch: refetchOrder } = useGetOrderByIdQuery(orderId, Boolean(orderId));
  const orderStatus = orderResp?.data?.status;

  useEffect(() => {
    if (!orderId) return;
    if (orderStatus === "SUCCESS") return; // stop polling when success
    const id = window.setInterval(() => {
      refetchOrder();
    }, 10000); // poll every 10 seconds
    return () => window.clearInterval(id);
  }, [orderId, orderStatus, refetchOrder]);

  const isPaid = orderStatus === "SUCCESS";

  return (
    <Box sx={{ maxWidth: 560, mx: "auto", my: 4, p: 2 }}>
      {loading && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1.5 }}>
          Đang tạo mã QR, vui lòng chờ…
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>
      )}

      {!loading && !error && result && (
        <Box sx={{ display: "grid", gap: 2 }}>
          {isPaid ? (
            <Alert severity="success">
              Thanh toán thành công cho đơn hàng {orderId}. Cảm ơn bạn!
            </Alert>
          ) : (
            <>
              <Box sx={{ textAlign: "center" }}>
                <Image
                  src={result.qrImageUrl}
                  alt={`QR ${result.bankName}`}
                  width={280}
                  height={280}
                  style={{ objectFit: "contain" }}
                  unoptimized
                  priority
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Quét mã để thanh toán bằng ứng dụng ngân hàng.
                </Typography>
              </Box>

              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Ngân hàng</Typography>
                  <Typography fontWeight={700}>{result.bankName}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">Số tài khoản</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontWeight={700}>{result.accountNumber}</Typography>
                    <Button onClick={copyAccount} size="small" variant="contained">
                      Sao chép
                    </Button>
                  </Box>
                </Box>

                {result.amount && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">Số tiền</Typography>
                    <Typography fontWeight={700}>{formatAmount(result.amount)}</Typography>
                  </Box>
                )}

                {orderId && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">Mã đơn hàng</Typography>
                    <Typography sx={{ fontFamily: "monospace" }}>{orderId}</Typography>
                  </Box>
                )}
              </Paper>

              <Typography variant="caption" color="text.secondary">
                Nếu bạn gặp vấn đề khi quét mã, hãy thử lại sau vài phút hoặc liên hệ hỗ trợ.
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
