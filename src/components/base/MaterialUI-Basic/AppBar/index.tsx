import AppBar, { AppBarProps } from "@mui/material/AppBar";

type BasicAppBarProps = AppBarProps & {};

const BasicAppBar = (props: BasicAppBarProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <AppBar id={id} data-cy={id} {...otherProps}>
      {children}
    </AppBar>
  );
};

export default BasicAppBar;
