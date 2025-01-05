import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        404 Not found
        <Link to="/" className="hover:underline flex text-muted-foreground">
          <ChevronLeft /> back to dashboard
        </Link>
      </div>
    </div>
  );
}
