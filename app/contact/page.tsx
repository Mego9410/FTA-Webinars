import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="fta-band fta-section">
        <div className="fta-container mx-auto max-w-3xl space-y-6 text-center">
          <p className="fta-eyebrow">Contact</p>
          <h1 className="fta-page-heading">Speak with the FTA team</h1>
          <p className="lead mx-auto max-w-xl">
            This webinar platform is part of Frank Taylor &amp; Associates. For
            valuations, sales advice, or general enquiries, reach out through the
            channels below.
          </p>
        </div>
      </section>

      <section className="fta-section pt-0">
        <div className="fta-container grid max-w-4xl gap-5 sm:grid-cols-2">
          {[
            {
              title: "Book a valuation",
              body: "Confidential practice valuations with no obligation.",
              href: "https://www.franktaylorandassociates.co.uk",
              highlight: true,
            },
            {
              title: "Call the team",
              body: "Speak with an advisor during office hours.",
              href: "tel:+441234567890",
              highlight: false,
            },
            {
              title: "Email us",
              body: "info@franktaylorandassociates.co.uk",
              href: "mailto:info@franktaylorandassociates.co.uk",
              highlight: false,
            },
            {
              title: "Main website",
              body: "Browse services, guides, and practices for sale.",
              href: "https://www.franktaylorandassociates.co.uk",
              highlight: false,
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              target={card.href.startsWith("http") ? "_blank" : undefined}
              rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={cn(
                "feature-card rounded-[var(--r-lg)] p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
                card.highlight
                  ? "bg-[var(--gold)] text-[var(--ink)]"
                  : "bg-white shadow-[var(--shadow-sm)]",
              )}
            >
              <div
                className={cn(
                  "disc-gold mb-4",
                  card.highlight && "bg-[var(--ink)] [&_img]:invert",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fta/icons/icon2-circle-yellow-white.svg"
                  alt=""
                  width={28}
                  height={28}
                />
              </div>
              <h2 className="text-lg font-bold">{card.title}</h2>
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed",
                  card.highlight ? "text-[var(--ink)]/80" : "text-[var(--fg-2)]",
                )}
              >
                {card.body}
              </p>
            </a>
          ))}
        </div>

        <div className="fta-container mt-12 flex flex-col items-stretch gap-3 px-0 sm:flex-row sm:justify-center">
          <Link href="/" className={cn(buttonVariants(), "fta-btn-mobile-full")}>
            Back to webinars
          </Link>
          <Link
            href="/webinar"
            className={cn(buttonVariants({ variant: "outline-ink" }), "fta-btn-mobile-full")}
          >
            Preview live room
          </Link>
        </div>
      </section>
    </main>
  );
}
