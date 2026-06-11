import Image from "next/image";
import { FtaCard } from "@/components/fta/FtaCard";
import { SectionWrapper } from "@/components/fta/SectionWrapper";
import { LANDING_HOSTS } from "@/lib/landing-content";

export function HostsSection() {
  return (
    <SectionWrapper id="hosts">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-semibold tracking-[0.12em] text-fta-gold uppercase">
          Your hosts
        </p>
        <h2 className="mt-3 font-display text-[length:var(--fs-h2)] font-bold text-fta-ink">
          Led by FTA directors
        </h2>
        <p className="mt-3 text-fta-muted">
          Sessions are presented by the team behind the UK&apos;s leading independent
          dental practice sales agency.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {LANDING_HOSTS.map((host) => (
          <FtaCard
            key={host.name}
            interactive
            className="overflow-hidden p-0"
          >
            <div className="fta-host-portrait relative aspect-[4/3] overflow-hidden bg-fta-warm">
              <Image
                src={host.image}
                alt={`Portrait of ${host.name}, ${host.role} at Frank Taylor & Associates`}
                width={host.imageWidth}
                height={host.imageHeight}
                className="h-full w-full object-cover object-top transition-transform duration-200 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div className="space-y-2 p-7 md:p-8">
              <p className="text-[13px] font-semibold tracking-[0.1em] text-fta-gold uppercase">
                {host.role}
              </p>
              <h3 className="font-display text-xl font-semibold text-fta-ink">
                {host.name}
              </h3>
              <p className="text-sm leading-relaxed text-fta-muted">{host.bio}</p>
            </div>
          </FtaCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
