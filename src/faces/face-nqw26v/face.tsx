import React from "react";
import { ProductPill } from "@/components/ui/alethia-screen";

const reportRows = [
  { title: "Example · Suspicious delivery message", category: "Phishing", status: "Queued" },
  { title: "Example · Marketplace request to move channels", category: "Social engineering", status: "Queued" },
  { title: "Example · Unexpected document attachment", category: "Risky document", status: "Queued" },
];

const quests = [
  { event: "Daily login", activity: "Sign in", reward: "Set by admin" },
  { event: "Complete a module", activity: "Finish practice", reward: "Set by admin" },
  { event: "Create a report", activity: "Submit a report", reward: "Set by admin" },
];

export default function AdminConsoleFace() {
  return (
    <div className="h-full w-full bg-[#050b14] p-2 @xl:p-5 font-body text-[#e6edf4]" style={{ backgroundImage: "radial-gradient(ellipse at 16% 0%, rgba(166,232,107,.07), transparent 36%), radial-gradient(ellipse at 90% 100%, rgba(48,83,112,.15), transparent 42%)" }}>
      <div className="mx-auto flex h-full w-full max-w-[1880px] flex-col overflow-hidden border border-[#1b3550] bg-[#091321] shadow-[0_28px_100px_rgba(0,0,0,.48),inset_0_1px_0_rgba(230,237,244,.04)]">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#1b3550] bg-[#091321] px-4 py-2.5 @xl:px-10 @xl:py-5">
          <div className="flex items-center gap-2.5 @xl:gap-4">
            <span className="grid h-8 w-8 @xl:h-12 @xl:w-12 place-items-center border border-[#a6e86b]/50 bg-[#a6e86b]/[.08] font-mono text-xs @xl:text-xl font-bold text-[#a6e86b] shadow-[0_0_22px_rgba(166,232,107,.12)]">A_</span>
            <div><span className="font-mono text-[9px] @xl:text-sm font-bold tracking-[.2em]">ALETHIA</span><p className="mt-0.5 font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.12em] text-[#8191a1]">Administrator console</p></div>
          </div>
          <div className="flex items-center gap-2 @xl:gap-4 font-mono text-[7px] @xl:text-[10px] text-[#91a0af]"><span>Example admin session</span><ProductPill>Sign out</ProductPill></div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col gap-3 @xl:gap-5 p-3 @xl:p-7">
          <div className="flex shrink-0 items-end justify-between gap-3 border-b border-[#1b3550] pb-2 @xl:pb-4">
            <div><h1 className="text-lg @xl:text-3xl font-bold">Admin console</h1><p className="mt-1 text-[7px] @xl:text-[10px] text-[#91a0af]">Review submitted reports and manage learner quests.</p></div>
            <ProductPill>Illustrative data</ProductPill>
          </div>

          <section className="grid min-h-0 flex-[1.12] gap-2 @xl:grid-cols-[1.05fr_.95fr] @xl:gap-4">
            <div className="flex min-h-0 flex-col overflow-hidden border border-[#1b3550] border-t-[#a6e86b]/25 bg-gradient-to-br from-[#0d1a2b] to-[#091321] shadow-[inset_0_1px_0_rgba(230,237,244,.035)]">
              <div className="flex items-center justify-between gap-3 border-b border-[#1b3550] px-2.5 py-2 @xl:px-5 @xl:py-3"><div><h2 className="font-mono text-[7px] @xl:text-[10px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Report review</h2><p className="mt-0.5 text-[6px] @xl:text-[9px] text-[#8191a1]">Filter and open a report to review it.</p></div><div className="flex gap-1"><ProductPill tone="signal">All</ProductPill><ProductPill>Queued</ProductPill></div></div>
              <div className="grid shrink-0 grid-cols-[1.7fr_.8fr_.7fr] gap-2 border-b border-[#1b3550] bg-[#07101c] px-2.5 py-1.5 @xl:px-5 @xl:py-2 font-mono text-[5px] @xl:text-[8px] uppercase tracking-[.1em] text-[#8191a1]"><span>Report</span><span>Category</span><span>Status</span></div>
              <div className="flex min-h-0 flex-1 flex-col divide-y divide-[#1b3550]">
                {reportRows.map((row, index) => <div className={`grid min-h-0 flex-1 grid-cols-[1.7fr_.8fr_.7fr] items-center gap-2 px-2.5 py-1.5 @xl:px-5 @xl:py-2.5 ${index === 0 ? "border-l-2 border-l-[#a6e86b] bg-[#a6e86b]/[.04]" : "border-l-2 border-l-transparent"}`} key={row.title}><span className="text-[6px] @xl:text-[10px] font-semibold leading-snug">{row.title}</span><span className="text-[5px] @xl:text-[8px] text-[#91a0af]">{row.category}</span><span className="font-mono text-[5px] @xl:text-[8px] text-[#edbd67]">{row.status}</span></div>)}
              </div>
            </div>

            <div className="flex min-h-0 flex-col border border-[#1b3550] border-t-[#a6e86b]/25 bg-gradient-to-br from-[#0d1a2b] to-[#091321] p-2.5 @xl:p-5 shadow-[inset_0_1px_0_rgba(230,237,244,.035)]">
              <div className="flex items-start justify-between gap-2 border-b border-[#1b3550] pb-2 @xl:pb-4"><div><p className="font-mono text-[6px] @xl:text-[8px] uppercase tracking-[.12em] text-[#a6e86b]">Selected example report</p><h2 className="mt-1 text-[9px] @xl:text-base font-semibold">Suspicious delivery message</h2></div><ProductPill tone="warning">Queued</ProductPill></div>
              <div className="mt-2 @xl:mt-4 flex-1 space-y-2 @xl:space-y-4 text-[6px] @xl:text-[10px]">
                <div><p className="font-mono uppercase text-[#8191a1]">Evidence</p><p className="mt-1 leading-relaxed">A message uses a delivery problem and urgent payment request as an example for review.</p></div>
                <div><p className="font-mono uppercase text-[#8191a1]">Reviewer note</p><div className="mt-1 min-h-8 @xl:min-h-14 border border-[#1b3550] bg-[#07101c] p-2 text-[#91a0af]">Add context for this decision…</div></div>
                <div className="flex flex-wrap items-center gap-1.5 @xl:gap-2"><ProductPill tone="signal">Approve</ProductPill><ProductPill tone="warning">Reject</ProductPill><ProductPill>Remove</ProductPill></div>
              </div>
              <p className="border-t border-[#1b3550] pt-2 @xl:pt-3 font-mono text-[5px] @xl:text-[8px] text-[#8191a1]">Illustrative content · authors and live report data are not shown.</p>
            </div>
          </section>

          <section className="flex min-h-0 flex-[.88] flex-col overflow-hidden border border-[#1b3550] border-t-[#a6e86b]/25 bg-gradient-to-br from-[#0d1a2b] to-[#091321] shadow-[inset_0_1px_0_rgba(230,237,244,.035)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#1b3550] px-2.5 py-2 @xl:px-5 @xl:py-3"><div><h2 className="font-mono text-[7px] @xl:text-[10px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Daily quest editor</h2><p className="mt-0.5 text-[6px] @xl:text-[9px] text-[#8191a1]">Quest type and reward values are configured by an administrator.</p></div><div className="flex gap-1.5"><ProductPill>Add quest</ProductPill><ProductPill>Reorder</ProductPill></div></div>
            <div className="grid shrink-0 grid-cols-[1.1fr_1.2fr_.8fr_.7fr] gap-2 bg-[#07101c] px-2.5 py-1.5 @xl:px-5 @xl:py-2 font-mono text-[5px] @xl:text-[8px] uppercase tracking-[.1em] text-[#8191a1]"><span>Quest type</span><span>Activity</span><span>Reward</span><span>Status</span></div>
            <div className="flex min-h-0 flex-1 flex-col divide-y divide-[#1b3550]">{quests.map((quest) => <div className="grid min-h-0 flex-1 grid-cols-[1.1fr_1.2fr_.8fr_.7fr] items-center gap-2 px-2.5 py-1.5 @xl:px-5 @xl:py-2 text-[6px] @xl:text-[9px]" key={quest.event}><span className="font-semibold">{quest.event}</span><span className="text-[#91a0af]">{quest.activity}</span><span className="text-[#91a0af]">{quest.reward}</span><span><ProductPill>Configurable</ProductPill></span></div>)}</div>
            <div className="flex shrink-0 items-center justify-between border-t border-[#1b3550] px-2.5 py-1.5 @xl:px-5 @xl:py-2"><span className="font-mono text-[5px] @xl:text-[8px] text-[#8191a1]">Changes can be applied to today's assignments.</span><ProductPill tone="signal">Apply changes</ProductPill></div>
          </section>
        </main>
        <footer className="flex shrink-0 items-center justify-between border-t border-[#1b3550] bg-[#050b14] px-4 py-2 @xl:px-10 @xl:py-3 font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.08em] text-[#71869a]"><span>ALETHIA · ADMIN TOOLS</span><span className="text-[#a6e86b]/75">WEB PROTOTYPE</span></footer>
      </div>
    </div>
  );
}
