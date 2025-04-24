import Select, { SelectProps } from "@mui/material/Select";

type BasicSelectProps<T> = SelectProps<T> & {};

const BasicSelect = <T, >(props: BasicSelectProps<T>) => {
  const { id, ...otherProps } = props;
  return <Select id={id} data-cy={id} {...otherProps} />;
};

export default BasicSelect;
