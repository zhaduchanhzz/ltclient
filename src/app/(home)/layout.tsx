"use client";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import HomeLayout from "@/components/layouts/home-layout";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <HomeLayout>
      {children}
      <ScrollToTopButton />
    </HomeLayout>
  );
}
