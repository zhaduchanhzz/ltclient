import Toolbar, { ToolbarProps } from "@mui/material/Toolbar";

type BasicToolbarProps = ToolbarProps & {};

const BasicToolbar = (props: BasicToolbarProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Toolbar id={id} data-cy={id} {...otherProps}>
      {children}
    </Toolbar>
  );
};

export default BasicToolbar;
