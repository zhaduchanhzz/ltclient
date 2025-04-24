import Chip, { ChipProps } from "@mui/material/Chip";

type BasicChipProps = ChipProps & {};

const BasicChip = (props: BasicChipProps) => {
  const { id, ...otherProps } = props;
  return <Chip id={id} data-cy={id} {...otherProps} />;
};

export default BasicChip;
