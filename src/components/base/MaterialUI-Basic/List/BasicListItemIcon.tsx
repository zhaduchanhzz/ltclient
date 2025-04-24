import ListItemIcon, { ListItemIconProps } from "@mui/material/ListItemIcon";

type BasicListItemIconProps = ListItemIconProps & {};

const BasicListItemIcon = (props: BasicListItemIconProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <ListItemIcon id={id} data-cy={id} {...otherProps}>
      {children}
    </ListItemIcon>
  );
};

export default BasicListItemIcon;
