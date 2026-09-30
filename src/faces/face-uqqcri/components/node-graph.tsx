import React from "react";
import { motion } from "motion/react";
import { TextContent } from "@/components/ui/text-content";

export function NodeGraph({
  active,
  nodes,
  adminLabel,
}: {
  active: boolean;
  nodes: string[];
  adminLabel: string;
}) {
  return (
    <div
      className="relative w-full h-full border border-[var(--line)] overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--navy-4) 1px, transparent 1px), linear-gradient(to bottom, var(--navy-4) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 260" preserveAspectRatio="none">
        <motion.path
          d="M60 200 C120 200 120 120 190 120 C260 120 260 60 330 60"
          fill="none"
          stroke="var(--cyan)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={active ? { pathLength: 1, opacity: 0.9 } : {}}
          transition={{ duration: 1.6, ease: "easeInOut", delay: 0.4 }}
        />
        <path
          d="M330 60 C360 60 360 200 330 200"
          fill="none"
          stroke="var(--steel)"
          strokeWidth="1"
          strokeDasharray="4 5"
        />
      </svg>

      {[
        { x: "15%", y: "77%" },
        { x: "47.5%", y: "46%" },
        { x: "82.5%", y: "23%" },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
          style={{ left: pos.x, top: pos.y }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={active ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 + i * 0.3 }}
        >
          <div
            className="w-4 h-4 rounded-full bg-[var(--cyan)]"
            style={{ boxShadow: "0 0 18px 4px var(--cyan)" }}
          />
          <TextContent
            content={nodes[i] ?? ""}
            className="font-mono uppercase tracking-[0.14em] text-[var(--ice)] text-[11px] whitespace-nowrap"
          />
        </motion.div>
      ))}

      <div className="absolute left-[82.5%] top-[77%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-[var(--navy-4)] border border-[var(--steel)]" />
        <TextContent
          content={adminLabel}
          className="font-mono uppercase tracking-[0.14em] text-[var(--steel)] text-[11px]"
        />
      </div>
    </div>
  );
}
