import Accordion, { AccordionProps } from "@mui/material/Accordion";

type BasicAccordionProps = AccordionProps & {};

const BasicAccordion = (props: BasicAccordionProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <Accordion id={id} data-cy={id} {...otherProps}>
      {children}
    </Accordion>
  );
};

export default BasicAccordion;
