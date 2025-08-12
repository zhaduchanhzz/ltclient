"use client";

import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import { ReactNode, useState } from "react";
import LecturerHeader from "@/components/features/lecturer/Header";
import LecturerSidebar, { DRAWER_WIDTH } from "@/components/features/lecturer/Sidebar";

type LecturerLayoutProps = {
  children: ReactNode;
};

const LecturerLayout = ({ children }: LecturerLayoutProps) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <BasicBox sx={{ display: "flex", minHeight: "100vh" }}>
      <LecturerSidebar open={openDrawer} onClose={() => setOpenDrawer(false)} />
      <BasicStack 
        sx={{ 
          flex: 1,
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` }, // Add left margin on desktop to account for drawer
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` } // Adjust width on desktop
        }}
      >
        <LecturerHeader onMenuClick={() => setOpenDrawer(true)} />
        <BasicBox component="main" sx={{ flex: 1, p: 3, bgcolor: "grey.50" }}>
          {children}
        </BasicBox>
      </BasicStack>
    </BasicBox>
  );
};

export default LecturerLayout;