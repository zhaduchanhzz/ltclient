import TableRow, { TableRowProps } from "@mui/material/TableRow";

type BasicTableRowProps = TableRowProps & {};

const BasicTableRow = (props: BasicTableRowProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <TableRow id={id} data-cy={id} {...otherProps}>
      {children}
    </TableRow>
  );
};

export default BasicTableRow;
