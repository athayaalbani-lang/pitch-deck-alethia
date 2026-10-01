import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Row = { label: string; value: string };

const PALETTE = [
  "var(--cyan)",
  "var(--cyan)",
  "var(--ice)",
  "var(--cyan)",
  "var(--cyan)",
];

export default function DonutChartViz({
  rows,
  activeIndex = -1,
  onSelect,
}: {
  rows: Row[];
  activeIndex?: number;
  onSelect?: (i: number) => void;
}) {
  const data = rows.map((r, i) => ({
    label: r.label,
    value: Number(r.value) || 0,
    color: PALETTE[i % PALETTE.length],
  }));
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * Math.PI) / 180;
    const y = cy + radius * Math.sin(-midAngle * Math.PI) / 180;
    const pct = Math.round((value / total) * 100);
    if (pct < 6) return null;
    const dim = activeIndex >= 0 && activeIndex !== index;
    return (
      <text
        x={x}
        y={y}
        fill={dim ? "var(--navy-2)" : "var(--navy-0)"}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-mono @xl:text-lg"
        style={{ fontWeight: 600, opacity: dim ? 0.45 : 1 }}
      >
        {pct}%
      </text>
    );
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="58%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="var(--navy-0)"
              strokeWidth={3}
              labelLine={false}
              label={renderLabel}
              animationDuration={900}
              onClick={(_, index: number) => onSelect?.(index)}
              style={{ cursor: onSelect ? "pointer" : "default" }}
            >
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.color}
                  fillOpacity={activeIndex < 0 || activeIndex === i ? 1 : 0.22}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
