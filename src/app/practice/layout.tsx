"use client";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import PracticeLayout from "@/components/layouts/practice-layout";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <PracticeLayout>
      {children}
      <ScrollToTopButton />
    </PracticeLayout>
  );
};

export default Layout;
