import React from "react";
import { AlethiaScreen, ProductPageHeader, ProductPill } from "@/components/ui/alethia-screen";

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
        <ProductPageHeader
          title="Training modules"
          description="Short practice sessions connect everyday decisions with safer habits. Complete modules in order to continue along the path."
          action={<ProductPill tone="signal">Example learner path</ProductPill>}
        />
        <div className="grid min-h-0 flex-1 grid-rows-3 gap-2 @xl:gap-3">
          {modules.map((module, index) => (
            <article className="relative grid min-h-0 grid-cols-[1fr_1.4fr] @xl:grid-cols-[.8fr_2fr_1fr] overflow-hidden border border-[#263544] bg-[#101a26]" key={module.no}>
              <div className="relative min-h-0 overflow-hidden bg-gradient-to-br from-[#1a2a3a] to-[#0b1420]">
                <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(to right, rgba(166,232,107,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(166,232,107,.08) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <img alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-contain object-right-bottom p-1 @xl:p-3" src={module.image} />
                <span className="absolute left-2 top-2 @xl:left-4 @xl:top-4 font-mono text-lg @xl:text-3xl font-bold text-[#a6e86b]">{module.no}</span>
                {index < modules.length - 1 ? <span className="absolute bottom-0 left-5 @xl:left-9 h-3/5 w-px bg-[#a6e86b]/40" /> : null}
              </div>
              <div className="flex min-w-0 flex-col justify-center p-2.5 @xl:p-7">
                <h2 className="text-[10px] @xl:text-xl font-bold leading-tight">{module.title}</h2>
                <p className="mt-1.5 @xl:mt-3 max-w-3xl text-[7px] @xl:text-xs leading-relaxed text-[#91a0af]">{module.copy}</p>
                <span className="mt-2 @xl:mt-4 font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.1em] text-[#a6e86b]">{module.status}</span>
              </div>
              <div className="hidden @xl:flex items-center justify-end px-7">
                <span className={`inline-flex h-10 min-w-36 items-center justify-center border px-4 font-mono text-[10px] uppercase tracking-[.08em] ${index === 0 ? "border-[#a6e86b]/50 bg-[#a6e86b]/[.07] text-[#a6e86b]" : "border-[#364657] text-[#8292a3]"}`}>
                  {index === 0 ? "Open module" : "Locked"}
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 border border-[#263544] bg-[#0b1420] px-3 py-2 @xl:px-5 @xl:py-3">
          <p className="font-mono text-[7px] @xl:text-[10px] text-[#91a0af]">Example access state only · availability follows the learner's recorded progress.</p>
          <div className="hidden @xl:flex items-center gap-2">
            <ProductPill tone="signal">Practice</ProductPill><ProductPill>Reflect</ProductPill><ProductPill>Continue</ProductPill>
          </div>
        </div>
      </div>
    </AlethiaScreen>
  );
}
