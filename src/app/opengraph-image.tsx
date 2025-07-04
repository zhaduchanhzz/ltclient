import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Luyện Thi VSTEP - Hệ thống ôn thi VSTEP online hàng đầu Việt Nam";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to bottom right, #1976d2, #42a5f5)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 20 }}>Luyện Thi VSTEP</div>
        <div style={{ fontSize: 32, textAlign: "center", maxWidth: 800 }}>
          Hệ thống luyện thi VSTEP online hàng đầu Việt Nam
        </div>
        <div style={{ fontSize: 24, marginTop: 20 }}>
          Listening • Reading • Speaking • Writing
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
