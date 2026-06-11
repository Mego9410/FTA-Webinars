import Link from "next/link";
import { FtaLogo } from "@/components/fta/FtaLogo";
import {
  FTA_MAIN_WEBSITE,
  FTA_SOCIAL_LINKS,
  FTA_SOCIAL_ORDER,
} from "@/lib/fta-links";

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
        href: FTA_MAIN_WEBSITE,
        external: true,
      },
      { label: "Contact", href: "/contact" },
      { label: "Unsubscribe", href: "/unsubscribe" },
    ],
  },
] as const;

export function FtaFooter() {
  return (
    <footer className="bg-fta-ink px-6 py-14 text-white md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[340px_1fr] lg:gap-12">
        <div className="space-y-5">
          <FtaLogo href="/" size="sm" />
          <p className="max-w-sm text-[15px] leading-relaxed text-white/88">
            The UK&apos;s leading independent dental practice sales agency.
            Guiding practice owners with integrity since 1990.
          </p>
          <div className="flex flex-wrap gap-3">
            {FTA_SOCIAL_ORDER.map((name) => (
              <a
                key={name}
                href={FTA_SOCIAL_LINKS[name]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="transition-opacity duration-200 hover:opacity-85"
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
      <div className="mx-auto mt-10 max-w-[1200px] border-t border-white/12 pt-6 text-xs text-white/65">
        © {new Date().getFullYear()} Frank Taylor &amp; Associates. All rights reserved.
      </div>
    </footer>
  );
}
