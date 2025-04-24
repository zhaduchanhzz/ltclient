import { Mode } from "@/contexts/ThemeContext";
import { createTheme, responsiveFontSizes, Theme } from "@mui/material";
import { merge } from "lodash";
import { components } from "./component";
import { CustomStyle } from "./extend-style";
import { darkPalette } from "./palette/dark";
import { lightPalette } from "./palette/light";
import { typography } from "./typography";
import { breakpoints } from "./break-point";
declare module "@mui/material/styles" {
  interface Palette {
    customStyle: CustomStyle;
  }

  interface PaletteOptions {
    customStyle: CustomStyle;
  }
}

export const createAppTheme = (mode: Mode): Theme => {
  const palette = mode === "light" ? lightPalette : darkPalette;
  const theme = createTheme(
    merge({}, { components, typography, palette, breakpoints }, mode),
  );
  return responsiveFontSizes(theme);
};
