import React from "react";
import { AlethiaScreen, ProductButton, ProductPageHeader, ProductPanel, ProductPill } from "@/components/ui/alethia-screen";

const sampleReports = [
  { title: "Example · Delivery message asks for a fee", meta: "SMS · phishing pattern", state: "Queued for review", tone: "warning" as const },
  { title: "Example · Marketplace seller moves chat off-platform", meta: "Marketplace · social engineering", state: "Reviewed", tone: "signal" as const },
  { title: "Example · Unexpected document attachment", meta: "Email · risky file", state: "Queued for review", tone: "warning" as const },
];

export default function ReportHubFace() {
  return (
    <AlethiaScreen active="reports" footer="ALETHIA · COMMUNITY REPORTS">
      <div className="flex h-full min-h-0 flex-col gap-3 @xl:gap-5">
        <ProductPageHeader
          title="Community reports"
          description="Browse reports, share a suspicious pattern, and review the context contributed by the community."
          action={<ProductButton>Add a report</ProductButton>}
        />
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#263544] pb-2 @xl:pb-4">
          <div className="flex items-center gap-1.5 @xl:gap-2">
            <ProductPill tone="signal">All reports</ProductPill><ProductPill>My reports</ProductPill>
          </div>
          <div className="flex items-center gap-1.5 @xl:gap-2">
            <span className="mr-1 font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.1em] text-[#8191a1]">Sort</span>
            <ProductPill tone="signal">Top</ProductPill><ProductPill>Newest</ProductPill><ProductPill>Oldest</ProductPill>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 @xl:grid-cols-[1.05fr_.95fr] @xl:gap-5">
          <ProductPanel className="flex min-h-0 flex-col">
            <div className="mb-2 @xl:mb-4 flex items-center justify-between gap-3">
              <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Report feed</h2>
              <ProductPill>Illustrative examples</ProductPill>
            </div>
            <div className="flex min-h-0 flex-1 flex-col divide-y divide-[#263544] overflow-hidden border-y border-[#263544]">
              {sampleReports.map((report, index) => (
                <article className={`flex min-h-0 flex-1 flex-col justify-center px-2 py-1.5 @xl:px-4 @xl:py-3 ${index === 0 ? "border-l-2 border-l-[#a6e86b] bg-[#a6e86b]/[.035]" : "border-l-2 border-l-transparent"}`} key={report.title}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[8px] @xl:text-sm font-semibold leading-snug">{report.title}</h3>
                    <ProductPill tone={report.tone}>{report.state}</ProductPill>
                  </div>
                  <div className="mt-1.5 @xl:mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[6px] @xl:text-[9px] text-[#91a0af]">
                    <span>{report.meta}</span><span>·</span><span>Contributor username shown</span>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-2 @xl:mt-3 font-mono text-[6px] @xl:text-[9px] text-[#8191a1]">Titles and report rows above are examples, not live community data.</p>
          </ProductPanel>

          <ProductPanel className="flex min-h-0 flex-col">
            <div className="flex items-start justify-between gap-3 border-b border-[#263544] pb-2 @xl:pb-4">
              <div>
                <p className="font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.12em] text-[#a6e86b]">Illustrative report detail</p>
                <h2 className="mt-1 text-[10px] @xl:text-lg font-bold">Delivery message asks for a fee</h2>
              </div>
              <ProductPill tone="warning">Queued</ProductPill>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-2 @xl:gap-3 py-2 @xl:py-4">
              <div className="border border-[#263544] bg-[#0b1420] p-2 @xl:p-4">
                <p className="font-mono text-[6px] @xl:text-[9px] uppercase text-[#8191a1]">Channel</p>
                <p className="mt-1 text-[8px] @xl:text-sm">SMS message</p>
              </div>
              <div className="border border-[#263544] bg-[#0b1420] p-2 @xl:p-4">
                <p className="font-mono text-[6px] @xl:text-[9px] uppercase text-[#8191a1]">Pattern</p>
                <p className="mt-1 text-[8px] @xl:text-sm">Urgent payment request</p>
              </div>
              <div className="col-span-2 border border-[#263544] bg-[#0b1420] p-2 @xl:p-4">
                <p className="font-mono text-[6px] @xl:text-[9px] uppercase text-[#8191a1]">Report context</p>
                <p className="mt-1 text-[7px] @xl:text-xs leading-relaxed text-[#d1dae2]">Example only: inspect the sender and link, then verify through the courier's official channel before responding.</p>
              </div>
            </div>
            <div className="border-t border-[#263544] pt-2 @xl:pt-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.1em] text-[#a6e86b]">Community context</p>
                <ProductPill>Investigator verdict requires a reason</ProductPill>
              </div>
              <div className="mt-2 @xl:mt-3 flex flex-wrap items-center gap-2">
                <ProductPill>Signal report</ProductPill><ProductPill>Valid / Invalid</ProductPill><ProductPill>Investigation note</ProductPill>
              </div>
            </div>
          </ProductPanel>
        </div>
      </div>
    </AlethiaScreen>
  );
}
