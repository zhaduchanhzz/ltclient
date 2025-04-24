"use client";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import UserLayout from "@/components/layouts/user-layout";
import NavigateTab from "@/components/layouts/user-layout/components/NavigateTab";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <UserLayout>
      <NavigateTab />
      {children}
      <ScrollToTopButton />
    </UserLayout>
  );
};

export default Layout;
