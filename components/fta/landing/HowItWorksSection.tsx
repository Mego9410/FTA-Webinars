import Image from "next/image";
import { SectionWrapper } from "@/components/fta/SectionWrapper";
import { LANDING_HOW_IT_WORKS } from "@/lib/landing-content";

export function HowItWorksSection() {
  return (
    <SectionWrapper band="warm" id="how-it-works">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="space-y-4">
          <p className="text-[13px] font-semibold tracking-[0.12em] text-fta-gold uppercase">
            How it works
          </p>
          <h2 className="font-display text-[length:var(--fs-h2)] font-bold text-fta-ink">
            From registration to the live room
          </h2>
          <p className="text-[15px] leading-relaxed text-fta-muted">
            A simple flow designed for busy principals — join on time, watch the
            session, and take your next step when you&apos;re ready.
          </p>

          <ol className="mt-6 space-y-5">
            {LANDING_HOW_IT_WORKS.map((item) => (
              <li key={item.step} className="flex gap-4">
                <span className="font-display text-lg font-bold text-fta-gold">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-fta-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-fta-muted">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-card">
          <Image
            src="/images/stock/how-webinar.webp"
            alt="Presenter leading an online webinar session"
            width={1200}
            height={800}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
            loading="lazy"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
