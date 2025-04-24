import TableBody, { TableBodyProps } from "@mui/material/TableBody";

type BasicTableBodyProps = TableBodyProps & {};

const BasicTableBody = (props: BasicTableBodyProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <TableBody id={id} data-cy={id} {...otherProps}>
      {children}
    </TableBody>
  );
};

export default BasicTableBody;
