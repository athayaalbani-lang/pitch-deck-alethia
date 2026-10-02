import React from "react";
import { AlethiaScreen, ProductPageHeader, ProductPill } from "@/components/ui/alethia-screen";
import { Glint, Reveal, Sprite3D, Tilt } from "@/components/ui/anim";

const modules = [
  {
    no: "01",
    title: "Courier SMS Phishing",
    copy: "Pause when a delivery message creates pressure. Inspect the sender and link, verify through an official channel, then decide.",
    image: "/media/sms-phishing-cutout.webp",
    status: "Available in example state",
  },
  {
    no: "02",
    title: "Marketplace Social Engineering",
    copy: "Notice when trust and a change of channel are used to make an unusual request feel normal.",
    image: "/media/social-engineering-cutout.webp",
    status: "Next in the guided path",
  },
  {
    no: "03",
    title: "Risky Document Analysis",
    copy: "Review the source, context, and file details before deciding whether to open it.",
    image: "/media/malicious.webp",
    status: "Next in the guided path",
  },
];

export default function TrainingFace() {
  return (
    <AlethiaScreen active="training" footer="ALETHIA · TRAINING MODULES">
      <div className="flex h-full min-h-0 flex-col gap-3 @xl:gap-5">
        <Reveal as="div" blur={4} y={10}>
          <ProductPageHeader
            title="Training modules"
            description="Short practice sessions connect everyday decisions with safer habits. Complete modules in order to continue along the path."
            action={<ProductPill tone="signal">Example learner path</ProductPill>}
          />
        </Reveal>

        <div className="grid min-h-0 flex-1 grid-rows-3 gap-2 @xl:gap-3">
          {modules.map((module, index) => (
            <Reveal
              as="article"
              className="relative grid min-h-0 grid-cols-[1fr_1.4fr] overflow-hidden border border-[var(--space-line)] bg-[var(--space-raised)] @xl:grid-cols-[.8fr_2fr_1fr]"
              index={index}
              key={module.no}
              step={0.13}
              y={20}
            >
              {/* Only the media pane tilts — tilting the whole row would skew
                  the body copy, which needs to stay readable. */}
              <div className="relative min-h-0 overflow-hidden bg-gradient-to-br from-[var(--space-raised)] to-[var(--space-panel)] [transform-style:preserve-3d]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(166,232,107,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(166,232,107,.08) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <Sprite3D
                  alt=""
                  className="absolute inset-0 p-1 @xl:p-3"
                  depth={22}
                  float={6}
                  glow="var(--signal-info)"
                  src={module.image}
                />
                <span className="absolute left-2 top-2 font-mono text-lg font-bold text-[var(--lime)] @xl:left-4 @xl:top-4 @xl:text-3xl">{module.no}</span>
                {index < modules.length - 1 ? (
                  <span className="absolute bottom-0 left-5 h-3/5 w-px bg-[var(--lime)]/40 @xl:left-9" />
                ) : null}
                <Glint delay={0.45 + index * 0.14} />
              </div>
              <div className="flex min-w-0 flex-col justify-center p-2.5 @xl:p-7">
                <h2 className="text-[10px] font-bold leading-tight @xl:text-xl">{module.title}</h2>
                <p className="mt-1.5 max-w-3xl text-[7px] leading-relaxed text-[var(--ink-muted)] @xl:mt-3 @xl:text-xs">{module.copy}</p>
                <span className="mt-2 font-mono text-[6px] uppercase tracking-[.1em] text-[var(--lime)] @xl:mt-4 @xl:text-[9px]">{module.status}</span>
              </div>
              <div className="hidden items-center justify-end px-7 @xl:flex">
                <span
                  className={`inline-flex h-10 min-w-36 items-center justify-center border px-4 font-mono text-[10px] uppercase tracking-[.08em] ${
                    index === 0 ? "border-[var(--lime)]/50 bg-[var(--lime)]/[.07] text-[var(--lime)]" : "border-[var(--space-line)] text-[var(--ink-muted)]"
                  }`}
                >
                  {index === 0 ? "Open module" : "Locked"}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="flex shrink-0 items-center justify-between gap-3 border border-[var(--space-line)] bg-[var(--space-panel)] px-3 py-2 @xl:px-5 @xl:py-3" index={3} y={12}>
          <p className="font-mono text-[7px] text-[var(--ink-muted)] @xl:text-[10px]">Example access state only · availability follows the learner's recorded progress.</p>
          <div className="hidden items-center gap-2 @xl:flex">
            <ProductPill tone="signal">Practice</ProductPill>
            <ProductPill>Reflect</ProductPill>
            <ProductPill>Continue</ProductPill>
          </div>
        </Reveal>
      </div>
    </AlethiaScreen>
  );
}
