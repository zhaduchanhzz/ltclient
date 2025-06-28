"use client";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AdminSidebar from "@/components/features/admin/Sidebar";
import AdminHeader from "@/components/features/admin/Header";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const { isAuthenticated, isInitialized } = useAuthContext();
  const router = useRouter();
  const theme = createTheme();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
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
