import { PropsWithChildren } from "react";

export function DashboardPaper({ children }: PropsWithChildren) {
  return (
    <div className="min-h-[100vh] flex-1 rounded-md bg-muted/50 md:min-h-min p-4">
      {children}
    </div>
  );
}
