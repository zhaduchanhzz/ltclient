import { SOLVED_STEPS } from "@/consts";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

const SolvedProduct = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "60vh",
        bgcolor: "#12263f",
        py: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 1300,
          width: "100%",
          mx: "auto",
          px: 2,
        }}
      >
        {/* Left: Text Content */}
        <Box
          sx={{
            flex: 1,
            minWidth: 320,
            maxWidth: 600,
            textAlign: { xs: "left", md: "left" },
            mb: { xs: 4, md: 0 },
            mr: { md: 8 },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#cda274",
              fontWeight: 700,
              mb: 2,
            }}
          >
            Phần mềm thi thử mô phỏng 100% phần mềm thi chính thức
          </Typography>
          <Typography sx={{ color: "rgb(59, 80, 108)", mb: 2 }}>
            Phần mềm được phát triển hoạt động trên mọi nền tảng từ laptop đến
            điện thoại để phục vụ nhu cầu ôn luyện, thi thử VSTEP của các bạn
            thí sinh trước mỗi kỳ thi. Đăng ký thi dễ dàng với quy trình thi như
            sau:
          </Typography>
          <Box
            component="ol"
            sx={{ color: "#bfc9da", pl: 3, mb: 0, textAlign: "left" }}
          >
            {SOLVED_STEPS.map((step, idx) => (
              <li
                key={idx}
                style={{ color: "rgb(110, 132, 163)", fontSize: 14 }}
              >
                {step.text}
              </li>
            ))}
          </Box>
        </Box>
        {/* Right: Image */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 320,
            maxWidth: 600,
            bgcolor: "#fff",
            borderRadius: 4,
            p: { xs: 2, md: 4 },
            boxShadow: 3,
          }}
        >
          <Image
            src="/images/giao-dien-thi-vstep-tren-laptop.png"
            alt="Phần mềm thi thử VSTEP"
            width={500}
            height={300}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SolvedProduct;
