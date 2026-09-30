import React from "react";
import { AlethiaScreen, ProductMetric, ProductPageHeader, ProductPanel, ProductPill } from "@/components/ui/alethia-screen";

const modules = [
  { title: "Courier SMS Phishing", copy: "Inspect a delivery message before choosing a response.", image: "/media/sms-phishing-cutout.webp", status: "Module 01" },
  { title: "Marketplace Social Engineering", copy: "Notice trust shifts and unusual requests in a conversation.", image: "/media/social-engineering-cutout.webp", status: "Module 02" },
  { title: "Risky Document Analysis", copy: "Check a file's source and details before opening it.", image: "/media/malicious.webp", status: "Module 03" },
];

export default function DashboardFace() {
  return (
    <AlethiaScreen active="dashboard">
      <div className="flex h-full min-h-0 flex-col gap-3 @xl:gap-5">
        <ProductPageHeader
          title="Welcome"
          description="Build the habit of pausing, checking, and verifying. This dashboard brings practice and personal progress together."
        />

        <ProductPanel className="shrink-0 p-2.5 @xl:p-4">
          <div className="flex items-center gap-3 @xl:gap-5">
            <img alt="" aria-hidden="true" className="h-10 w-10 @xl:h-16 @xl:w-16 object-contain" src="/media/operator-pixel-cutout.svg" />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[7px] @xl:text-[10px] uppercase tracking-[.14em] text-[#a6e86b]">Achievement update</p>
              <p className="mt-1 text-[10px] @xl:text-base font-semibold">New achievements appear here as you practise.</p>
              <p className="mt-0.5 text-[7px] @xl:text-[10px] text-[#91a0af]">Examples shown in this presentation are illustrative; learner records vary.</p>
            </div>
            <ProductPill>Personal record</ProductPill>
          </div>
        </ProductPanel>

        <dl className="grid shrink-0 grid-cols-2 gap-2 @xl:grid-cols-4 @xl:gap-3">
          <ProductMetric label="Points" value="—" note="From account activity" />
          <ProductMetric label="Level" value="—" note="Progression" />
          <ProductMetric label="Modules complete" value="— / 3" note="Guided practice path" />
          <ProductMetric label="Reports in review" value="—" note="Community reports" />
        </dl>

        <div className="grid min-h-0 flex-1 gap-3 @xl:grid-cols-[1.55fr_1fr] @xl:gap-5">
          <ProductPanel className="flex min-h-0 flex-col">
            <div className="mb-2 @xl:mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Practice modules</h2>
                <p className="mt-1 text-[7px] @xl:text-[10px] text-[#91a0af]">Published modules in the current prototype</p>
              </div>
              <ProductPill tone="signal">3 modules</ProductPill>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 @xl:gap-3">
              {modules.map((module) => (
                <article className="flex min-w-0 flex-col overflow-hidden border border-[#263544] bg-[#0b1420]" key={module.title}>
                  <div className="relative h-[34%] min-h-10 overflow-hidden bg-gradient-to-br from-[#182638] to-[#0c1521]">
                    <img alt="" aria-hidden="true" className="absolute bottom-0 right-0 h-full w-[65%] object-contain object-bottom" src={module.image} />
                    <span className="absolute left-2 top-2 @xl:left-3 @xl:top-3 font-mono text-[6px] @xl:text-[9px] text-[#a6e86b]">{module.status}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-2 @xl:p-4">
                    <h3 className="text-[8px] @xl:text-sm font-bold leading-tight">{module.title}</h3>
                    <p className="mt-1.5 @xl:mt-2 text-[7px] @xl:text-[10px] leading-relaxed text-[#91a0af]">{module.copy}</p>
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#263544] pt-2 @xl:pt-3 font-mono text-[6px] @xl:text-[9px]">
                      <span className="text-[#a6e86b]">Access follows progress</span>
                      <span className="text-[#8292a3]">→</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ProductPanel>

          <div className="grid min-h-0 grid-rows-2 gap-3 @xl:gap-5">
            <ProductPanel className="flex min-h-0 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Daily quest</h2>
                  <p className="mt-1 @xl:mt-3 text-[10px] @xl:text-lg font-semibold">A short activity for today</p>
                  <p className="mt-1 text-[7px] @xl:text-[10px] leading-relaxed text-[#91a0af]">Quest definitions and rewards are configured in the admin tools.</p>
                </div>
                <img alt="" aria-hidden="true" className="h-9 w-9 @xl:h-14 @xl:w-14 object-contain" src="/media/levelone.webp" />
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#263544] pt-2 @xl:pt-4">
                <ProductPill>Account-specific</ProductPill>
                <span className="font-mono text-[7px] @xl:text-[10px] text-[#a6e86b]">View quest →</span>
              </div>
            </ProductPanel>
            <ProductPanel className="flex min-h-0 flex-col justify-between">
              <div>
                <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Daily activity</h2>
                <p className="mt-1 @xl:mt-3 text-[9px] @xl:text-base font-semibold">Streaks track practice over time.</p>
                <p className="mt-1 text-[7px] @xl:text-[10px] text-[#91a0af]">The current and longest streak depend on learner activity.</p>
              </div>
              <div className="flex items-end gap-1.5 @xl:gap-2" aria-label="Illustrative weekly activity strip">
                {Array.from({ length: 7 }, (_, index) => (
                  <span className="h-4 @xl:h-8 flex-1 border border-[#263544] bg-[#0b1420]" key={index} />
                ))}
              </div>
            </ProductPanel>
          </div>
        </div>
      </div>
    </AlethiaScreen>
  );
}
