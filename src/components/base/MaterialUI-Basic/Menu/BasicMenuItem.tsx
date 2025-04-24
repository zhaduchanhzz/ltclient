import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";

type BasicMenuItemProps = MenuItemProps & {};

const BasicMenuItem = (props: BasicMenuItemProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <MenuItem id={id} data-cy={id} {...otherProps}>
      {children}
    </MenuItem>
  );
};

export default BasicMenuItem;
