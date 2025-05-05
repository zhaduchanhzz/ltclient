"use client";

import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import { Container } from "@mui/material";
import Hero from "./components/Hero";
import OurServices from "./components/OurServices";
import SolvedProduct from "./components/SolvedProduct";
import WhoNeedUs from "./components/WhoNeedUs";
import FeedBack from "./components/FeedBack";

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
            xl: `url('/images/left-side-hero-banner.png'), url('/images/right-side-hero-banner.png')`,
          },
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "35%, 35%", // adjust as needed
          backgroundPosition: "center left, bottom right", // adjust as needed
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

        <WhoNeedUs />

        <FeedBack />
      </Container>
    </BasicBox>
  );
};

export default Home;
