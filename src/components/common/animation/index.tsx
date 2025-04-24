"use client";

import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import { BoxProps } from "@mui/material";
import { MotionProps, motion } from "motion/react";
import { ReactNode } from "react";

/**
 * Defines the properties for the AnimationBox component by extending MotionProps.
 *
 * Properties:
 * - `boxProps` : Additional properties to be passed to the MUI Box component.
 * - `overflow` : Specifies the CSS overflow property
 * - `children`
 */
type AnimationBoxProps = MotionProps & {
  boxProps?: BoxProps;
  overflow?: "visible" | "hidden" | "scroll" | "auto" | "inherit";
  children?: ReactNode;
};

const AnimationBox = (props: AnimationBoxProps) => {
  const { children, boxProps, overflow = "inherit", ...motionProps } = props;
  return (
    <BasicBox {...boxProps} sx={{ overflow: overflow, ...props?.boxProps?.sx }}>
      <motion.div {...motionProps}>{children}</motion.div>
    </BasicBox>
  );
};

export default AnimationBox;
