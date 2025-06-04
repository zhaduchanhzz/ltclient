"use client";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AdminSidebar from "@/components/features/admin/Sidebar";
import AdminHeader from "@/components/features/admin/Header";
import { useState } from "react";

const drawerWidth = 240;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const theme = createTheme();

  const toggleDrawer = () => {
    setOpen(!open);
  };

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
