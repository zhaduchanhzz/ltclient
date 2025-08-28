import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import { useTheme } from "@mui/material";
import { ReactNode } from "react";
import Header from "../components/Header";

type PracticeLayoutProps = {
  children: ReactNode;
};

const PracticeLayout = ({ children }: PracticeLayoutProps) => {
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
          <BasicDivider variant="fullWidth" sx={{ mt: 2, mb: 4 }} />
          {children}
        </BasicBox>
      </BasicBox>
    </BasicBox>
  );
};

export default PracticeLayout;
