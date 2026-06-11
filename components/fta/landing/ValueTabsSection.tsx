"use client";

import Image from "next/image";
import { useState } from "react";
import { FtaCard } from "@/components/fta/FtaCard";
import { SectionWrapper } from "@/components/fta/SectionWrapper";
import { LANDING_VALUE_TABS } from "@/lib/landing-content";
import { cn } from "@/lib/utils";

export function ValueTabsSection() {
  const [activeId, setActiveId] = useState<
    (typeof LANDING_VALUE_TABS)[number]["id"]
  >(LANDING_VALUE_TABS[0].id);
  const active =
    LANDING_VALUE_TABS.find((tab) => tab.id === activeId) ?? LANDING_VALUE_TABS[0];

  return (
    <SectionWrapper id="why-attend">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-semibold tracking-[0.12em] text-fta-gold uppercase">
          Why attend
        </p>
        <h2 className="mt-3 font-display text-[length:var(--fs-h2)] font-bold text-fta-ink">
          Practical guidance for every stage
        </h2>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {LANDING_VALUE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            className={cn(
              "rounded-pill border px-4 py-2 text-sm font-semibold transition-colors duration-200",
              activeId === tab.id
                ? "border-fta-gold bg-fta-gold text-fta-ink"
                : "border-fta-border bg-fta-bg text-fta-muted hover:border-fta-gold/40 hover:text-fta-ink",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <FtaCard className="mt-8 overflow-hidden p-0">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[220px] lg:min-h-[320px]">
            <Image
              key={active.id}
              src={active.image}
              alt={active.alt}
              width={active.imageWidth}
              height={active.imageHeight}
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center gap-3 p-7 md:p-10">
            <h3 className="font-display text-2xl font-bold text-fta-ink">
              {active.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-fta-muted">{active.body}</p>
          </div>
        </div>
      </FtaCard>
    </SectionWrapper>
  );
}
