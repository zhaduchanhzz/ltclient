import Link, { LinkProps } from "@mui/material/Link";

type BasicMaterialLinkProps = LinkProps & {};

const BasicMaterialLink = (props: BasicMaterialLinkProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Link id={id} data-cy={id} {...otherProps}>
      {children}
    </Link>
  );
};

export default BasicMaterialLink;
