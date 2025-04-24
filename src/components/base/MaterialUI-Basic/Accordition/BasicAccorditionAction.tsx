import AccordionActions, {
  AccordionActionsProps,
} from "@mui/material/AccordionActions";

type BasicAccordionActionsProps = AccordionActionsProps & {};

const BasicAccordionActions = (props: BasicAccordionActionsProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <AccordionActions id={id} data-cy={id} {...otherProps}>
      {children}
    </AccordionActions>
  );
};

export default BasicAccordionActions;
