import RadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";

type BasicRadioGroupProps = RadioGroupProps & {};

const BasicRadioGroup = (props: BasicRadioGroupProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <RadioGroup id={id} data-cy={id} {...otherProps}>
      {children}
    </RadioGroup>
  );
};

export default BasicRadioGroup;
