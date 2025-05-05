"use client";

import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import { Container } from "@mui/material";
import Hero from "./components/Hero";
import OurServices from "./components/OurServices";
import SolvedProduct from "./components/SolvedProduct";

const Home = () => {
  return (
    <BasicBox
      sx={{
        width: { xs: "100%", md: "100vw" },
        height: "100%",
        backgroundColor: "#12263f",
      }}
    >
      <BasicBox
        sx={{
          width: "100%",
          height: "93vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: {
            md: "none",
            xl: `url('https://luyenthivstep.vn/assets/image/banner/luyen-thi-vstep-banner-index-1-fef4ea.png'),
          url('https://luyenthivstep.vn/assets/image/banner/luyen-thi-vstep-banner-index-2-fef4ea.png')`,
          },
          backgroundRepeat: "no-repeat",
          backgroundSize: "40%, 40%",
          backgroundPosition: "top left, bottom right",
        }}
      >
        <Hero />
      </BasicBox>
      <Container
        sx={{
          maxWidth: 1200,
          height: "100%",
        }}
      >
        <OurServices />

        <SolvedProduct />
      </Container>
    </BasicBox>
  );
};

export default Home;
