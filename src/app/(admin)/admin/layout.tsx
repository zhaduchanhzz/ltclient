"use client";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AdminSidebar from "@/components/features/admin/Sidebar";
import AdminHeader from "@/components/features/admin/Header";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { isAdminUser } from "@/utils/jwt";
import CookieStorage from "@/utils/cookie-storage";
import { APP_COOKIE_KEY } from "@/consts";
import NotFound from "@/app/not-found";

const drawerWidth = 240;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { isAuthenticated, isInitialized } = useAuthContext();
  const router = useRouter();
  const theme = createTheme();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      const accessToken = CookieStorage.get(APP_COOKIE_KEY.ACCESS_TOKEN);
      
      if (accessToken) {
        const hasAdminRole = isAdminUser(accessToken);
        setIsAdmin(hasAdminRole);
      } else {
        setIsAdmin(false);
      }
    }
  }, [isAuthenticated, isInitialized, router]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  if (!isInitialized || isAdmin === null) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isAdmin === false) {
    return <NotFound />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AdminHeader
          open={open}
          drawerWidth={drawerWidth}
          onDrawerToggle={toggleDrawer}
        />
        <AdminSidebar open={open} drawerWidth={drawerWidth} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            // ml: { sm: `${drawerWidth}px` },
            mt: 8,
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
