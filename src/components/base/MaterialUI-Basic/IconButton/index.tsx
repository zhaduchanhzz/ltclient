import IconButton, { IconButtonProps } from "@mui/material/IconButton";

type BasicIconButtonProps = IconButtonProps & {};

const BasicIconButton = (props: BasicIconButtonProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <IconButton id={id} data-cy={id} {...otherProps}>
      {children}
    </IconButton>
  );
};

export default BasicIconButton;
