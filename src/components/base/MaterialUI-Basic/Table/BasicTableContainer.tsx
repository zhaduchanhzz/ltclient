import TableContainer, {
  TableContainerProps,
} from "@mui/material/TableContainer";

type BasicTableContainerProps = TableContainerProps & {};

const BasicTableContainer = (props: BasicTableContainerProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <TableContainer id={id} data-cy={id} {...otherProps}>
      {children}
    </TableContainer>
  );
};

export default BasicTableContainer;
