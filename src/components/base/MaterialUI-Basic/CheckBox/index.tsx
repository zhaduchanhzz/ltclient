import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";

type BasicCheckboxProps = CheckboxProps;

const BasicCheckbox = (props: BasicCheckboxProps) => {
  const { id, ...otherProps } = props;
  return <Checkbox id={id} data-cy={id} {...otherProps} />;
};

export default BasicCheckbox;
