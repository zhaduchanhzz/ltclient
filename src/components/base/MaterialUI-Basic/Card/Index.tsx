import Card, { CardProps } from "@mui/material/Card";

type BasicCardProps = CardProps & {};

const BasicCard = (props: BasicCardProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <Card id={id} data-cy={id} {...otherProps}>
      {children}
    </Card>
  );
};

export default BasicCard;
