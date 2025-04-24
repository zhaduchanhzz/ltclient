"use client";

import {
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { ReactNode } from "react";

/**
 * Defines the properties for the TypographyUnderline component.
 *
 * Properties:
 * - `children`: The content to be displayed within the typography component.
 * - `borderBottomColor`: An optional string specifying the color of the bottom border (underline).
 * - `boxProps`: Additional properties to be passed to the MUI Box component.
 */
type TypographyUnderlineProps = TypographyProps & {
  children: ReactNode;
  borderBottomColor?: string;
  boxProps?: BoxProps;
};

const TypographyUnderline = (props: TypographyUnderlineProps) => {
  const { children, boxProps, borderBottomColor, ...typoProps } = props;
  const theme = useTheme();
  return (
    <Box
      {...boxProps}
      sx={{
        overflow: "hidden",
        cursor: "pointer",
        "&:hover .divider": {
          transform: "translate3d(0px, 0px, 0px)",
          borderBottomColor: borderBottomColor || theme.palette.primary.main,
        },
      }}
    >
      <Typography
        {...typoProps}
        sx={{
          color: theme.palette.text.primary,
          "&:hover": {
            color: theme.palette.primary.main,
            transition: ".2s ease",
          },
          ...typoProps.sx,
        }}
      >
        {children}
      </Typography>
      <Box
        className="divider"
        sx={{
          borderBottom: "2px solid" + theme.palette.text.primary,
          transform: "translate3d(-100%, 0px, 0px)",
          transformStyle: "preserve-3d",
          transition: "transform .5s ease",
        }}
      ></Box>
    </Box>
  );
};

export default TypographyUnderline;
