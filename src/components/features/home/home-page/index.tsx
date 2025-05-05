"use client";

import BasicBox from "@/components/base/MaterialUI-Basic/Box";

import Hero from "./components/Hero";

const Home = () => {
  return (
    <BasicBox
      sx={{
        width: "100%  ",
        display: "flex",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Hero />
    </BasicBox>
  );
};

export default Home;
