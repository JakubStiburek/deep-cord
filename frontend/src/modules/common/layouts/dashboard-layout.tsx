import { AppSidebar } from "@/modules/common/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/modules/common/components/ui/sidebar";
import { Outlet } from "react-router";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
