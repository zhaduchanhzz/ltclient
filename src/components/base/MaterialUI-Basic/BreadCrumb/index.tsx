import Breadcrumbs, { BreadcrumbsProps } from "@mui/material/Breadcrumbs";

type BasicBreadcrumbsProps = BreadcrumbsProps & {};

const BasicBreadcrumbs = (props: BasicBreadcrumbsProps) => {
  const { id, children, ...otherProps } = props;

  return (
    <Breadcrumbs id={id} data-cy={id} {...otherProps}>
      {children}
    </Breadcrumbs>
  );
};

export default BasicBreadcrumbs;
