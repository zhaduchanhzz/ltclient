import { BreakpointsOptions } from "@mui/material/styles";

// Mở rộng type để thêm `xxl` vào danh sách breakpoint hợp lệ
declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxl: true;
    lg_1200: true;
    sm_600: true;
  }
}

export const breakpoints: BreakpointsOptions = {
  values: {
    xs: 0,
    sm: 480, // Mobile nhỏ
    sm_600: 600,
    md: 768, // Tablet
    lg: 1024, // Desktop
    lg_1200: 1200,
    xl: 1440, // Màn hình lớn
    xxl: 1920, // Màn hình rất lớn
  },
};
