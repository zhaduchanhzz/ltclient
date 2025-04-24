import { PaletteOptions } from "@mui/material/styles";
import { customStyle } from "../extend-style";

export const darkPalette: PaletteOptions = {
  customStyle: customStyle,
  mode: "dark", // This enables dark mode
  primary: {
    main: "#cda274",
    contrastText: "#fff", // Text color for primary buttons
  },
  secondary: {
    main: "#292f36", // Main color for primary
    contrastText: "#fff", // Text color for primary buttons
  },
  background: {
    default: "#f9fbfd",
    paper: "#ffffff",
  },
  error: {
    main: "#f44336", // Main color for error
    light: "#e57373", // Light shade for error
    dark: "#d32f2f", // Dark shade for error
    contrastText: "#fff", // Text color for error
  },
  warning: {
    main: "#ff9800", // Main color for warning
    light: "#ffb74d", // Light shade for warning
    dark: "#f57c00", // Dark shade for warning
    contrastText: "#fff", // Text color for warning
  },
  info: {
    main: "#2196f3", // Main color for info
    light: "#64b5f6", // Light shade for info
    dark: "#1976d2", // Dark shade for info
    contrastText: "#fff", // Text color for info
  },
  success: {
    main: "#4caf50", // Main color for success
    light: "#81c784", // Light shade for success
    dark: "#388e3c", // Dark shade for success
    contrastText: "#fff", // Text color for success
  },
  text: {
    primary: "#292f36", // Primary text color
    secondary: "#757575", // Secondary text color
    disabled: "#bdbdbd", // Disabled text color
  },
  action: {
    active: "#000", // Active action color
    hover: "#f1f1f1", // Hover action color
    selected: "#e0e0e0", // Selected action color
    disabled: "#bdbdbd", // Disabled action color
    disabledBackground: "#f5f5f5", // Disabled background color for actions
  },
  divider: "#e0e0e0", // Divider color
  common: {
    black: "#292f36", // Black color
    white: "#ffffff", // White color
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  // Other color customizations...
};
