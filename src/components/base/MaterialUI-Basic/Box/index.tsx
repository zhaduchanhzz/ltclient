import Box, { BoxProps } from "@mui/material/Box";

type BasicBoxProps = BoxProps & {};

const BasicBox = (props: BasicBoxProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <Box id={id} data-cy={id} {...otherProps}>
      {children}
    </Box>
  );
};

export default BasicBox;
