"use client";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import GuideLayout from "@/components/layouts/guide-layout";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <GuideLayout>
      {children}
      <ScrollToTopButton />
    </GuideLayout>
  );
};

export default Layout;
