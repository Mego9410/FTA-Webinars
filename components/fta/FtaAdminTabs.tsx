"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Sessions", href: "/admin" },
  { label: "Analytics", href: "/admin/analytics" },
] as const;

export function FtaAdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="fta-admin-tabs" aria-label="Admin">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "fta-admin-tab",
            pathname === tab.href && "is-active",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
