import Alert, { AlertProps } from "@mui/material/Alert";

type BasicAlertProps = AlertProps & {};

const BasicAlert = (props: BasicAlertProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <Alert id={id} data-cy={id} {...otherProps}>
      {children}
    </Alert>
  );
};

export default BasicAlert;
