import Popper, { PopperProps } from "@mui/material/Popper";

type BasicPopperProps = PopperProps & {};

const BasicPopper = (props: BasicPopperProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Popper id={id} data-cy={id} {...otherProps}>
      {children}
    </Popper>
  );
};

export default BasicPopper;
