import TableCell, { TableCellProps } from "@mui/material/TableCell";

type BasicTableCellProps = TableCellProps & {};

const BasicTableCell = (props: BasicTableCellProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <TableCell id={id} data-cy={id} {...otherProps}>
      {children}
    </TableCell>
  );
};

export default BasicTableCell;
