import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Row = { label: string; value: string };

const PALETTE = ["var(--cyan)", "var(--cyan)", "var(--amber)"];

function RingTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div
      className="border border-[var(--line)] bg-[var(--navy-1)] px-3 py-2 font-mono"
      style={{ boxShadow: "0 0 18px rgba(0,0,0,0.5)" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0"
          style={{ background: d.color }}
        />
        <span className="text-[var(--muted)] text-xs @xl:text-base uppercase tracking-[0.1em]">
          {d.label}
        </span>
        <span
          className="font-semibold text-xs @xl:text-base tabular-nums"
          style={{ color: d.color }}
        >
          {d.value}%
        </span>
      </div>
    </div>
  );
}

export default function RadialBarViz({
  rows,
  activeIndex = -1,
}: {
  rows: Row[];
  activeIndex?: number;
}) {
  const data = rows.map((r, i) => ({
    label: r.label,
    value: Number(r.value) || 0,
    color: PALETTE[i % PALETTE.length],
  }));

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            innerRadius="34%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            barSize={14}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <Tooltip cursor={false} content={<RingTooltip />} />
            <RadialBar
              dataKey="value"
              background={{ fill: "var(--navy-4)" }}
              cornerRadius={0}
              animationDuration={900}
            >
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.color}
                  fillOpacity={
                    activeIndex < 0 || activeIndex === i ? 1 : 0.22
                  }
                />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
