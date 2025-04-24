"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicDrawer from "@/components/base/MaterialUI-Basic/Drawer";
import BasicIconButton from "@/components/base/MaterialUI-Basic/IconButton";
import BasicList from "@/components/base/MaterialUI-Basic/List";
import BasicListItem from "@/components/base/MaterialUI-Basic/List/BasicListItem";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { navItems } from "../../utils/data";

type NavBarMenuProps = {};

const NavBarMenu = (_: NavBarMenuProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter(); // Khai báo useRouter

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  // Xử lý click item (chuyển hướng + đóng menu trên mobile)
  const handleNavigate = (path: string) => {
    router.push(path);
    setMobileOpen(false); // Đóng Drawer trên mobile
  };

  const drawerContent = (
    <BasicBox sx={{ width: 250, p: 2 }}>
      <BasicTypography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Hướng dẫn thi thử
      </BasicTypography>
      <BasicList>
        {navItems.map((item, index) => (
          <BasicListItem
            key={index}
            onClick={() => handleNavigate(item.path)}
            sx={{ py: 1, pl: 0 }}
          >
            <BasicTypography variant="body1">{item.label}</BasicTypography>
          </BasicListItem>
        ))}
      </BasicList>
    </BasicBox>
  );

  return (
    <BasicBox sx={{ display: "flex" }}>
      {/* Nút mở menu trên mobile */}
      <BasicIconButton
        sx={{
          display: { xs: "block", md: "none" },
          position: "absolute",
          top: 10,
          left: 10,
        }}
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </BasicIconButton>

      {/* Sidebar trên desktop */}
      <BasicBox
        sx={{
          width: 250,
          minHeight: "100vh",
          borderRight: "1px solid #ddd",
          p: 2,
          height: "calc(100vh - 200px)",
          display: { xs: "none", md: "block" },
        }}
      >
        {drawerContent}
      </BasicBox>

      {/* Drawer trên mobile */}
      <BasicDrawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
        {drawerContent}
      </BasicDrawer>
    </BasicBox>
  );
};

export default NavBarMenu;
