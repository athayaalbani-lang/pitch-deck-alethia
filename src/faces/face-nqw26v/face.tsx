import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProductPill } from "@/components/ui/alethia-screen";
import { Glint, Reveal, Tilt } from "@/components/ui/anim";

const reportRows = [
  {
    title: "Example · Suspicious delivery message",
    category: "Phishing",
    status: "Queued",
    evidence: "A message uses a delivery problem and urgent payment request as an example for review.",
  },
  {
    title: "Example · Marketplace request to move channels",
    category: "Social engineering",
    status: "Queued",
    evidence: "A trusted conversation moves off-platform before a request is made, so the record stops where the review starts.",
  },
  {
    title: "Example · Unexpected document attachment",
    category: "Risky document",
    status: "Queued",
    evidence: "A file arrives with no prior thread, and the sender's display name is reused rather than verified.",
  },
];

const quests = [
  { event: "Daily login", activity: "Sign in", reward: "Set by admin" },
  { event: "Complete a module", activity: "Finish practice", reward: "Set by admin" },
  { event: "Create a report", activity: "Submit a report", reward: "Set by admin" },
];

export default function AdminConsoleFace() {
  const [selected, setSelected] = useState(0);
  const report = reportRows[selected];

  return (
    <div className="h-full w-full bg-[#050b14] p-2 font-body text-[#f2f6f9] @xl:p-5" style={{ backgroundImage: "radial-gradient(ellipse at 16% 0%, rgba(166,232,107,.07), transparent 36%), radial-gradient(ellipse at 90% 100%, rgba(48,83,112,.15), transparent 42%)" }}>
      <div className="mx-auto flex h-full w-full max-w-[1880px] flex-col overflow-hidden rounded-[var(--rw-radius-lg)] border border-[#1b3550] bg-[#091321] shadow-[0_28px_100px_rgba(0,0,0,.48),inset_0_1px_0_rgba(230,237,244,.04)]">
        <Reveal as="header" className="flex shrink-0 items-center justify-between gap-3 border-b border-[#1b3550] bg-[#091321] px-4 py-2.5 @xl:px-10 @xl:py-5" y={8} blur={3}>
          <div className="flex items-center gap-2.5 @xl:gap-4">
            <span className="grid h-8 w-8 place-items-center rounded-[var(--rw-radius)] border border-[#a6e86b]/50 bg-[#a6e86b]/[.08] font-mono text-xs font-bold text-[#a6e86b] shadow-[0_0_22px_rgba(166,232,107,.12)] @xl:h-12 @xl:w-12 @xl:text-xl">A_</span>
            <div>
              <span className="font-mono text-[9px] font-bold tracking-[.2em] @xl:text-sm">ALETHIA</span>
              <p className="mt-0.5 font-mono text-[6px] uppercase tracking-[.12em] text-[#8191a1] @xl:text-[9px]">Administrator console</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[7px] text-[#8191a1] @xl:gap-4 @xl:text-[10px]">
            <span>Example admin session</span>
            <ProductPill>Sign out</ProductPill>
          </div>
        </Reveal>

        <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 @xl:gap-5 @xl:p-7">
          <Reveal className="flex shrink-0 items-end justify-between gap-3 border-b border-[#1b3550] pb-2 @xl:pb-4" index={1} y={10}>
            <div>
              <h1 className="text-lg font-bold @xl:text-3xl">Admin console</h1>
              <p className="mt-1 text-[7px] text-[#8191a1] @xl:text-[10px]">Review submitted reports and manage learner quests.</p>
            </div>
            <ProductPill>Illustrative data</ProductPill>
          </Reveal>

          <section className="grid min-h-0 flex-[1.12] gap-2 @xl:grid-cols-[1.05fr_.95fr] @xl:gap-4">
            <Reveal className="flex min-h-0 flex-col overflow-hidden border border-[#1b3550] border-t-[#a6e86b]/25 bg-gradient-to-br from-[#0d1a2b] to-[#091321] shadow-[inset_0_1px_0_rgba(230,237,244,.035)]" index={2} y={14}>
              <div className="flex items-center justify-between gap-3 border-b border-[#1b3550] px-2.5 py-2 @xl:px-5 @xl:py-3">
                <div>
                  <h2 className="font-mono text-[7px] font-bold uppercase tracking-[.14em] text-[#a6e86b] @xl:text-[10px]">Report review</h2>
                  <p className="mt-0.5 text-[6px] text-[#8191a1] @xl:text-[9px]">Filter and open a report to review it.</p>
                </div>
                <div className="flex gap-1">
                  <ProductPill tone="signal">All</ProductPill>
                  <ProductPill>Queued</ProductPill>
                </div>
              </div>
              <div className="grid shrink-0 grid-cols-[1.7fr_.8fr_.7fr] gap-2 border-b border-[#1b3550] bg-[#07101c] px-2.5 py-1.5 font-mono text-[5px] uppercase tracking-[.1em] text-[#8191a1] @xl:px-5 @xl:py-2 @xl:text-[8px]">
                <span>Report</span>
                <span>Category</span>
                <span>Status</span>
              </div>

              {/* Selectable rows — the review panel on the right follows. */}
              <div className="flex min-h-0 flex-1 flex-col divide-y divide-[#1b3550]">
                {reportRows.map((row, index) => {
                  const active = index === selected;
                  return (
                    <button
                      key={row.title}
                      type="button"
                      onClick={() => setSelected(index)}
                      aria-pressed={active}
                      className={`relative grid min-h-0 flex-1 grid-cols-[1.7fr_.8fr_.7fr] items-center gap-2 px-2.5 py-1.5 text-left transition-colors @xl:px-5 @xl:py-2.5 ${
                        active ? "bg-[#a6e86b]/[.05]" : "hover:bg-[#a6e86b]/[.022]"
                      }`}
                    >
                      {active ? (
                        <motion.span
                          layoutId="admin-active-bar"
                          aria-hidden="true"
                          className="absolute inset-y-0 left-0 w-[2px] bg-[#a6e86b]"
                          transition={{ type: "spring", stiffness: 340, damping: 32 }}
                        />
                      ) : null}
                      <span className="text-[6px] font-semibold leading-snug @xl:text-[10px]">{row.title}</span>
                      <span className="text-[5px] text-[#8191a1] @xl:text-[8px]">{row.category}</span>
                      <span className="font-mono text-[5px] text-[#edbd67] @xl:text-[8px]">{row.status}</span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <Reveal className="flex min-h-0 flex-col" index={3} y={14}>
              <Tilt className="flex h-full min-h-0 flex-col" max={3} lift={7}>
                <div className="relative flex h-full min-h-0 flex-col border border-[#1b3550] border-t-[#a6e86b]/25 bg-gradient-to-br from-[#0d1a2b] to-[#091321] p-2.5 shadow-[inset_0_1px_0_rgba(230,237,244,.035)] @xl:p-5">
                  <div className="flex items-start justify-between gap-2 border-b border-[#1b3550] pb-2 @xl:pb-4">
                    <div>
                      <p className="font-mono text-[6px] uppercase tracking-[.12em] text-[#a6e86b] @xl:text-[8px]">Selected example report</p>
                      <AnimatePresence mode="wait">
                        <motion.h2
                          key={report.title}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.28 }}
                          className="mt-1 text-[9px] font-semibold @xl:text-base"
                        >
                          {report.title.replace("Example · ", "")}
                        </motion.h2>
                      </AnimatePresence>
                    </div>
                    <ProductPill tone="warning">{report.status}</ProductPill>
                  </div>

                  <div className="mt-2 flex-1 space-y-2 text-[6px] @xl:mt-4 @xl:space-y-4 @xl:text-[10px]">
                    <div>
                      <p className="font-mono uppercase text-[#8191a1]">Category</p>
                      <p className="mt-1 text-[#c2ccd6]">{report.category}</p>
                    </div>
                    <div>
                      <p className="font-mono uppercase text-[#8191a1]">Evidence</p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={report.evidence}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="mt-1 leading-relaxed"
                        >
                          {report.evidence}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div>
                      <p className="font-mono uppercase text-[#8191a1]">Reviewer note</p>
                      <div className="mt-1 min-h-8 border border-[#1b3550] bg-[#07101c] p-2 text-[#8191a1] @xl:min-h-14">Add context for this decision…</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 @xl:gap-2">
                      <ProductPill tone="signal">Approve</ProductPill>
                      <ProductPill tone="warning">Reject</ProductPill>
                      <ProductPill>Remove</ProductPill>
                    </div>
                  </div>
                  <p className="border-t border-[#1b3550] pt-2 font-mono text-[5px] text-[#8191a1] @xl:pt-3 @xl:text-[8px]">Illustrative content · authors and live report data are not shown.</p>
                  <Glint />
                </div>
              </Tilt>
            </Reveal>
          </section>

          <Reveal as="section" className="flex min-h-0 flex-[.88] flex-col overflow-hidden border border-[#1b3550] border-t-[#a6e86b]/25 bg-gradient-to-br from-[#0d1a2b] to-[#091321] shadow-[inset_0_1px_0_rgba(230,237,244,.035)]" index={4} y={14}>
            <div className="flex items-center justify-between gap-3 border-b border-[#1b3550] px-2.5 py-2 @xl:px-5 @xl:py-3">
              <div>
                <h2 className="font-mono text-[7px] font-bold uppercase tracking-[.14em] text-[#a6e86b] @xl:text-[10px]">Daily quest editor</h2>
                <p className="mt-0.5 text-[6px] text-[#8191a1] @xl:text-[9px]">Quest type and reward values are configured by an administrator.</p>
              </div>
              <div className="flex gap-1.5">
                <ProductPill>Add quest</ProductPill>
                <ProductPill>Reorder</ProductPill>
              </div>
            </div>
            <div className="grid shrink-0 grid-cols-[1.1fr_1.2fr_.8fr_.7fr] gap-2 bg-[#07101c] px-2.5 py-1.5 font-mono text-[5px] uppercase tracking-[.1em] text-[#8191a1] @xl:px-5 @xl:py-2 @xl:text-[8px]">
              <span>Quest type</span>
              <span>Activity</span>
              <span>Reward</span>
              <span>Status</span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col divide-y divide-[#1b3550]">
              {quests.map((quest, index) => (
                <motion.div
                  key={quest.event}
                  className="grid min-h-0 flex-1 grid-cols-[1.1fr_1.2fr_.8fr_.7fr] items-center gap-2 px-2.5 py-1.5 text-[6px] @xl:px-5 @xl:py-2 @xl:text-[9px]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.35 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="font-semibold">{quest.event}</span>
                  <span className="text-[#8191a1]">{quest.activity}</span>
                  <span className="text-[#8191a1]">{quest.reward}</span>
                  <span>
                    <ProductPill>Configurable</ProductPill>
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="flex shrink-0 items-center justify-between border-t border-[#1b3550] px-2.5 py-1.5 @xl:px-5 @xl:py-2">
              <span className="font-mono text-[5px] text-[#8191a1] @xl:text-[8px]">Changes can be applied to today's assignments.</span>
              <ProductPill tone="signal">Apply changes</ProductPill>
            </div>
          </Reveal>
        </main>

        <Reveal as="footer" className="flex shrink-0 items-center justify-between border-t border-[#1b3550] bg-[#050b14] px-4 py-2 font-mono text-[6px] uppercase tracking-[.08em] text-[#6b7885] @xl:px-10 @xl:py-3 @xl:text-[9px]" y={8} blur={3}>
          <span>ALETHIA · ADMIN TOOLS</span>
          <span className="text-[#a6e86b]/75">WEB PROTOTYPE</span>
        </Reveal>
      </div>
    </div>
  );
}
