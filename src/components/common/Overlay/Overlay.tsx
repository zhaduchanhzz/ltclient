import Box from "@mui/material/Box";
import { alpha, styled } from "@mui/material/styles";
import { ReactNode } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import "react-virtualized/styles.css";

/**
 * Defines the properties that the Overlay component can accept.
 *
 * Properties:
 * - `above` (optional boolean): Determines if the overlay should be positioned above other elements.
 * - `backdrop` (optional boolean): Indicates whether a backdrop effect should be applied to the overlay.
 * - `children` (optional ReactNode): Represents the content to be rendered inside the overlay.
 */
type Props = {
  above?: boolean;
  backdrop?: boolean;
  children?: ReactNode;
};

const Overlay = (props: Props) => {
  const { children, above = false, backdrop = false } = props;

  return (
    <Wrapper above={above}>
      {/* AutoSizer automatically adjusts the size based on the available space */}
      {({ width, height }) => {
        return (
          <Box
            sx={{
              display: "grid",
              placeContent: "center",
              width: width ? width : undefined,
              height: height ? height : undefined,
              ...(backdrop && {
                bgcolor: alpha("rgba(255, 255, 255)", 1),
              }),
            }}
          >
            {children}
          </Box>
        );
      }}
    </Wrapper>
  );
};

// Determine which props should not be forwarded to AutoSizer
const Wrapper = styled(AutoSizer, {
  shouldForwardProp: (prop: string) => !["above"].includes(prop),
})<Pick<Props, "above">>(({ theme, above }) => ({
  position: "sticky",
  inset: 0, // Sets all four inset properties (top, right, bottom, left) to 0
  ...(above && {
    // If above is true, set a higher zIndex to ensure the overlay appears above other components
    zIndex: theme.zIndex.appBar + 3,
  }),
}));

export default Overlay;
