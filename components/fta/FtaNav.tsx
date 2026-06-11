"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FtaLogo } from "@/components/fta/FtaLogo";
import { ButtonLink } from "@/components/ui/button";
import { FTA_MAIN_WEBSITE } from "@/lib/fta-links";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Webinars", href: "/" },
  { label: "Live room", href: "/webinar" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin" },
  {
    label: "Main website",
    href: FTA_MAIN_WEBSITE,
    external: true,
  },
] as const;

export function FtaNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={cn("fta-nav", scrolled && "is-scrolled")}>
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
            <ButtonLink
              href="/webinar"
              variant="outline"
              size="sm"
              className="hidden min-[480px]:inline-flex"
            >
              Join webinar
            </ButtonLink>
            <ButtonLink href="/#register" size="sm">
              Register
            </ButtonLink>
            <button
              type="button"
              className="fta-nav-toggle"
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
      </header>

      <div
        id="fta-mobile-menu"
        className={cn("fta-nav-drawer md:hidden", menuOpen && "is-open")}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="fta-nav-drawer-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <nav className="fta-nav-drawer-panel" aria-label="Mobile">
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
              <Link
                key={link.href}
                href={link.href}
                className="fta-nav-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
          <div className="mt-6 flex flex-col gap-3">
            <ButtonLink
              href="/webinar"
              variant="outline"
              className="w-full min-[480px]:hidden"
            >
              Join webinar
            </ButtonLink>
            <ButtonLink href="/#register" className="w-full">
              Register
            </ButtonLink>
          </div>
        </nav>
      </div>
    </>
  );
}
