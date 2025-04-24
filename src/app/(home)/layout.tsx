"use client";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import HomeLayout from "@/components/layouts/home-layout";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <HomeLayout>
      {children}
      <ScrollToTopButton />
    </HomeLayout>
  );
};

export default Layout;
