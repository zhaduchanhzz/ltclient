import Tooltip, { TooltipProps } from "@mui/material/Tooltip";

type BasicTooltipProps = TooltipProps & {};

const BasicTooltip = (props: BasicTooltipProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Tooltip id={id} data-cy={id} {...otherProps}>
      {children}
    </Tooltip>
  );
};

export default BasicTooltip;
