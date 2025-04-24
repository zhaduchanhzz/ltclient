import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useTheme } from "@mui/material";
import { ReactNode } from "react";
import Header from "../components/Header";

type UserLayoutProps = {
  children: ReactNode;
};

const UserLayout = ({ children }: UserLayoutProps) => {
  const theme = useTheme();
  return (
    <BasicBox>
      <Header />
      <BasicBox
        sx={{
          pt: 12,
          minHeight: "calc(100vh - 68px)",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <BasicBox sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
          <BasicBox sx={{ mb: 3 }}>
            <BasicTypography variant="h6">Bạn đang truy cập</BasicTypography>
            <BasicTypography variant="h5">Tài khoản của tôi</BasicTypography>
          </BasicBox>
          {children}
        </BasicBox>
      </BasicBox>
    </BasicBox>
  );
};

export default UserLayout;
