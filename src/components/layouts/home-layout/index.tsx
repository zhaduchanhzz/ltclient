import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import { ReactNode } from "react";
import { useTheme } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  const theme = useTheme();
  return (
    <BasicBox>
      <Header />
      <BasicBox
        sx={{
          pt: 8.5,
          // minHeight: "calc(100vh - 100px - 200px)",
          height: "100vh",
          backgroundImage: `url('https://luyenthivstep.vn/assets/image/banner/luyen-thi-vstep-banner-index-1-fef4ea.png'),
                    url('https://luyenthivstep.vn/assets/image/banner/luyen-thi-vstep-banner-index-2-fef4ea.png')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "40%, 40%",
          backgroundPosition: "top left, bottom right",
        }}
      >
        <BasicBox sx={{ maxWidth: 1200, margin: "0 auto", height: "100%" }}>
          {children}
        </BasicBox>
      </BasicBox>
      <Footer />
    </BasicBox>
  );
};

export default HomeLayout;
