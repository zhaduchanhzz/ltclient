import Pagination, { PaginationProps } from "@mui/material/Pagination";

type BasicPaginationProps = PaginationProps & {};

const BasicPagination = (props: BasicPaginationProps) => {
  const { id, ...otherProps } = props;
  return <Pagination id={id} data-cy={id} {...otherProps} />;
};

export default BasicPagination;
