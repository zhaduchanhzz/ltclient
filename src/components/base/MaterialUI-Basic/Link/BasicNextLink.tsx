import { TypographyProps } from "@mui/material";
import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";
import BasicTypography from "../Typography";

/**
 * Defines the properties for the BasicNextLink component.
 *
 * Properties:
 * - `id`: An optional string to uniquely identify the link element.
 * - `typographyProps`: Optional properties to customize the associated Typography component.
 */
type BasicNextLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    id?: string;
    typographyProps?: TypographyProps;
  };

const BasicNextLink = (props: BasicNextLinkProps) => {
  const { href, children, id, typographyProps, ...rest } = props;
  return (
    <Link
      id={id}
      data-cy={id}
      href={String(href)}
      {...rest}
      style={{ textDecoration: "none", ...rest.style }}
    >
      <BasicTypography
        color="info"
        component="span"
        variant="body2"
        {...typographyProps}
      >
        {children}
      </BasicTypography>
    </Link>
  );
};

export default BasicNextLink;
