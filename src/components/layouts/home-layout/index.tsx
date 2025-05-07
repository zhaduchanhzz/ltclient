import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import { ReactNode } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <BasicBox>
      <Header />
      <BasicBox
        sx={{
          pt: 8.5,
          height: "100%",
        }}
      >
        <BasicBox sx={{ height: "100%", mx: "auto" }}>{children}</BasicBox>
      </BasicBox>
      <Footer />
    </BasicBox>
  );
};

export default HomeLayout;
