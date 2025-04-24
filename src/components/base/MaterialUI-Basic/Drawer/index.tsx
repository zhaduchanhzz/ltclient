import Drawer, { DrawerProps } from "@mui/material/Drawer";

type BasicDrawerProps = DrawerProps & {};

const BasicDrawer = (props: BasicDrawerProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Drawer id={id} data-cy={id} {...otherProps}>
      {children}
    </Drawer>
  );
};

export default BasicDrawer;
