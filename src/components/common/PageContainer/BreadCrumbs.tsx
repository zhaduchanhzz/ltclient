"use client";
import BasicBreadcrumbs from "@/components/base/MaterialUI-Basic/BreadCrumb";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { APP_ROUTE } from "@/consts/app-route";
import { usePathname } from "next/navigation";
import { breadcrumbNameMap } from "./utils/data";

interface BreadCrumbCustomProps {}

const BreadCrumbCustom = (_: BreadCrumbCustomProps) => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((path) => {
    if (Number(path)) {
      return;
    }

    return path;
  });

  return (
    <BasicBreadcrumbs sx={{ mx: 2, py: 1.5 }}>
      <BasicNextLink href={APP_ROUTE.HOME}>Home</BasicNextLink>
      {pathnames.map((_, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return last ? (
          <BasicTypography variant="body2" color="text.primary" key={to}>
            {breadcrumbNameMap[to]}
          </BasicTypography>
        ) : (
          <BasicNextLink key={to} href={to}>
            {breadcrumbNameMap[to]}
          </BasicNextLink>
        );
      })}
    </BasicBreadcrumbs>
  );
};

export default BreadCrumbCustom;
