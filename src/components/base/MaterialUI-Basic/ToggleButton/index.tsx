import ToggleButton, { ToggleButtonProps } from "@mui/material/ToggleButton";

type BasicToggleButtonProps = ToggleButtonProps & {};

const BasicToggleButton = (props: BasicToggleButtonProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <ToggleButton id={id} data-cy={id} {...otherProps}>
      {children}
    </ToggleButton>
  );
};

export default BasicToggleButton;
