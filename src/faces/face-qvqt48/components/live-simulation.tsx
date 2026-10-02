import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * Live simulation — a split screen of what arrives, and what we do
 *
 * The MVP rail lists what the product ships. This shows the thing shipping
 * *do*: one pane is the message as it lands, the other is the machine reading
 * it. They are deliberately unequal — the inbound pane is larger, because the
 * point of the split is that a human reads the big side first and only then
 * looks at what the machine already concluded.
 *
 * It cycles on `setInterval` rather than on animation frames or CSS alone. The
 * deck's entrance already depends on timers for the same reason: a backgrounded
 * tab suspends rAF entirely, and a CSS animation would freeze mid-sequence with
 * no way to advance. Timers keep running, so the loop always completes and the
 * pane never rests on a half-finished step.
 *
 * All senders, domains and figures are invented. The scenarios are the kind of
 * message the product is meant to catch, not records of real incidents.
 * ------------------------------------------------------------------ */

type Signal = string;

export interface Scenario {
  id: string;
  channel: string;
  from: string;
  message: string;
  signals: Signal[];
  call: string;
  score: string;
  verdict: string;
}

const MONO = "font-terminal uppercase tracking-[0.14em]";

/** Per-step dwell. The verdict gets longer so the eye can land on it. */
const SIGNAL_MS = 1000;
const VERDICT_MS = 2100;

export function LiveSimulation({
  scenarios,
}: {
  scenarios: Scenario[];
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const timer = useRef<number | null>(null);

  const scenario = scenarios[index % scenarios.length];
  const total = scenario.signals.length;
  /* Signals revealed, then one further step that stands for the verdict. */
  const step = Math.min(revealed, total);
  const showVerdict = revealed > total;

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (revealed > total) {
        setIndex((i) => (i + 1) % scenarios.length);
        setRevealed(0);
      } else {
        setRevealed((r) => r + 1);
      }
    }, revealed > total ? VERDICT_MS : SIGNAL_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [revealed, total, index, scenarios.length]);

  const score = Number(scenario.score);

  return (
    <div className="border border-[var(--line)] bg-[var(--space-panel)]">
      {/* Split-screen header. The rule between the panes is the only chrome. */}
      <div className="flex items-center justify-between border-b border-[var(--line)] px-3 py-2">
        <span className={`${MONO} text-[7px] text-[var(--ink-muted)]`}>
          Live simulation
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--lime)] motion-safe:animate-pulse"
            aria-hidden="true"
          />
          <span className={`${MONO} text-[7px] text-[var(--lime)]`}>Running</span>
        </span>
      </div>

      <div className="grid grid-cols-2">
        {/* LEFT — inbound */}
        <div className="border-r border-[var(--line)] p-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`${MONO} bg-[var(--space-raised)] px-1.5 py-0.5 text-[7px] text-[var(--lime)]`}
            >
              {scenario.channel}
            </span>
            <span className={`${MONO} truncate text-[7px] text-[var(--ink-muted)]`}>
              {scenario.from}
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-snug text-[var(--ink-soft)]">
            {scenario.message}
          </p>
        </div>

        {/* RIGHT — what the model made of it */}
        <div className="flex flex-col p-3">
          <span className={`${MONO} text-[7px] text-[var(--ink-muted)]`}>Signals</span>
          <ul className="mt-1.5 flex flex-col gap-1">
            {scenario.signals.map((s, i) => (
              <li
                key={s}
                className={`flex items-start gap-1.5 text-[9px] leading-snug transition-opacity duration-300 ${
                  i < step ? "opacity-100" : "opacity-25"
                }`}
              >
                <span
                  className={`mt-[3px] inline-block h-1 w-1 shrink-0 transition-colors duration-300 ${
                    i < step ? "bg-[var(--lime)]" : "bg-[var(--ink-faint)]"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={
                    i < step ? "text-[var(--ink-soft)]" : "text-[var(--ink-faint)]"
                  }
                >
                  {s}
                </span>
              </li>
            ))}
          </ul>

          {/* Verdict lands only after every signal has been read. */}
          <div className="mt-auto pt-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className={`${MONO} text-[7px] text-[var(--ink-muted)]`}>
                Confidence
              </span>
              <span
                className={`${MONO} text-[11px] transition-colors duration-300 ${
                  showVerdict ? "text-[var(--lime)]" : "text-[var(--ink-faint)]"
                }`}
              >
                {scenario.score}
              </span>
            </div>
            {/* Confidence meter. Width tracks the reveal so it fills as the
                signals are read rather than jumping at the end. */}
            <div className="mt-1 h-[3px] w-full bg-[var(--space-raised)]">
              <div
                className="h-full bg-[var(--lime)] transition-[width] duration-500 ease-out"
                style={{
                  width: `${Math.round(
                    (showVerdict ? score : (step / total) * score) * 100,
                  )}%`,
                }}
              />
            </div>
            <p
              className={`${MONO} mt-2 text-[7px] leading-snug transition-opacity duration-300 ${
                showVerdict ? "opacity-100" : "opacity-0"
              } ${showVerdict ? "text-[var(--lime)]" : ""}`}
            >
              {showVerdict ? `${scenario.call} · ${scenario.verdict}` : "\u00a0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveSimulation;