import { AudioLinesIcon } from "lucide-react";
import { SidebarMenuItem, useSidebar } from "../../ui/sidebar";

export function SidebarLogo() {
  const { open } = useSidebar();

  return (
    <SidebarMenuItem>
      <div className="flex gap-2 items-center">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <AudioLinesIcon />
        </div>
        {open && (
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{"Deep Cord"}</span>
          </div>
        )}
      </div>
    </SidebarMenuItem>
  );
}
