import ButtonGroup, { ButtonGroupProps } from "@mui/material/ButtonGroup";

type BasicButtonGroupProps = ButtonGroupProps & {};

const BasicButtonGroup = (props: BasicButtonGroupProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <ButtonGroup id={id} data-cy={id} {...otherProps}>
      {children}
    </ButtonGroup>
  );
};

export default BasicButtonGroup;
