import { PaletteOptions } from "@mui/material/styles";
import { customStyle } from "../extend-style";

export const darkPalette: PaletteOptions = {
  customStyle: customStyle,
  mode: "dark", // This enables dark mode
  primary: {
    main: "#cda274",
    light: "#d4b185",
    dark: "#a0764e",
    contrastText: "#fff",
  },
  secondary: {
    main: "#4a5568",
    light: "#718096",
    dark: "#2d3748",
    contrastText: "#fff",
  },
  background: {
    default: "#121212", // Dark background
    paper: "#1e1e1e", // Slightly lighter for cards/papers
  },
  error: {
    main: "#ef5350",
    light: "#e57373",
    dark: "#c62828",
    contrastText: "#fff",
  },
  warning: {
    main: "#ff9800",
    light: "#ffb74d",
    dark: "#f57c00",
    contrastText: "#fff",
  },
  info: {
    main: "#29b6f6",
    light: "#4fc3f7",
    dark: "#0288d1",
    contrastText: "#fff",
  },
  success: {
    main: "#66bb6a",
    light: "#81c784",
    dark: "#388e3c",
    contrastText: "#fff",
  },
  text: {
    primary: "#ffffff", // White text for dark mode
    secondary: "rgba(255, 255, 255, 0.7)", // Slightly transparent white
    disabled: "rgba(255, 255, 255, 0.5)", // More transparent for disabled
  },
  action: {
    active: "#fff",
    hover: "rgba(255, 255, 255, 0.08)",
    selected: "rgba(255, 255, 255, 0.16)",
    disabled: "rgba(255, 255, 255, 0.3)",
    disabledBackground: "rgba(255, 255, 255, 0.12)",
  },
  divider: "rgba(255, 255, 255, 0.12)", // Subtle divider for dark mode
  common: {
    black: "#000000",
    white: "#ffffff",
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
};
