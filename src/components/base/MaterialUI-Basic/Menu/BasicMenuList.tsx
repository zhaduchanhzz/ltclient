import MenuList, { MenuListProps } from "@mui/material/MenuList";

type BasicMenuListProps = MenuListProps & {};

const BasicMenuList = (props: BasicMenuListProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <MenuList id={id} data-cy={id} {...otherProps}>
      {children}
    </MenuList>
  );
};

export default BasicMenuList;
