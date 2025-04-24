"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import { ReactNode } from "react";
import ExamLayoutFooter from "./components/ExamLayoutFooter";
import ExamLayoutHeader from "./components/ExamLayoutHeader";
import { ExamContextProvider } from "@/contexts/ExamContext";

type ExamLayoutProps = {
  children: ReactNode;
};

const ExamLayout = ({ children }: ExamLayoutProps) => {
  return (
    <ExamContextProvider>
      <BasicStack direction="column">
        <ExamLayoutHeader />
        <BasicBox sx={{ p: 2 }}>{children}</BasicBox>
        <ExamLayoutFooter />
      </BasicStack>
    </ExamContextProvider>
  );
};

export default ExamLayout;
