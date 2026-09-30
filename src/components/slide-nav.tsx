import React, { useCallback, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { Ring } from "@/components/ui/8bit";
import { EdgeRail } from "@/components/ui/motion";
import {
  getCurrentSlideIndex,
  getSlides,
  goToSlideIndex,
  stepSlide,
  subscribeToSlides,
} from "@/utils/face-navigation";

const MONO = "font-grotesk uppercase tracking-[0.2em]";

function useSlidePosition() {
  const subscribe = useCallback((onChange: () => void) => {
    const offSlides = subscribeToSlides(onChange);
    window.addEventListener("hashchange", onChange);
    return () => {
      offSlides();
      window.removeEventListener("hashchange", onChange);
    };
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => {
      const slides = getSlides();
      return `${getCurrentSlideIndex()}:${slides.length}:${slides
        .map((s) => s.name)
        .join("|")}`;
    },
    () => "0:0:",
  );
}

export function SlideNav() {
  const position = useSlidePosition();
  const [rawIndex, rawTotal, namesRaw] = position.split(":");
  const index = Number(rawIndex) || 0;
  const total = Number(rawTotal) || 0;
  const names = namesRaw ? namesRaw.split("|") : [];
  const currentName = names[index] ?? "";
  const nextName = names[index + 1] ?? "";
  const atStart = index <= 0;
  const atEnd = total === 0 || index >= total - 1;

  if (total < 2) return null;

  return (
    <>
      <EdgeRail index={index} total={total} label={currentName} />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[9990] px-3 pb-3 sm:px-5 sm:pb-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="pointer-events-auto relative mx-auto max-w-[1180px] border border-[var(--hairline)] bg-[var(--ink-1)]/92 backdrop-blur-md"
      >
        {/* Hairline progress rail across the top edge — the reference's
            edge-line motif, repurposed as deck position. */}
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--hairline)]">
          <motion.div
            className="h-full bg-[var(--cyan)]"
            initial={false}
            animate={{ width: `${total ? ((index + 1) / total) * 100 : 0}%` }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>

        <div className="flex items-stretch pt-px">
          {/* PREVIOUS */}
          <button
            type="button"
            onClick={() => stepSlide("prev")}
            disabled={atStart}
            aria-label="Previous slide"
            className="u8-dim group flex shrink-0 items-center gap-2.5 border-r border-[var(--hairline)] px-3 py-2.5 disabled:pointer-events-none disabled:opacity-30 sm:px-4"
          >
            <span className="font-grotesk text-[13px] leading-none text-[var(--cyan)] sm:text-[15px]">
              ←
            </span>
            <span className={`${MONO} text-[8px] text-[var(--steel)] sm:text-[9px]`}>
              Prev
            </span>
          </button>

          {/* CURRENT SLIDE */}
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 sm:gap-3.5 sm:px-5">
            <Ring size={14} thickness={0.5} color="var(--cyan)" />
            <span className="font-grotesk text-[11px] leading-none tabular-nums text-[var(--cyan)] sm:text-[13px]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <motion.span
              key={currentName}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
              className={`${MONO} truncate text-[9px] text-[var(--body)] sm:text-[11px]`}
            >
              {currentName}
            </motion.span>
          </div>

          {/* PER-SLIDE PROGRESS */}
          <div className="hidden items-center gap-[3px] border-x border-[var(--hairline)] px-3 sm:flex">
            {names.map((name, i) => (
              <button
                key={name}
                type="button"
                onClick={() => goToSlideIndex(i)}
                aria-label={`Go to ${name}`}
                title={name}
                className="u8-dim py-2.5"
              >
                <span
                  className="block h-[2px] w-4 sm:w-6"
                  style={{
                    background:
                      i === index
                        ? "var(--cyan)"
                        : i < index
                          ? "var(--ink-3)"
                          : "var(--hairline)",
                  }}
                />
              </button>
            ))}
          </div>

          {/* NEXT */}
          <button
            type="button"
            onClick={() => stepSlide("next")}
            disabled={atEnd}
            aria-label="Next slide"
            className="flex shrink-0 items-center gap-3 bg-[var(--cyan)] px-4 py-2.5 transition-opacity duration-300 ease-out-cubic hover:opacity-80 disabled:bg-[var(--ink-3)] sm:px-6"
          >
            <span className="flex flex-col items-start leading-none">
              <span
                className={`${MONO} text-[7px] sm:text-[8px]`}
                style={{ color: atEnd ? "var(--steel)" : "rgba(0,0,0,0.55)" }}
              >
                {atEnd ? "End" : "Next"}
              </span>
              <span
                className={`${MONO} mt-1 max-w-[90px] truncate text-[9px] sm:max-w-none sm:text-[11px]`}
                style={{ color: atEnd ? "var(--steel)" : "var(--ink-0)" }}
              >
                {nextName || "—"}
              </span>
            </span>
            <span
              className="font-grotesk text-[13px] leading-none sm:text-[15px]"
              style={{ color: atEnd ? "var(--steel)" : "var(--ink-0)" }}
            >
              →
            </span>
          </button>
        </div>
      </motion.div>
      </div>
    </>
  );
}
