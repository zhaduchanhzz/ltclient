import ListItem, { ListItemProps } from "@mui/material/ListItem";

type BasicListItemProps = ListItemProps & {};

const BasicListItem = (props: BasicListItemProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <ListItem id={id} data-cy={id} {...otherProps}>
      {children}
    </ListItem>
  );
};

export default BasicListItem;
