import Grid2, { Grid2Props } from "@mui/material/Grid2";

type BasicGridProps = Grid2Props & {};

const BasicGrid = (props: BasicGridProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Grid2 id={id} data-cy={id} {...otherProps}>
      {children}
    </Grid2>
  );
};

export default BasicGrid;
