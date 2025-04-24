import TextField, { TextFieldProps } from "@mui/material/TextField";

type BasicTextFieldProps = TextFieldProps & {};

const BasicTextField = (props: BasicTextFieldProps) => {
  const { id, ...otherProps } = props;
  return <TextField id={id} data-cy={id} {...otherProps} />;
};

export default BasicTextField;
