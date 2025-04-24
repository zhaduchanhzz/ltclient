import Backdrop, { BackdropProps } from "@mui/material/Backdrop";

type BasicBackdropProps = BackdropProps & {};

const BasicBackdrop = (props: BasicBackdropProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <Backdrop id={id} data-cy={id} {...otherProps}>
      {children}
    </Backdrop>
  );
};

export default BasicBackdrop;
