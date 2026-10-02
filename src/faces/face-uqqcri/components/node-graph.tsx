import React from "react";
import { motion } from "motion/react";
import { TextContent } from "@/components/ui/text-content";

/**
 * The product-areas node graph.
 *
 * A single lime curve climbing from PRACTICE through PROGRESS to REPORTS, with
 * a dashed spur dropping to ADMIN TOOLS. Rendered either as a bounded panel or
 * as a full-bleed background layer (`fill`) behind slide content.
 *
 * The curve is drawn in a 0 0 100 100 viewBox stretched with
 * `preserveAspectRatio="none"`, so `vector-effect: non-scaling-stroke` is
 * essential — without it the non-uniform scale would distort the stroke width.
 */
export function NodeGraph({
  active,
  nodes,
  adminLabel,
  /** Stretch edge to edge as a background layer instead of a boxed panel. */
  fill = false,
  /** Multiplies the whole scene's opacity — for use behind foreground content. */
  dim = 1,
  /* Draw only the curve and its waypoints. Used where the graph is a faint
     texture behind artwork rather than a panel, where the opaque ground and
     grid would read as a stray box. */
  bare = false,
}: {
  active: boolean;
  nodes: string[];
  adminLabel: string;
  fill?: boolean;
  dim?: number;
  bare?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${
        fill ? "h-full w-full" : "h-full w-full rounded-[var(--rw-radius)] border border-[#263544]"
      }`}
      style={{
        opacity: dim,
        backgroundColor: bare ? "transparent" : "#080b10",
        backgroundImage: bare
          ? undefined
          : "linear-gradient(to right, rgba(166,232,107,.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(166,232,107,.055) 1px, transparent 1px)",
        backgroundSize: fill ? "64px 64px" : "48px 48px",
      }}
    >
      {/* Bloom behind the curve so the lime reads as emitted light. */}
      {!bare && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(166,232,107,0.10) 0%, rgba(166,232,107,0.03) 45%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M13 86 C20 88 26 82 34 76 C56 58 70 32 84 16"
          stroke="#a6e86b"
          strokeWidth={fill ? 5 : 4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 0 10px rgba(166,232,107,.65))" }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M84 16 C92 34 92 60 82 76"
          stroke="#8593a1"
          strokeWidth={1.5}
          strokeDasharray="5 7"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.75 } : {}}
          transition={{ duration: 1.1, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      {/* Waypoints on the curve. */}
      {[
        { x: "13%", y: "86%", label: nodes[0] },
        { x: "34%", y: "76%", label: nodes[1] },
        { x: "84%", y: "16%", label: nodes[2] },
      ].map((node, i) => (
        <motion.div
          key={node.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: node.x, top: node.y }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={active ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.55 + i * 0.22, ease: [0.33, 1, 0.68, 1] }}
        >
          <div className="flex flex-col items-center gap-1.5 @xl:gap-3">
            <motion.span
              className={fill ? "block h-4 w-4 @xl:h-7 @xl:w-7 rounded-full" : "block h-3 w-3 rounded-full"}
              style={{
                background: "#a6e86b",
                boxShadow: "0 0 18px 6px rgba(166,232,107,.55), 0 0 44px 14px rgba(166,232,107,.22)",
              }}
              animate={active ? { scale: [1, 1.14, 1] } : {}}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            />
            <TextContent
              content={node.label}
              className={`font-mono uppercase whitespace-nowrap text-[var(--ice)] ${
                fill ? "text-[8px] @xl:text-[15px] tracking-[0.18em]" : "text-[11px] tracking-[0.14em]"
              }`}
            />
          </div>
        </motion.div>
      ))}

      {/* Terminal waypoint on the dashed spur. */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: "82%", top: "76%" }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 1.1, ease: [0.33, 1, 0.68, 1] }}
      >
        <div className="flex flex-col items-center gap-1.5 @xl:gap-3">
          <span
            className={fill ? "block h-3.5 w-3.5 @xl:h-6 @xl:w-6 rounded-full border border-[#8593a1]" : "block h-3 w-3 rounded-full border border-[#8593a1]"}
          />
          <TextContent
            content={adminLabel}
            className={`font-mono uppercase whitespace-nowrap text-[var(--steel)] ${
              fill ? "text-[8px] @xl:text-[15px] tracking-[0.18em]" : "text-[11px] tracking-[0.14em]"
            }`}
          />
        </div>
      </motion.div>
    </div>
  );
}