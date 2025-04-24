import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import { useTheme } from "@mui/material";
import { ReactNode } from "react";
import Header from "../components/Header";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { usePathname } from "next/navigation";
import { practicePageName } from "../utils/data";

type PracticeLayoutProps = {
  children: ReactNode;
};

const PracticeLayout = ({ children }: PracticeLayoutProps) => {
  const theme = useTheme();
  const pathname = usePathname();

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
          <BasicTypography variant="h6">Bạn đang truy cập</BasicTypography>
          <BasicTypography variant="h5">
            {
              practicePageName.find((item) => pathname.includes(item.href))
                ?.name
            }
          </BasicTypography>
          <BasicDivider variant="fullWidth" sx={{ mt: 2, mb: 4 }} />
          {children}
        </BasicBox>
      </BasicBox>
    </BasicBox>
  );
};

export default PracticeLayout;
