import CardMedia, { CardMediaProps } from "@mui/material/CardMedia";

type BasicCardMediaProps = CardMediaProps & {};

const BasicCardMedia = (props: BasicCardMediaProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <CardMedia id={id} data-cy={id} {...otherProps}>
      {children}
    </CardMedia>
  );
};

export default BasicCardMedia;
