import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";

type BasicSnackbarProps = SnackbarProps & {};

const BasicSnackbar = (props: BasicSnackbarProps) => {
  const { id, ...otherProps } = props;
  return <Snackbar id={id} data-cy={id} {...otherProps} />;
};

export default BasicSnackbar;
