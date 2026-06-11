"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FtaLogo } from "@/components/fta/FtaLogo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Webinars", href: "/" },
  { label: "Live room", href: "/webinar" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin" },
  {
    label: "Main website",
    href: "https://www.franktaylorandassociates.co.uk",
    external: true,
  },
] as const;

export function FtaNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fta-nav sticky top-0 z-50">
      <div className="fta-container fta-nav-bar">
        <FtaLogo responsive />

        <nav className="fta-nav-desktop" aria-label="Main">
          {NAV_LINKS.map((link) =>
            "external" in link && link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="fta-nav-link"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="fta-nav-link">
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="fta-nav-actions">
          <Link
            href="/webinar"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden min-[480px]:inline-flex",
            )}
          >
            Join webinar
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fta/icons/right-black-plain-arrow.svg"
              alt=""
              width={14}
              height={14}
            />
          </Link>
          <Link href="/#register" className={cn(buttonVariants({ size: "sm" }))}>
            Register
          </Link>
          <button
            type="button"
            className="fta-nav-toggle md:hidden"
            aria-expanded={menuOpen}
            aria-controls="fta-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span className={cn("fta-nav-toggle-bar", menuOpen && "is-open")} />
            <span className={cn("fta-nav-toggle-bar", menuOpen && "is-open")} />
            <span className={cn("fta-nav-toggle-bar", menuOpen && "is-open")} />
          </button>
        </div>
      </div>

      <nav
        id="fta-mobile-menu"
        className={cn("fta-nav-mobile md:hidden", menuOpen && "is-open")}
        aria-label="Mobile"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map((link) =>
          "external" in link && link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="fta-nav-mobile-link"
            >
              {link.label}
            </a>
          ) : (
            <Link key={link.href} href={link.href} className="fta-nav-mobile-link">
              {link.label}
            </Link>
          ),
        )}
        <Link
          href="/webinar"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full min-[480px]:hidden")}
        >
          Join webinar
        </Link>
      </nav>
    </header>
  );
}
