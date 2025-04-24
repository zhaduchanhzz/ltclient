import Badge, { BadgeProps } from "@mui/material/Badge";

type BasicBadgeProps = BadgeProps & {};

const BasicBadge = (props: BasicBadgeProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <Badge id={id} data-cy={id} {...otherProps}>
      {children}
    </Badge>
  );
};

export default BasicBadge;
