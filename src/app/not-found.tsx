import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        That route does not exist. The dashboard, posts, users and notification views are all
        reachable from the sidebar.
      </p>
      <Button asChild>
        <Link href="/">Back to the dashboard</Link>
      </Button>
    </main>
  );
}
