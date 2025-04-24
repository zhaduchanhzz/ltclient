import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";

type BasicProgressProps = CircularProgressProps & {};

const BasicProgress = (props: BasicProgressProps) => {
  const { id, ...otherProps } = props;
  return <CircularProgress id={id} data-cy={id} {...otherProps} />;
};

export default BasicProgress;
