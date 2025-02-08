import { NavLink, useLocation } from "react-router";

import React from "react";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/modules/common/components/ui/breadcrumb";

function formatBreadcrumbName(name: string) {
  return name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function AppBreadcrumb({ path }: { path?: string }) {
  const location = useLocation();
  const pathnames = path
    ? path.split("/").filter((x) => x)
    : location.pathname.split("/").filter((x) => x);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <NavLink to={"/"} className={"hover:underline"}>
            Dashboard
          </NavLink>
        </BreadcrumbItem>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem key={index} className="flex items-center">
                {isLast ? (
                  <BreadcrumbPage className="font-semibold">
                    {formatBreadcrumbName(value)}
                  </BreadcrumbPage>
                ) : (
                  <NavLink to={to} className="hover:underline">
                    {formatBreadcrumbName(value)}
                  </NavLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
