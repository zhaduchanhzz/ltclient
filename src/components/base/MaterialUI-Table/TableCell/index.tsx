import { useTheme } from "@mui/material";
import { BoxProps } from "@mui/material/Box";
import { TableCellProps } from "@mui/material/TableCell";
import BasicStack from "../../MaterialUI-Basic/Stack";
import BasicTableCell from "../../MaterialUI-Basic/Table/BasicTableCell";

/**
 * Defines the properties for the TableCellCustom component.
 *
 * Properties:
 * - `children`: The content to be displayed within the table cell.
 * - `align`: Specifies the alignment of the cell content. Options include "center", "left", or "right".
 * - `stickyPosition`: Determines if the cell should have a sticky position. Accepts "left", "right", or null.
 * - `sticky`: Indicates whether the cell is sticky. Defaults to false if not specified.
 * - `minWidth`: Sets the minimum width of the cell. Accepts a number or null.
 * - `minHeight`: Sets the minimum height of the cell. Accepts a number or null.
 * - `BoxProps`: Additional properties to be passed to the MUI Box component.
 * - `border`: Determines if the cell should have a border. Defaults to false if not specified.
 * - `hover`: Indicates whether the cell should have a hover effect. Defaults to false if not specified.
 * - `backgroundEmphasize`: Specifies if the cell's background should be emphasized. Defaults to false if not specified.
 */
type TableCellCustomProps = TableCellProps & {
  children: React.ReactNode;
  align?: "center" | "left" | "right";
  alignItems?: "center" | "flex-end" | "flex-start";
  justifyContent?: "center" | "flex-end" | "flex-start";
  stickyPosition?: "left" | "right" | null;
  sticky?: boolean | null;
  minWidth?: number | null;
  minHeight?: number | null;
  boxProps?: BoxProps;
  border?: boolean | null;
  hover?: boolean | null;
  backgroundEmphasize?: boolean | null;
};

const TableCellCustom = (props: TableCellCustomProps) => {
  const {
    children,
    align,
    alignItems = "center",
    justifyContent = "center",
    stickyPosition,
    sticky,
    minHeight,
    minWidth,
    border,
    hover = false,
    backgroundEmphasize = false,
    ...rest
  } = props;
  const theme = useTheme();

  return (
    <BasicTableCell
      align={align}
      {...rest}
      sx={{
        backgroundColor: backgroundEmphasize
          ? theme.palette.customStyle.table.primary
          : theme.palette.background.paper,
        color: backgroundEmphasize
          ? theme.palette.text.secondary
          : theme.palette.text.primary,
        borderBottom: border ? "1px solid" : "0px solid",
        borderColor: theme.palette.customStyle.borderColor.primary,
        left: stickyPosition === "left" ? 0 : "unset",
        right: stickyPosition === "right" ? 0 : "unset",
        position: sticky ? "sticky" : "relative",
        zIndex: sticky ? theme.zIndex.appBar : theme.zIndex.appBar - 10,
        "&:hover": hover
          ? {
              backgroundColor: theme.palette.customStyle.table.secondary,
              cursor: "pointer",
            }
          : {},

        ...rest.sx,
      }}
    >
      <BasicStack
        sx={{
          minWidth: minWidth,
          minHeight: minHeight,
          alignItems: alignItems,
          justifyContent: justifyContent,
        }}
      >
        {children}
      </BasicStack>
    </BasicTableCell>
  );
};

export default TableCellCustom;
