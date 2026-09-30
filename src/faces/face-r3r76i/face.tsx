import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { blocks } from "./face.content.json";
import { Atmosphere } from "@/components/ui/atmosphere";
import { PixelHead, LevelSprites } from "@/components/ui/pixel-art";
import { TextContent } from "@/components/ui/text-content";

/**
 * Profile Page — Your Dossier, Your Controls.
 *
 * A 2x2 card grid over a full-width footer strip. The card structure is the
 * brief; the surface treatment is Alethia's own — lime accent, deck grotesque
 * for the chrome, condensed for the headline — so it sits with the other eleven
 * slides instead of reading as a pasted-in mockup.
 */

const MONO = "font-grotesk uppercase tracking-[0.18em]";
const ACCENT = "var(--cyan)";
const ACCENT_DIM = "rgba(166, 232, 107, 0.28)";

/* ------------------------------------------------------------------ *
 * Card chrome
 * ------------------------------------------------------------------ */

function Panel({
  title,
  icon,
  children,
  delay,
  inView,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="relative min-h-0 min-w-0 flex flex-col border border-[var(--hairline)] bg-[var(--ink-1)] p-3 @xl:p-6"
    >
      {/* Corner tick: the tactical framing motif, one per card. */}
      <span
        className="absolute left-0 top-0 w-3 @xl:w-6 h-[2px]"
        style={{ background: ACCENT }}
        aria-hidden="true"
      />
      <div className="flex items-center gap-2 @xl:gap-3 shrink-0">
        <span style={{ color: ACCENT }}>{icon}</span>
        <span
          className={`${MONO} text-[9px] @xl:text-[17px] font-semibold`}
          style={{ color: ACCENT }}
        >
          {title}
        </span>
      </div>
      <div className="flex-1 min-h-0 mt-2.5 @xl:mt-5 flex flex-col">{children}</div>
    </motion.div>
  );
}

