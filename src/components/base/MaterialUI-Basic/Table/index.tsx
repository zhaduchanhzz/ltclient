import Table, { TableProps } from "@mui/material/Table";

type BasicTableProps = TableProps & {};

const BasicTable = (props: BasicTableProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Table id={id} data-cy={id} {...otherProps}>
      {children}
    </Table>
  );
};

export default BasicTable;
