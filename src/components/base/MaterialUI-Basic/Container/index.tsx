import Container, { ContainerProps } from "@mui/material/Container";

type BasicContainerProps = ContainerProps & {};

const BasicContainer = (props: BasicContainerProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Container id={id} data-cy={id} {...otherProps}>
      {children}
    </Container>
  );
};

export default BasicContainer;
