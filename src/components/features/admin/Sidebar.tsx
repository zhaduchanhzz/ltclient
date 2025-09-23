import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import ArticleIcon from "@mui/icons-material/Article";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { AppConfig } from "@/config/app-config";

interface AdminSidebarProps {
  open: boolean;
  drawerWidth: number;
}

const menuItems = [
  { text: "Tổng quan", icon: <DashboardIcon />, path: "/admin" },
  { text: "Quản lý người dùng", icon: <PeopleIcon />, path: "/admin/users" },
  { text: "Quản lý đơn hàng", icon: <ShoppingCartIcon />, path: "/admin/orders" },
  { text: "Quản lý bài thi", icon: <SchoolIcon />, path: "/admin/exams" },
  { text: "Quản lý Blog", icon: <ArticleIcon />, path: "/admin/posts" },
  { text: "Chấm thi", icon: <ArticleIcon />, path: "/admin/exams/marking" },
];

export default function AdminSidebar({ open, drawerWidth }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        ["& .MuiDrawer-paper"]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        },
      }}
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
        onClick={() => router.push("/")}
      >
        {AppConfig.logoUrl && (
          <Image
            src={AppConfig.logoUrl}
            alt="Logo"
            width={120}
            height={40}
            style={{ objectFit: "contain" }}
          />
        )}
      </Box>

      {/* Menu */}
      <List sx={{ mt: 0 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                  "& .MuiListItemText-primary": {
                    fontWeight: "bold",
                  },
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

      </List>
    </Drawer>
  );
}
