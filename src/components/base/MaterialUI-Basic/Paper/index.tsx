import Paper, { PaperProps } from "@mui/material/Paper";

type BasicPaperProps = PaperProps & {};

const BasicPaper = (props: BasicPaperProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Paper id={id} data-cy={id} {...otherProps}>
      {children}
    </Paper>
  );
};

export default BasicPaper;
