import Menu, { MenuProps } from "@mui/material/Menu";

type BasicMenuProps = MenuProps & {};

const BasicMenu = (props: BasicMenuProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Menu id={id} data-cy={id} {...otherProps}>
      {children}
    </Menu>
  );
};

export default BasicMenu;
