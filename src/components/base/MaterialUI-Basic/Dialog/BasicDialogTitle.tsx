import DialogTitle, { DialogTitleProps } from "@mui/material/DialogTitle";

type BasicDialogTitleProps = DialogTitleProps & {};

const BasicDialogTitle = (props: BasicDialogTitleProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <DialogTitle id={id} data-cy={id} {...otherProps}>
      {children}
    </DialogTitle>
  );
};

export default BasicDialogTitle;
