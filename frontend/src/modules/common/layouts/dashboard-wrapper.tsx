import { SidebarTrigger } from "@/modules/common/components/ui/sidebar";

import { Separator } from "@/modules/common/components/ui/separator";
import { AppBreadcrumb } from "../components/app-breadcrumb";
import { PropsWithChildren } from "react";

export function DashboardWrapper({
  children,
  path,
}: PropsWithChildren & { path?: string }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <AppBreadcrumb path={path} />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] border flex-1 rounded-md bg-muted/50 md:min-h-min p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
