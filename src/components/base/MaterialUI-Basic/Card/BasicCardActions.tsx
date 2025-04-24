import CardActions, { CardActionsProps } from "@mui/material/CardActions";

type BasicCardActionsProps = CardActionsProps & {};

const BasicCardActions = (props: BasicCardActionsProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <CardActions id={id} data-cy={id} {...otherProps}>
      {children}
    </CardActions>
  );
};

export default BasicCardActions;
