import Typography, { TypographyProps } from "@mui/material/Typography";

type BasicTypographyProps = TypographyProps & {};

const BasicTypography = (props: BasicTypographyProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Typography id={id} data-cy={id} {...otherProps}>
      {children}
    </Typography>
  );
};

export default BasicTypography;
