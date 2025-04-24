import AccordionDetails, {
  AccordionDetailsProps,
} from "@mui/material/AccordionDetails";

type BasicAccordionDetailsProps = AccordionDetailsProps & {};

const BasicAccordionDetails = (props: BasicAccordionDetailsProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <AccordionDetails id={id} data-cy={id} {...otherProps}>
      {children}
    </AccordionDetails>
  );
};

export default BasicAccordionDetails;
