"use client";

import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicContainer from "@/components/base/MaterialUI-Basic/Container";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import HeadphonesIcon from "@mui/icons-material/Headphones";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type HomeProps = {};

const Home = (_: HomeProps) => {
  const { isAuthenticated } = useAuthContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <BasicBox
      sx={{
        height: "100vh",
        width: isMobile ? "100vw" : "100%",
      }}
    >
      <BasicContainer
        sx={{
          bgcolor: "#12263f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: isMobile ? "100%" : "60%",
          textAlign: "center",
          gap: 2,
        }}
      >
        <BasicTypography variant={isMobile ? "h4" : "h3"} color="white">
          Thi thử VSTEP trực tuyến miễn phí
        </BasicTypography>
        <BasicTypography variant="body2" color="rgb(59, 80, 108)">
          Tra cứu toàn bộ thông tin về chứng chỉ tiếng Anh VSTEP, lịch thi VSTEP
          mới nhất, thi thử VSTEP trực tuyến miễn phí.
        </BasicTypography>

        <BasicContainer
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link href={isAuthenticated ? "/exam" : "/login"}>
            <BasicButton
              sx={{
                backgroundColor: "theme.palette.primary.main",
                color: "white",
                fontSize: "15px",
                "&:hover": {
                  transition: "transform 0.3s ease",
                  transform: "translateY(-4px)",
                },
              }}
            >
              Vào thi ngay <HeadphonesIcon sx={{ ml: 1 }} fontSize="small" />
            </BasicButton>
          </Link>
          <Link href="/exam-schedule">
            <BasicButton
              sx={{
                color: theme.palette.primary.main,
                border: "1px solid",
                borderColor: theme.palette.primary.main,
                backgroundColor: "transparent",
                fontSize: "15px",
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                  color: "white",
                  transition: "transform 0.3s ease",
                  transform: "translateY(-4px)",
                },
              }}
            >
              Lịch thi mới nhất{" "}
              <CalendarTodayIcon sx={{ ml: 1 }} fontSize="small" />
            </BasicButton>
          </Link>
        </BasicContainer>
      </BasicContainer>
    </BasicBox>
  );
};

export default Home;
