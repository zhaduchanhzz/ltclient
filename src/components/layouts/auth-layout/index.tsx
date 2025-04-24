"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicPaper from "@/components/base/MaterialUI-Basic/Paper";
import { ReactNode } from "react";

type AuthLayoutProps = { children: ReactNode };

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <BasicBox
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BasicPaper elevation={8} sx={{ p: 4, borderRadius: 4 }}>
        {children}
      </BasicPaper>
    </BasicBox>
  );
};

export default AuthLayout;
