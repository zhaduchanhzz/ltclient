"use client";
import PracticeSkillLayout from "@/components/layouts/practice-layout/PracticeSkillLayout";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <PracticeSkillLayout>{children}</PracticeSkillLayout>;
};

export default Layout;