/** Label above a value. Two words at most, per the copy budget. */
function Field({
  k,
  v,
  accent,
}: {
  k: string;
  v: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2 @xl:gap-4 min-w-0">
      <span className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--steel)] shrink-0`}>
        {k}
      </span>
      <span className="flex-1 h-px bg-[var(--line)] translate-y-[-3px]" />
      <span
        className={`font-grotesk text-[9px] @xl:text-[16px] truncate shrink-0 max-w-[62%]`}
        style={{ color: accent ? ACCENT : "var(--ice)" }}
      >
        {v}
      </span>
    </div>
  );
}

/** Tiny stacked-stroke icon, one per card. */
function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="square"
      aria-hidden="true"
      className="shrink-0 @xl:w-[26px] @xl:h-[26px]"
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  /* head + shoulders */
  identity: "M12 3a4 4 0 100 8 4 4 0 000-8zM4 21v-2a6 6 0 0116 0v2",
  /* ascending bars */
  progression: "M3 20h18M6 16v-5M11 16V7M16 16v-8M21 16V4",
  /* document with rules */
  output: "M6 3h8l5 5v13H6zM14 3v5h5M9 13h7M9 17h5",
  /* key */
  account: "M14 7a4 4 0 100 8 4 4 0 000-8zM10 12H3M6 12v3M6 12v-2",
};

/* ------------------------------------------------------------------ *
 * Deterministic filler — no Math.random, so the art never reshuffles
 * between renders or between preview and export.
 * ------------------------------------------------------------------ */

function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/* 18 weeks x 7 days */
const WEEKS = 18;
const GRID = Array.from({ length: WEEKS * 7 }, (_, i) =>
  Math.floor(noise(i + 1) * 5),
);

/* Module mastery: 9 of 12 earned. */
const MODULES = Array.from({ length: 12 }, (_, i) => (i < 9 ? 1 : 0));

/* Per-module report habits, 0..1. */
const HABITS = [0.92, 0.74, 0.58, 0.41];

/* Signal score per latest report, 0..100. */
const SIGNALS = [96, 91, 84, 77, 69];

const RAMP = [
  "var(--navy-3)",
  "rgba(166, 232, 107, 0.22)",
  "rgba(166, 232, 107, 0.45)",
  "rgba(166, 232, 107, 0.72)",
  ACCENT,
];

export default function ProfileFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });

  const habits = blocks.card3.habits.rows;
  const reports = blocks.card3.reports.rows;

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ring="top-left" bokeh={10}>
        <div className="w-full h-full flex flex-col px-4 @xl:px-10 py-3 @xl:py-6">
          {/* ── title ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 @xl:gap-5 pb-2.5 @xl:pb-5 border-b border-[var(--line)] shrink-0">
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4 }}
              style={{ color: ACCENT }}
            >
              <Icon d={ICONS.identity} />
            </motion.span>
            <TextContent
              content={blocks.title.content}
              data-content-keys={["title"]}
              className="font-condensed font-bold text-white uppercase leading-none tracking-[-0.01em] text-[15px] @xl:text-[42px] min-w-0 truncate"
            />
            <span
              className={`${MONO} ml-auto shrink-0 text-[8px] @xl:text-[14px] px-2 @xl:px-4 py-1 @xl:py-2 border`}
              style={{ color: ACCENT, borderColor: ACCENT_DIM }}
            >
              {blocks.routeChip.content}
            </span>
          </div>

          {/* ── 2 x 2 cards ───────────────────────────────────────── */}
          <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-2.5 @xl:gap-5 py-2.5 @xl:py-5">
            {/* 1 — IDENTITY */}
            <Panel
              title={blocks.card1.title}
              icon={<Icon d={ICONS.identity} />}
              delay={0.05}
              inView={inView}
            >
              <div className="flex gap-4 @xl:gap-7 shrink-0 items-center">
                <PixelHead size={150} />
                <div className="min-w-0 flex-1 flex flex-col justify-center gap-1.5 @xl:gap-3">
                  <Field k={blocks.card1.label.content} v={blocks.card1.callSign.content} accent />
                  <Field k={blocks.card1.bioLabel.content} v={blocks.card1.bio.content} />
                  <Field
                    k={blocks.card1.levelLabel.content}
                    v={blocks.card1.level.content}
                    accent
                  />
                </div>
              </div>

              {/* Grid and badges sit side by side: stacked, they overflowed the
                  card once the avatar grew. */}
              <div className="flex-1 min-h-0 flex items-end gap-5 @xl:gap-9 pt-3 @xl:pt-7">
                {/* 18-week activity grid */}
                <div className="shrink-0">
                  <div className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--steel)] mb-1 @xl:mb-2`}>
                    {blocks.card1.gridLabel.content}
                  </div>
                  <div className="grid grid-flow-col grid-rows-7 gap-[2px] @xl:gap-[3px] w-fit">
                    {GRID.map((lvl, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.1 + i * 0.004 }}
                        className="w-[6px] h-[6px] @xl:w-[9px] @xl:h-[9px]"
                        style={{ background: RAMP[lvl] }}
                      />
                    ))}
                  </div>
                </div>

                {/* four earnable badge slots */}
                <div className="shrink-0">
                  <div className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--steel)] mb-1 @xl:mb-2`}>
                    {blocks.card1.badgesLabel.content}
                  </div>
                  <div className="flex gap-1.5 @xl:gap-3 w-fit">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.35, delay: 0.4 + i * 0.07 }}
                        className="block w-[20px] h-[20px] @xl:w-[36px] @xl:h-[36px] border"
                        style={{
                          borderColor: i < 2 ? ACCENT_DIM : "var(--line)",
                          background:
                            i < 2 ? "rgba(166, 232, 107, 0.14)" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            {/* 2 — PROGRESSION */}
            <Panel
              title={blocks.card2.title}
              icon={<Icon d={ICONS.progression} />}
              delay={0.14}
              inView={inView}
            >
              <div className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--steel)] shrink-0`}>
                {blocks.card2.masteryLabel.content}
              </div>
              {/* The rank ladder, as three turning sprites. */}
              <div className="shrink-0 py-1 @xl:py-3">
                <LevelSprites size={54} gap={10} />
              </div>
              {/* mastery rail: one tick per module, 9 of 12 earned */}
              <div className="flex items-end gap-[3px] @xl:gap-2 h-10 @xl:h-24 mt-1.5 @xl:mt-3 shrink-0">
                {MODULES.map((on, i) => (
                  <motion.span
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.045 }}
                    className="flex-1 origin-bottom"
                    style={{
                      height: `${38 + ((i * 37) % 62)}%`,
                      background: on ? ACCENT : "var(--navy-3)",
                      opacity: on ? 0.35 + (i / 12) * 0.65 : 1,
                    }}
                  />
                ))}
              </div>

              {/* points with the server-authoritative level bar */}
              <div className="mt-2.5 @xl:mt-5 shrink-0">
                <Field
                  k={blocks.card2.pointsLabel.content}
                  v={blocks.card2.points.content}
                  accent
                />
                <div
                  className={`${MONO} text-[6px] @xl:text-[11px] text-[var(--steel)] mt-1 @xl:mt-2`}
                >
                  {blocks.card2.authoritative.content}
                </div>
                <div className="h-1.5 @xl:h-3 mt-1 @xl:mt-2 bg-[var(--navy-3)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: "68%" } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full"
                    style={{ background: ACCENT }}
                  />
                </div>
              </div>

              <div className="mt-auto pt-2 @xl:pt-4 shrink-0 flex flex-col gap-1 @xl:gap-2.5">
                <Field k={blocks.card2.modulesLabel.content} v={blocks.card2.modules.content} />
                <Field k={blocks.card2.streakLabel.content} v={blocks.card2.streak.content} accent />
              </div>
            </Panel>

            {/* 3 — OUTPUT */}
            <Panel
              title={blocks.card3.title}
              icon={<Icon d={ICONS.output} />}
              delay={0.23}
              inView={inView}
            >
              <div className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--steel)] shrink-0`}>
                {blocks.card3.habitsLabel.content}
              </div>
              <div className="mt-1.5 @xl:mt-3 flex flex-col gap-1 @xl:gap-2.5 shrink-0">
                {habits.map((h, i) => (
                  <div key={h.id} className="flex items-center gap-2 @xl:gap-4">
                    <span
                      className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--body)] w-[52px] @xl:w-[120px] shrink-0 truncate`}
                    >
                      {h.label}
                    </span>
                    <div className="flex-1 h-1 @xl:h-2 bg-[var(--navy-3)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${HABITS[i] * 100}%` } : {}}
                        transition={{ duration: 0.7, delay: 0.25 + i * 0.08 }}
                        className="h-full"
                        style={{ background: ACCENT, opacity: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-2.5 @xl:pt-5 shrink-0">
                <div className="flex items-baseline justify-between mb-1 @xl:mb-2">
                  <span className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--steel)]`}>
                    {blocks.card3.latestLabel.content}
                  </span>
                  <span className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--steel)]`}>
                    {blocks.card3.signalLabel.content}
                  </span>
                </div>
                <div className="flex flex-col gap-[3px] @xl:gap-1.5">
                  {reports.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.35, delay: 0.35 + i * 0.06 }}
                      className="flex items-center gap-2 @xl:gap-4"
                    >
                      <span
                        className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--body)] shrink-0`}
                      >
                        {r.label}
                      </span>
                      <div className="flex-1 h-px bg-[var(--line)]" />
                      <span
                        className="font-grotesk text-[8px] @xl:text-[14px] tabular-nums shrink-0"
                        style={{ color: i === 0 ? ACCENT : "var(--steel)" }}
                      >
                        {SIGNALS[i]}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Panel>

            {/* 4 — ACCOUNT */}
            <Panel
              title={blocks.card4.title}
              icon={<Icon d={ICONS.account} />}
              delay={0.32}
              inView={inView}
            >
              <div className="flex flex-col gap-1.5 @xl:gap-3 shrink-0">
                <Field
                  k={blocks.card4.userLabel.content}
                  v={blocks.card4.username.content}
                  accent
                />
                <Field k={blocks.card4.mailLabel.content} v={blocks.card4.mail.content} />
                <Field k={blocks.card4.authLabel.content} v={blocks.card4.auth.content} accent />
              </div>

              <div className="mt-auto pt-3 @xl:pt-6 flex items-center gap-2 @xl:gap-4 shrink-0">
                <span
                  className={`${MONO} text-[8px] @xl:text-[14px] px-2.5 @xl:px-6 py-1 @xl:py-2.5 border`}
                  style={{ color: ACCENT, borderColor: ACCENT_DIM }}
                >
                  {blocks.card4.edit.content}
                </span>
                <span
                  className={`${MONO} text-[8px] @xl:text-[14px] px-2.5 @xl:px-6 py-1 @xl:py-2.5 border border-[var(--line)] text-[var(--steel)]`}
                >
                  {blocks.card4.signOut.content}
                </span>
              </div>
            </Panel>
          </div>

          {/* ── full-width footer strip ───────────────────────────── */}
          <div className="shrink-0 border-t border-[var(--line)] pt-2.5 @xl:pt-5 flex items-center gap-4 @xl:gap-10">
            <div className="flex items-baseline gap-2 @xl:gap-4 min-w-0">
              <span className={`${MONO} text-[8px] @xl:text-[15px] shrink-0`} style={{ color: ACCENT }}>
                {blocks.footer.editRoute.content}
              </span>
              <span
                className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--steel)] truncate`}
              >
                {blocks.footer.editList.content}
              </span>
            </div>
            <div className="flex-1 h-px bg-[var(--line)]" />
            <div className="flex items-baseline gap-2 @xl:gap-4 min-w-0">
              <span className={`${MONO} text-[8px] @xl:text-[15px] shrink-0`} style={{ color: ACCENT }}>
                {blocks.footer.publicRoute.content}
              </span>
              <span className={`${MONO} text-[7px] @xl:text-[12px] text-[var(--steel)] truncate`}>
                {blocks.footer.publicList.content}
              </span>
            </div>
            <div className="flex-1 h-px bg-[var(--line)]" />
            <span
              className={`${MONO} text-[8px] @xl:text-[15px] shrink-0 text-right`}
              style={{ color: ACCENT }}
            >
              {blocks.footer.pii.content}
            </span>
          </div>
        </div>
      </Atmosphere>
    </div>
  );
}
