import CardContent, { CardContentProps } from "@mui/material/CardContent";

type BasicCardContentProps = CardContentProps & {};

const BasicCardContent = (props: BasicCardContentProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <CardContent id={id} data-cy={id} {...otherProps}>
      {children}
    </CardContent>
  );
};

export default BasicCardContent;
