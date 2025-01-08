"use client";

import * as React from "react";

import { NavMain } from "@/modules/common/components/app-sidebar/partials/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/modules/common/components/ui/sidebar";
import { ModeToggle } from "../theme-toggle";
import { SidebarLogo } from "./partials/sidebar-logo";
import { navItems } from "@/router/nav-items";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        <ModeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
