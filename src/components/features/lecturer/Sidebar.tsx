"use client";

import BasicDrawer from "@/components/base/MaterialUI-Basic/Drawer";
import BasicList from "@/components/base/MaterialUI-Basic/List";
import BasicListItem from "@/components/base/MaterialUI-Basic/List/BasicListItem";
import BasicListItemButton from "@/components/base/MaterialUI-Basic/List/BasicListItemButton";
import BasicListItemIcon from "@/components/base/MaterialUI-Basic/List/BasicListItemIcon";
import BasicListItemText from "@/components/base/MaterialUI-Basic/List/BasicListItemText";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import {
  Dashboard as DashboardIcon,
  Grading as GradingIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

export const DRAWER_WIDTH = 250;

type LecturerSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const menuItems = [
  {
    title: "Dashboard",
    path: "/lecturer",
    icon: <DashboardIcon />,
  },
  {
    title: "Grading",
    path: "/lecturer/grading",
    icon: <GradingIcon />,
  },
];

const LecturerSidebar = ({ open, onClose }: LecturerSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const drawerContent = (
    <BasicBox sx={{ width: DRAWER_WIDTH }}>
      <BasicBox sx={{ p: 2 }}>
        <BasicTypography variant="h6" sx={{ fontWeight: "bold" }}>
          Lecturer Panel
        </BasicTypography>
      </BasicBox>
      <BasicDivider />
      <BasicList>
        {menuItems.map((item) => (
          <BasicListItem key={item.path} disablePadding>
            <BasicListItemButton
              selected={pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <BasicListItemIcon>{item.icon}</BasicListItemIcon>
              <BasicListItemText primary={item.title} />
            </BasicListItemButton>
          </BasicListItem>
        ))}
      </BasicList>
    </BasicBox>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <BasicDrawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawerContent}
      </BasicDrawer>
      
      {/* Desktop Drawer */}
      <BasicDrawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
        open
      >
        {drawerContent}
      </BasicDrawer>
    </>
  );
};

export default LecturerSidebar;