import Divider, { DividerProps } from "@mui/material/Divider";

type BasicDividerProps = DividerProps & {};

const BasicDivider = (props: BasicDividerProps) => {
  const { id, ...otherProps } = props;
  return <Divider id={id} data-cy={id} {...otherProps} />;
};

export default BasicDivider;
