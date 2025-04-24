import Stack, { StackProps } from "@mui/material/Stack";

type BasicStackProps = StackProps & {};

const BasicStack = (props: BasicStackProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Stack id={id} data-cy={id} {...otherProps}>
      {children}
    </Stack>
  );
};

export default BasicStack;
