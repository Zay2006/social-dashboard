"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDrawerContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { PlatformBreakdown } from "@/lib/data/platformStats";

interface DashboardShellProps {
  breakdown: PlatformBreakdown;
  children: React.ReactNode;
}

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2 font-semibold">
      <Sparkles className="h-5 w-5" aria-hidden="true" />
      <span>Social Dashboard</span>
    </Link>
  );
}

/**
 * Application chrome for every dashboard route.
 *
 * Rendered from `app/(dashboard)/layout.tsx` rather than wrapped around each
 * page by hand, so the sidebar keeps its state across navigations and no page
 * can forget it. Below `md` the sidebar becomes a drawer instead of permanently
 * eating 40% of a phone screen.
 */
export function DashboardShell({ breakdown, children }: DashboardShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // App Router keeps this component mounted across navigations, so the drawer
  // has to be closed explicitly once the new route renders.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
        <div className="sticky top-0 max-h-screen overflow-y-auto">
          <div className="flex h-14 items-center border-b px-4">
            <Brand />
          </div>
          <SidebarNav breakdown={breakdown} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogDrawerContent className="bg-card" hideCloseButton>
              <DialogTitle className="sr-only">Navigation</DialogTitle>
              <div className="flex h-14 items-center border-b px-4">
                <Brand onClick={() => setDrawerOpen(false)} />
              </div>
              <SidebarNav breakdown={breakdown} onNavigate={() => setDrawerOpen(false)} />
            </DialogDrawerContent>
          </Dialog>

          <div className="md:hidden">
            <Brand />
          </div>

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
