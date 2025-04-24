import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import { ReactNode } from "react";
import Header from "../components/Header";
import { useTheme } from "@mui/material";
import NavBarMenu from "./components/NavbarMenu";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";

type GuideLayoutProps = {
  children: ReactNode;
};

const GuideLayout = ({ children }: GuideLayoutProps) => {
  const theme = useTheme();
  return (
    <BasicBox>
      <Header />
      <BasicBox
        sx={{
          pt: 8,
          minHeight: "calc(100vh - 68px)",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <BasicStack direction="row">
          <NavBarMenu />
          {children}
        </BasicStack>
      </BasicBox>
    </BasicBox>
  );
};

export default GuideLayout;
