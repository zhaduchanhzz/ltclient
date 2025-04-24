import AccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";

type BasicAccordionSummaryProps = AccordionSummaryProps & {};

const BasicAccordionSummary = (props: BasicAccordionSummaryProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <AccordionSummary id={id} data-cy={id} {...otherProps}>
      {children}
    </AccordionSummary>
  );
};

export default BasicAccordionSummary;
