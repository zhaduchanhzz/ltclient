import List, { ListProps } from "@mui/material/List";

type BasicListProps = ListProps & {};

const BasicList = (props: BasicListProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <List id={id} data-cy={id} {...otherProps}>
      {children}
    </List>
  );
};

export default BasicList;
