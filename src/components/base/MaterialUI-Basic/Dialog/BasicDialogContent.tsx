import DialogContent, { DialogContentProps } from "@mui/material/DialogContent";

type BasicDialogContentProps = DialogContentProps & {};

const BasicDialogContent = (props: BasicDialogContentProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <DialogContent id={id} data-cy={id} {...otherProps}>
      {children}
    </DialogContent>
  );
};

export default BasicDialogContent;
