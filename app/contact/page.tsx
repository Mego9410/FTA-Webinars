import { Mail, Phone } from "lucide-react";
import { FtaCard } from "@/components/fta/FtaCard";
import { IconBadge } from "@/components/fta/IconBadge";
import { SectionWrapper } from "@/components/fta/SectionWrapper";
import { ButtonLink } from "@/components/ui/button";
import {
  FTA_EMAIL,
  FTA_MAIN_WEBSITE,
  FTA_PHONE_DISPLAY,
  FTA_PHONE_TEL,
} from "@/lib/fta-links";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <SectionWrapper band="warm" className="fta-contact-hero">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <p className="text-[13px] font-semibold tracking-[0.12em] text-fta-gold uppercase">
            Contact
          </p>
          <h1 className="font-display text-[length:var(--fs-h2)] font-bold">
            Speak with the FTA team
          </h1>
          <p className="mx-auto max-w-xl text-fta-muted">
            This webinar platform is part of Frank Taylor &amp; Associates. For
            valuations, sales advice, or general enquiries, reach out through the
            channels below.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="pt-0">
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
          {[
            {
              title: "Book a valuation",
              body: "Confidential practice valuations with no obligation.",
              href: FTA_MAIN_WEBSITE,
              highlight: true,
              icon: Phone,
            },
            {
              title: "Call the team",
              body: `Speak with an advisor on ${FTA_PHONE_DISPLAY} during office hours.`,
              href: FTA_PHONE_TEL,
              highlight: false,
              icon: Phone,
            },
            {
              title: "Email us",
              body: FTA_EMAIL,
              href: `mailto:${FTA_EMAIL}`,
              highlight: false,
              icon: Mail,
            },
            {
              title: "Main website",
              body: "Browse services, guides, and practices for sale.",
              href: FTA_MAIN_WEBSITE,
              highlight: false,
              icon: Phone,
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              target={card.href.startsWith("http") ? "_blank" : undefined}
              rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <FtaCard
                interactive
                className={cn(
                  "h-full",
                  card.highlight && "border-fta-gold/40 bg-fta-gold-soft",
                )}
              >
                <IconBadge
                  icon={card.icon}
                  variant={card.highlight ? "solid" : "soft"}
                  className="mb-4"
                />
                <h2 className="font-display text-lg font-semibold text-fta-ink">
                  {card.title}
                </h2>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed",
                    card.highlight ? "text-fta-ink/80" : "text-fta-muted",
                  )}
                >
                  {card.body}
                </p>
              </FtaCard>
            </a>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/" className="fta-btn-mobile-full">
            Back to webinars
          </ButtonLink>
          <ButtonLink href="/webinar" variant="outline-ink" className="fta-btn-mobile-full">
            Preview live room
          </ButtonLink>
        </div>
      </SectionWrapper>
    </main>
  );
}
