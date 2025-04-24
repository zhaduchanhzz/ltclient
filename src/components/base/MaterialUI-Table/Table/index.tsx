import { tableCellClasses } from "@mui/material";
import { TableProps } from "@mui/material/Table";
import BasicTable from "../../MaterialUI-Basic/Table";

type TableCustomProps = TableProps & {};

const TableCustom = (props: TableCustomProps) => {
  const { children, ...rest } = props;
  return (
    <BasicTable
      stickyHeader
      sx={{
        [`& .${tableCellClasses.root}`]: {
          px: 1,
        },
        [`& th.${tableCellClasses.root}`]: {
          p: 0.75,
        },
      }}
      {...rest}
    >
      {children}
    </BasicTable>
  );
};

export default TableCustom;
