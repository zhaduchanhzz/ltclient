import DialogActions, { DialogActionsProps } from "@mui/material/DialogActions";

type BasicDialogActionsProps = DialogActionsProps & {};

const BasicDialogActions = (props: BasicDialogActionsProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <DialogActions id={id} data-cy={id} {...otherProps}>
      {children}
    </DialogActions>
  );
};

export default BasicDialogActions;
