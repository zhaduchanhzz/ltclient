import TableHead, { TableHeadProps } from "@mui/material/TableHead";

type BasicTableHeadProps = TableHeadProps & {};

const BasicTableHead = (props: BasicTableHeadProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <TableHead id={id} data-cy={id} {...otherProps}>
      {children}
    </TableHead>
  );
};

export default BasicTableHead;
