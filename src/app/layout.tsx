import { Metadata } from "next";
import { ReactNode } from "react";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  metadataBase: new URL("https://luyenthivstep.vn"),
  title: {
    default: "Luyện Thi VSTEP Online - Hệ thống ôn thi VSTEP hàng đầu Việt Nam",
    template: "%s | VSTEP Luyện Thi",
  },
  description:
    "Hệ thống luyện thi VSTEP online với đầy đủ 4 kỹ năng Listening, Reading, Speaking, Writing. Đề thi chuẩn, chấm điểm tự động, phản hồi chi tiết.",
  keywords:
    "VSTEP, luyện thi VSTEP, thi VSTEP online, ôn thi VSTEP, VSTEP B1, VSTEP B2, VSTEP C1, tiếng Anh VSTEP, đề thi VSTEP",
  authors: [{ name: "VSTEP Luyện Thi" }],
  creator: "VSTEP Luyện Thi",
  publisher: "VSTEP Luyện Thi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://luyenthivstep.vn",
    siteName: "VSTEP Luyện Thi",
    title: "Luyện Thi VSTEP Online - Hệ thống ôn thi VSTEP hàng đầu Việt Nam",
    description:
      "Hệ thống luyện thi VSTEP online với đầy đủ 4 kỹ năng. Đề thi chuẩn, chấm điểm tự động, phản hồi chi tiết.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "VSTEP Luyện Thi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luyện Thi VSTEP Online",
    description:
      "Hệ thống luyện thi VSTEP online với đầy đủ 4 kỹ năng. Đề thi chuẩn, chấm điểm tự động.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Add your actual verification code
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
  alternates: {
    canonical: "https://luyenthivstep.vn",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi">
      <body style={{ backgroundColor: "#ffffff" }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
