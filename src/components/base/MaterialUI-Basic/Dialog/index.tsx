import Dialog, { DialogProps } from "@mui/material/Dialog";

type BasicDialogProps = DialogProps & {};

const BasicDialog = (props: BasicDialogProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Dialog id={id} data-cy={id} {...otherProps}>
      {children}
    </Dialog>
  );
};

export default BasicDialog;
