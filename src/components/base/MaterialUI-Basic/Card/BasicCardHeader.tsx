import CardHeader, { CardHeaderProps } from "@mui/material/CardHeader";

type BasicCardHeaderProps = CardHeaderProps & {};

const BasicCardHeader = (props: BasicCardHeaderProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <CardHeader id={id} data-cy={id} {...otherProps}>
      {children}
    </CardHeader>
  );
};

export default BasicCardHeader;
