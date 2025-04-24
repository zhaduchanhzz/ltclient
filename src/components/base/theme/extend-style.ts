import { blue, grey } from "@mui/material/colors";

export interface CustomStyle {
  bgAppLayout: string;
  bgColor: {
    primary?: string;
    secondary?: string;
    disabled?: string;
  };
  table: { primary?: string; secondary?: string; disabled?: string };
  borderColor: { primary?: string; secondary?: string; disabled?: string };
  text: {
    primary?: string;
    secondary?: string;
    disabled?: string;
    contrastText: string;
  };
  icon: {
    primary?: string;
    secondary?: string;
    disabled?: string;
  };
  link: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  bsBadgeColors: {
    primary: string;
    secondary: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
    light: string;
    dark: string;
  };
}

export const customStyle: CustomStyle = {
  bgAppLayout: "#f9fbfd",
  bgColor: {
    primary: blue[700],
    secondary: blue[500],
    disabled: blue[300],
  },
  table: {
    primary: blue[300],
    secondary: blue[500],
    disabled: blue[300],
  },
  borderColor: {
    primary: "#ccc",
    secondary: "#edf2f9",
    disabled: grey[300],
  },
  text: {
    primary: "#292f36", // Primary text color
    secondary: "#757575", // Secondary text color
    disabled: "#bdbdbd", // Disabled text color
    contrastText: "#fff",
  },
  icon: { primary: blue[300], secondary: blue[300], disabled: blue[300] },
  link: {
    primary: "#2196f3",
    secondary: "#64b5f6",
    disabled: "#bdbdbd",
  },
  bsBadgeColors: {
    primary: "#0d6efd",
    secondary: "#6c757d",
    success: "#198754",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#0dcaf0",
    light: "#f8f9fa",
    dark: "#212529",
  },
};
