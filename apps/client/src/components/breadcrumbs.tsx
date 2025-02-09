import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { Link } from "@tanstack/react-router";
import React from "react";

export default function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.length > 0 && (
          <>
            <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink asChild>
                <Link to={breadcrumbs[0].path}>Hub</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {/* Separator after root, if there are more items */}
            {breadcrumbs.length > 1 && (
              <BreadcrumbSeparator className='hidden md:block' />
            )}
          </>
        )}

        {breadcrumbs.length > 1 &&
          breadcrumbs.slice(1).map((item, idx) => (
            <React.Fragment key={idx}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    className='capitalize'
                    to={item.path}>
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {idx < breadcrumbs.length - 2 && (
                <BreadcrumbSeparator className='hidden md:block' />
              )}
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
