"use client";

import LecturerLayout from "@/components/layouts/lecturer-layout";
import { ReactNode } from "react";

type LecturerLayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LecturerLayoutProps) => {
  return <LecturerLayout>{children}</LecturerLayout>;
};

export default Layout;