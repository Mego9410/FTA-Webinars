import Link from "next/link";
import { FtaLogo } from "@/components/fta/FtaLogo";

const SOCIAL = [
  "instagram",
  "facebook",
  "x",
  "linkedin",
  "youtube",
  "whatsapp",
] as const;

const FOOTER_COLS = [
  {
    head: "Webinars",
    links: [
      { label: "Upcoming sessions", href: "/" },
      { label: "Live room", href: "/webinar" },
      { label: "Register", href: "/#register" },
    ],
  },
  {
    head: "Admin",
    links: [
      { label: "Sessions", href: "/admin" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    head: "FTA",
    links: [
      {
        label: "Main website",
        href: "https://www.franktaylorandassociates.co.uk",
        external: true,
      },
      { label: "Contact", href: "/contact" },
      { label: "Unsubscribe", href: "/unsubscribe" },
    ],
  },
] as const;

export function FtaFooter() {
  return (
    <footer className="bg-[var(--ink-pure)] px-[var(--gutter)] py-12 text-white md:py-20">
      <div className="fta-container grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-12">
        <div className="space-y-6">
          <FtaLogo href="/" size="sm" />
          <p className="max-w-sm text-[15px] leading-relaxed text-white/80">
            The UK&apos;s leading independent dental practice sales agency.
            Guiding practice owners with integrity since 1990.
          </p>
          <div className="flex flex-wrap gap-3">
            {SOCIAL.map((name) => (
              <a
                key={name}
                href="https://www.franktaylorandassociates.co.uk"
                aria-label={name}
                className="transition-opacity hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/fta/icons/${name}-white-yellow-circle-icon.svg`}
                  alt=""
                  width={38}
                  height={38}
                />
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
          {FOOTER_COLS.map((col) => (
            <div key={col.head}>
              <p className="footer-head">{col.head}</p>
              {col.links.map((link) =>
                "external" in link && link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="fta-container mt-12 border-t border-white/10 pt-6 text-xs text-white/50">
        © {new Date().getFullYear()} Frank Taylor &amp; Associates. All rights reserved.
      </div>
    </footer>
  );
}
