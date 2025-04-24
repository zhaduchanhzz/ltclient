import { TableContainerProps } from "@mui/material/TableContainer";
import BasicTableContainer from "../../MaterialUI-Basic/Table/BasicTableContainer";

type TableContainerCustomProps = TableContainerProps & {};

const TableContainerCustom = (props: TableContainerCustomProps) => {
  const { children } = props;
  return <BasicTableContainer {...props}>{children}</BasicTableContainer>;
};

export default TableContainerCustom;
