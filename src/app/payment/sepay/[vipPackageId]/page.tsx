"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { createSepayQr } from "@/services/apis/payment";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// New response shape from API

type SepayCreateQrData = {
  qrImageUrl: string;
  accountNumber: string;
  bankName: string;
};

export default function SepayQrPage() {
  const { isAuthenticated, userInfo } = useAuthContext();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SepayCreateQrData | null>(null);

  const vipPackageId = useMemo(() => {
    const raw = params?.vipPackageId;
    if (typeof raw === "string") return Number(raw);
    if (Array.isArray(raw)) return Number(raw[0]);
    return NaN;
  }, [params]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

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
          throw new Error("Dữ liệu trả về không hợp lệ.");
        }

        setResult(data as SepayCreateQrData);
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

  return (
    <div style={{ maxWidth: 560, margin: "32px auto", padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Thanh toán qua Sepay
      </h1>

      {loading && (
        <div style={{ padding: "12px 0" }}>Đang tạo mã QR, vui lòng chờ…</div>
      )}

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && result && (
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <Image
              src={result.qrImageUrl}
              alt={`QR ${result.bankName}`}
              width={280}
              height={280}
              style={{ objectFit: "contain" }}
              unoptimized
              priority
            />
            <div style={{ color: "#666", marginTop: 8 }}>
              Quét mã để thanh toán bằng ứng dụng ngân hàng.
            </div>
          </div>

          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ color: "#6b7280" }}>Ngân hàng</div>
              <div style={{ fontWeight: 700 }}>{result.bankName}</div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <div style={{ color: "#6b7280" }}>Số tài khoản</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontWeight: 700 }}>{result.accountNumber}</div>
                <button
                  onClick={copyAccount}
                  style={{
                    background: "#111827",
                    color: "#fff",
                    border: 0,
                    borderRadius: 6,
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Sao chép
                </button>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Nếu bạn gặp vấn đề khi quét mã, hãy thử lại sau vài phút hoặc liên
            hệ hỗ trợ.
          </div>
        </div>
      )}
    </div>
  );
}
