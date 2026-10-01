import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlethiaScreen, ProductPanel, ProductPill } from "@/components/ui/alethia-screen";
import { Reveal, Sprite3D, Tilt } from "@/components/ui/anim";

/* Per-module practice record. `habits` mirrors the three-step method the deck
   teaches throughout: inspect, verify, report. A `null` habit is one the
   learner has not reached yet — the module shows as not started. */
const modules = [
  {
    no: "01",
    title: "Courier SMS Phishing",
    tag: "Module 01 · SMS phishing",
    habits: ["Inspect", "Verify", "Report"],
    state: "Completed",
  },
  {
    no: "02",
    title: "Marketplace Social Engineering",
    tag: "Module 02 · Social engineering",
    habits: ["Inspect", "Verify", null],
    state: "Completed",
  },
  {
    no: "03",
    title: "Risky Document Analysis",
    tag: "Module 03 · Analysis document",
    habits: [],
    state: "Not started",
  },
] as const;

const tabs = [
  { label: "Submitted reports", note: "Reports this account has contributed to the community feed." },
  { label: "Review status", note: "Where each submitted report currently sits in the review queue." },
  { label: "Investigation notes", note: "Reasoning recorded alongside an investigator's decision." },
];

/* The activity trace is a shape, not a measurement — the deck reports no real
   numbers, so the series is generated from a fixed formula. It stays low and
   quiet for most of the window and rises at the end, which is the shape a
   short streak actually makes. */
function buildTrace(points: number) {
  return Array.from({ length: points }, (_, index) => {
    const t = index / (points - 1);
    const drift = 12 + Math.sin(index * 0.4) * 3.5 + t * 5;
    return t > 0.9 ? drift + (t - 0.9) * 430 : drift;
  });
}

const TRACE = buildTrace(46);

