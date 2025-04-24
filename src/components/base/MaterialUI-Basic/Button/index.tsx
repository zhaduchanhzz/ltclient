import Button, { ButtonProps } from "@mui/material/Button";

type BasicButtonProps = ButtonProps & {};

const BasicButton = (props: BasicButtonProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <Button id={id} data-cy={id} {...otherProps}>
      {children}
    </Button>
  );
};

export default BasicButton;
