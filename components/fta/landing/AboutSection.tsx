import Image from "next/image";
import { SectionWrapper } from "@/components/fta/SectionWrapper";

export function AboutSection() {
  return (
    <SectionWrapper band="warm" id="about">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-card">
          <Image
            src="/images/stock/about-london.webp"
            alt="London city skyline at dusk"
            width={1000}
            height={750}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading="lazy"
          />
        </div>
        <div className="space-y-4">
          <p className="text-[13px] font-semibold tracking-[0.12em] text-fta-gold uppercase">
            About FTA
          </p>
          <h2 className="font-display text-[length:var(--fs-h2)] font-bold text-fta-ink">
            Independent advice since 1990
          </h2>
          <p className="text-[15px] leading-relaxed text-fta-muted">
            Frank Taylor &amp; Associates is the UK&apos;s leading independent dental
            practice sales agency. We represent sellers only — giving practice owners
            confidential, expert guidance on selling, buying, and valuing their
            practices.
          </p>
          <p className="text-[15px] leading-relaxed text-fta-muted">
            These webinars distil that experience into practical sessions you can join
            from anywhere — no login, no sales pressure, just clear counsel from the
            team principals trust.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