export default function ProfileFace() {
  const [tab, setTab] = useState(0);
  const modulesDone = modules.filter((module) => module.state === "Completed").length;

  return (
    <AlethiaScreen active="profile" footer="ALETHIA · LEARNER PROFILE">
      <div className="grid h-full min-h-0 gap-3 @xl:grid-cols-[1.62fr_.88fr] @xl:gap-5">
        {/* Left column: identity card, then per-module activity. */}
        <div className="grid min-h-0 grid-rows-[auto_1fr] gap-3 @xl:gap-5">
          <Reveal y={12}>
            <Tilt max={2.5} lift={6}>
              <ProductPanel className="flex flex-col gap-3 p-3 @xl:gap-5 @xl:p-6">
                <div className="flex flex-wrap items-start gap-3 @xl:gap-6">
                  <Sprite3D
                    alt=""
                    className="h-16 w-16 shrink-0 @xl:h-28 @xl:w-28"
                    depth={13}
                    float={3}
                    sway={6}
                    spin
                    src="/media/operator-pixel-cutout.svg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[6px] uppercase tracking-[.16em] text-[#a6e86b] @xl:text-[10px]">Level 02 · Investigator</p>
                    <h1 className="mt-1.5 text-lg font-bold tracking-[-.02em] @xl:text-[30px]">Username</h1>
                    <p className="mt-1 text-[7px] leading-relaxed text-[#8191a1] @xl:text-[11px]">Bio and social links are optional profile details.</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 @xl:mt-4">
                      <span className="rounded-[var(--rw-radius)] border border-[#263544] px-2 py-1 font-mono text-[6px] uppercase tracking-[.1em] text-[#c2ccd6] transition-colors hover:border-[#a6e86b]/50 hover:text-[#a6e86b] @xl:px-3 @xl:py-1.5 @xl:text-[9px]">
                        Profile link ↗
                      </span>
                      <span className="rounded-[var(--rw-radius)] border border-[#a6e86b]/45 bg-[#a6e86b]/[.08] px-2 py-1 font-mono text-[6px] font-bold uppercase tracking-[.1em] text-[#a6e86b] @xl:px-3 @xl:py-1.5 @xl:text-[9px]">
                        Edit profile
                      </span>
                    </div>
                  </div>
                </div>

                {/* Practice trace — a line chart, drawn so the path is visible
                    rather than boxed in a grid of cells. */}
                <div className="border-t border-[#263544] pt-2.5 @xl:pt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-mono text-[6px] uppercase tracking-[.12em] text-[#8191a1] @xl:text-[9px]">Practice trace</p>
                    <p className="font-mono text-[6px] text-[#a6e86b] @xl:text-[9px]">{modulesDone} active days</p>
                  </div>
                  <PracticeTrace />
                </div>
              </ProductPanel>
            </Tilt>
          </Reveal>

          <Reveal className="flex min-h-0 flex-col" index={1} y={14}>
            <ProductPanel className="flex h-full min-h-0 flex-col">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-mono text-[8px] font-bold uppercase tracking-[.14em] text-[#a6e86b] @xl:text-[12px]">Activity per module</h2>
                  <p className="mt-1 text-[7px] text-[#8191a1] @xl:mt-2 @xl:text-[12px]">Every finished module is recorded together with the habits you used.</p>
                </div>
                <ProductPill tone="signal">Training modules</ProductPill>
              </div>

              <ul className="mt-2.5 flex min-h-0 flex-1 flex-col justify-around @xl:mt-4">
                {modules.map((module, index) => {
                  const done = module.state === "Completed";
                  return (
                    <motion.li
                      key={module.no}
                      className="flex min-h-0 items-center gap-2.5 border-l-2 border-l-[#263544] pl-2.5 transition-colors hover:border-l-[#a6e86b]/60 @xl:gap-5 @xl:pl-5"
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.25 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="font-mono text-[7px] text-[#8191a1] @xl:text-[11px]">{module.no}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[9px] font-semibold @xl:text-[16px]">{module.title}</h3>
                        <p className="mt-0.5 font-mono text-[5px] uppercase tracking-[.1em] text-[#6b7885] @xl:text-[9px]">{module.tag}</p>
                        {module.habits.length > 0 ? (
                          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 font-mono text-[6px] @xl:mt-2 @xl:gap-x-3 @xl:text-[10px]">
                            {module.habits.map((habit, habitIndex) => (
                              <span className="flex items-center gap-1" key={habit}>
                                <span className="text-[#a6e86b]">{habit}</span>
                                <span className={habit ? "text-[#a6e86b]" : "text-[#4d5a67]"}>{habit ? "✓" : "·"}</span>
                                {habitIndex < module.habits.length - 1 ? <span className="text-[#4d5a67]">·</span> : null}
                              </span>
                            ))}
                          </p>
                        ) : (
                          <p className="mt-1 text-[6px] text-[#6b7885] @xl:mt-2 @xl:text-[10px]">Start one module to see your first report.</p>
                        )}
                      </div>
                      <span
                        className={`shrink-0 font-mono text-[6px] uppercase tracking-[.1em] @xl:text-[9px] ${
                          done ? "text-[#a6e86b]" : "text-[#6b7885]"
                        }`}
                      >
                        {module.state}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </ProductPanel>
          </Reveal>
        </div>

        {/* Right column: identity, progress, and the report tabs. */}
        <div className="grid min-h-0 grid-rows-[.72fr_1fr_.86fr] gap-3 @xl:gap-5">
          <Reveal className="flex min-h-0 flex-col" index={2} y={12}>
            <ProductPanel className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-mono text-[8px] font-bold uppercase tracking-[.14em] text-[#a6e86b] @xl:text-[11px]">Account identity</h2>
                <ProductPill>Sign in required</ProductPill>
              </div>
              <dl className="mt-auto space-y-1.5 @xl:mt-3 @xl:space-y-3">
                {[
                  { term: "Username", detail: "Account-specific" },
                  { term: "Email", detail: "Private account field" },
                ].map((row) => (
                  <div className="flex items-baseline justify-between gap-3 border-b border-[#263544] pb-1 @xl:pb-2" key={row.term}>
                    <dt className="font-mono text-[6px] uppercase tracking-[.1em] text-[#8191a1] @xl:text-[9px]">{row.term}</dt>
                    <dd className="truncate text-[7px] text-[#c2ccd6] @xl:text-[12px]">{row.detail}</dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="font-mono text-[6px] uppercase tracking-[.1em] text-[#8191a1] @xl:text-[9px]">Controls</dt>
                  <dd className="text-[7px] text-[#a6e86b] @xl:text-[12px]">Edit · Sign out</dd>
                </div>
              </dl>
            </ProductPanel>
          </Reveal>

          <Reveal className="flex min-h-0 flex-col" index={3} y={12}>
            <ProductPanel className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-mono text-[8px] font-bold uppercase tracking-[.14em] text-[#a6e86b] @xl:text-[11px]">Your progress</h2>
                <ProductPill tone="signal">View insights</ProductPill>
              </div>

              <div className="mt-2 space-y-1.5 @xl:mt-4 @xl:space-y-3">
                <ProgressRule delay={0.1} label="Familiar" />
                <ProgressRule delay={0.22} label="Skilled" />
                <ProgressRule delay={0.34} label="Needs practice" tone="#edbd67" />
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[#263544] pt-2 @xl:mt-4 @xl:pt-4">
                <div className="border-l-2 border-l-[#a6e86b] pl-2 @xl:pl-4">
                  <p className="font-mono text-[5px] uppercase tracking-[.1em] text-[#8191a1] @xl:text-[8px]">Modules completed</p>
                  <p className="mt-0.5 font-mono text-[11px] font-bold tabular-nums @xl:text-[19px]">{modulesDone} / 3</p>
                </div>
                <div className="border-l-2 border-l-[#a6e86b] pl-2 @xl:pl-4">
                  <p className="font-mono text-[5px] uppercase tracking-[.1em] text-[#8191a1] @xl:text-[8px]">Practice streak</p>
                  <p className="mt-0.5 font-mono text-[11px] font-bold tabular-nums @xl:text-[19px]">{modulesDone} days</p>
                </div>
              </div>

              <p className="mt-2 text-[6px] leading-relaxed text-[#6b7885] @xl:mt-3 @xl:text-[9px]">
                Public profiles expose a limited set of profile details and community activity. Email and account progress remain private.
              </p>
            </ProductPanel>
          </Reveal>

          <Reveal className="flex min-h-0 flex-col" index={4} y={12}>
            <ProductPanel className="flex h-full min-h-0 flex-col">
              <h2 className="font-mono text-[8px] font-bold uppercase tracking-[.14em] text-[#a6e86b] @xl:text-[11px]">My reports</h2>
              <div className="mt-1.5 flex flex-wrap gap-1 @xl:mt-3">
                {tabs.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setTab(index)}
                    aria-pressed={tab === index}
                    className={`rounded-[var(--rw-radius)] border px-1.5 py-0.5 font-mono text-[5px] uppercase tracking-[.08em] transition-colors @xl:px-2.5 @xl:py-1 @xl:text-[8px] ${
                      tab === index ? "border-[#a6e86b]/55 bg-[#a6e86b]/[.08] text-[#a6e86b]" : "border-transparent text-[#6b7885] hover:text-[#c2ccd6]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="relative mt-1.5 min-h-0 flex-1 border-l-2 border-l-[#263544] pl-2.5 @xl:mt-3 @xl:pl-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tabs[tab].label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-full flex-col justify-center"
                  >
                    <p className="text-[8px] font-semibold leading-tight @xl:text-[13px]">{tabs[tab].label}</p>
                    <p className="mt-1 text-[6px] leading-relaxed text-[#8191a1] @xl:mt-2 @xl:text-[10px]">{tabs[tab].note}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </ProductPanel>
          </Reveal>
        </div>
      </div>
    </AlethiaScreen>
  );
}

/* The line chart itself: a single lime path that draws in on arrival, with a
   soft area wash beneath it and a marker on the latest point.

   The path is authored in a fixed 0 0 100 46 viewBox and stretched with
   `preserveAspectRatio="none"`, so `vector-effect` keeps the stroke uniform.
   The end marker deliberately sits outside the SVG — a non-uniform scale would
   turn a circle into an ellipse. */
function PracticeTrace() {
  const height = 46;
  const max = Math.max(...TRACE);
  const min = Math.min(...TRACE);
  const span = max - min || 1;
  const step = 100 / (TRACE.length - 1);

  const points = TRACE.map((value, index) => {
    const x = index * step;
    const y = height - ((value - min) / span) * (height - 8) - 4;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const line = `M${points.join(" L")}`;
  const area = `${line} L100,${height} L0,${height} Z`;
  const [lastX, lastY] = points[points.length - 1].split(",").map(Number);

  return (
    <div className="relative mt-1.5 h-[46px] @xl:mt-3 @xl:h-[92px]">
      <svg className="h-full w-full" preserveAspectRatio="none" viewBox={`0 0 100 ${height}`}>
        <defs>
          <linearGradient id="trace-wash" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a6e86b" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#a6e86b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#trace-wash)" />
        <motion.path
          d={line}
          fill="none"
          stroke="#a6e86b"
          strokeLinecap="round"
          strokeLinejoin="round"
          /* Width is in viewBox units, not pixels: the chart is stretched
             horizontally to fill the panel, and `vector-effect` cannot be used
             here — it makes motion's `pathLength` dash pattern resolve in the
             stretched space, which renders the line as broken dashes. */
          strokeWidth={0.32}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.35, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 5px rgba(166,232,107,.5))" }}
        />
      </svg>

      <motion.span
        aria-hidden="true"
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a6e86b] @xl:h-2.5 @xl:w-2.5"
        style={{
          left: `${lastX}%`,
          top: `${(lastY / height) * 100}%`,
          boxShadow: "0 0 10px 3px rgba(166,232,107,.55)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.75, ease: [0.33, 1, 0.68, 1] }}
      />
    </div>
  );
}

/* A single rule per mastery state. The sweep is a travelling highlight, not a
   fill — the deck reports no mastery figures, so a bar would assert one. */
function ProgressRule({ label, delay, tone = "#a6e86b" }: { label: string; delay: number; tone?: string }) {
  return (
    <div className="mt-1 flex items-center gap-2 @xl:mt-2 @xl:gap-3">
      <span className="min-w-0 flex-1 truncate text-[7px] text-[#c2ccd6] @xl:text-[11px]">{label}</span>
      <span className="relative h-px flex-1 bg-[#263544] @xl:h-[2px]">
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 w-1/3"
          style={{ background: `linear-gradient(90deg, transparent, ${tone}, transparent)` }}
          initial={{ x: "-120%" }}
          animate={{ x: "420%" }}
          transition={{ duration: 2.6, delay, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
        />
      </span>
      <span className="shrink-0 font-mono text-[6px] text-[#6b7885] @xl:text-[9px]">—</span>
    </div>
  );
}
