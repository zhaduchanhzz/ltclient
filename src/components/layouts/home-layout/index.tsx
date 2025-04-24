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
          pt: 12,
          minHeight: "calc(100vh - 100px - 200px)",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <BasicBox sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
          {children}
        </BasicBox>
      </BasicBox>
      <Footer />
    </BasicBox>
  );
};

export default HomeLayout;
