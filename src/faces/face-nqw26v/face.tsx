import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Lock } from "lucide-react";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Overline, Ring } from "@/components/ui/8bit";
import { Capsule } from "@/components/ui/sbs";
import { TextContent } from "@/components/ui/text-content";

const MONO = "font-grotesk uppercase tracking-[0.18em]";

// The artboard is a fixed 1920x1080 canvas that gets scaled down, so the
// @xl sizes below are deliberately larger than they look here.
const SIGNAL_COLORS: Record<string, string> = {
  high: "var(--red)",
  medium: "var(--amber)",
  low: "var(--steel)",
};

const STATE_COLORS: Record<string, string> = {
  queued: "var(--steel)",
  escalated: "var(--amber)",
  resolved: "var(--green)",
};

const ACTION_COLORS = ["var(--cyan)", "var(--red)", "var(--steel)"];

const DECISION_RESULT = [
  "Report published. The reporter stays anonymous.",
  "Report rejected. The ledger keeps the record.",
  "Held for a second reviewer.",
];

export default function AdminConsoleFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });

  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState(0);
  const [selected, setSelected] = useState(0);
  const [decision, setDecision] = useState(-1);
  const [note, setNote] = useState("");
  const [inactive, setInactive] = useState<number[]>([]);
  const [applied, setApplied] = useState(false);
  const [log, setLog] = useState<{ id: string; text: string; color: string }[]>(
    [],
  );

  const radius = controls.windowRadius?.value ?? 14;
  const tabs = blocks.tabs.rows;
  const filters = blocks.filters.rows;
  const reports = blocks.reports.rows;
  const quests = blocks.quests.rows;
  const ledger = blocks.ledger.rows;
  const actions = blocks.actions.rows;
  const questActions = blocks.questActions.rows;
  const sections = blocks.sections.rows;

  const visible =
    filter === 0
      ? reports
      : reports.filter((r) => r.state === filters[filter].label.toLowerCase());

  const report = visible[selected] ?? visible[0] ?? reports[0];
  const reportIndex = visible.findIndex((r) => r.id === report?.id);

  const activeAssignments = quests.reduce(
    (sum, q, i) =>
      sum +
      (inactive.includes(i) ? 0 : Number(q.assignments.replace(/,/g, "")) || 0),
    0,
  );

  const toggleQuest = (i: number) =>
    setInactive((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ghost="⌘" ring="bottom-right">
      <div className="w-full h-full flex flex-col @xl:flex-row">
      {/* LEFT — NARRATIVE */}
      <div className="@xl:w-[27%] shrink-0 bg-[var(--navy-1)] border-b @xl:border-b-0 @xl:border-r border-[var(--line)] px-5 @xl:px-9 py-4 @xl:py-7 flex flex-col min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <div className="flex items-center gap-2 @xl:gap-4">
            <Ring size={18} thickness={0.4} color="var(--cyan)" />
            <Overline>
              <TextContent content={blocks.label.content} data-content-keys={["label"]} />
            </Overline>
            <div className="flex-1 border-t border-[var(--hairline)] min-w-[10px]" />
          </div>
          <TextContent
            content={blocks.headline.content}
            data-content-keys={["headline"]}
            className="font-condensed font-semibold text-white text-[24px] @xl:text-[46px] leading-[0.98] tracking-[-0.02em] mt-2 @xl:mt-4"
          />
        </motion.div>

        <TextContent
          content={blocks.body.content}
          data-content-keys={["body"]}
          className="font-grotesk text-[var(--muted)] text-[10px] @xl:text-[15px] leading-snug mt-3 @xl:mt-5"
        />

        {/* TWO SECTIONS */}
        <div className="mt-5 @xl:mt-9 flex flex-col gap-2 @xl:gap-3">
          {sections.map((sec, i) => {
            const c = i === 0 ? "var(--cyan)" : "var(--steel)";
            return (
              <motion.button
                key={sec.id}
                type="button"
                onClick={() => setTab(i)}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}
                className="text-left bg-[var(--navy-3)] border-l-[3px] px-3 @xl:px-6 py-2 @xl:py-4"
                style={{
                  borderLeftColor: c,
                  outline: tab === i ? `1px solid ${c}` : "1px solid transparent",
                }}
              >
                <div className="flex items-baseline gap-2 @xl:gap-4">
                  <span className={`${MONO} text-[8px] @xl:text-[13px]`} style={{ color: c }}>
                    {sec.index}
                  </span>
                  <TextContent
                    content={sec.label}
                    data-content-keys={[`sections.rows.${i}.label`]}
                    className={`font-condensed font-semibold text-[var(--ice)] text-[12px] @xl:text-[22px] leading-none`}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* LEDGER */}
        <div className="mt-4 @xl:mt-auto pt-3 @xl:pt-6 border-t border-[var(--line)]">
          <div className="grid grid-cols-2 gap-px bg-[var(--line)]">
            {ledger.map((l, i) => (
              <div
                key={l.id}
                className="bg-[var(--navy-2)] px-2.5 @xl:px-5 py-1.5 @xl:py-3.5"
              >
                <TextContent
                  content={l.key}
                  data-content-keys={[`ledger.rows.${i}.key`]}
                  className={`${MONO} text-[var(--steel)] text-[7px] @xl:text-[11px] truncate`}
                />
                <TextContent
                  content={l.value}
                  data-content-keys={[`ledger.rows.${i}.value`]}
                  className="font-condensed font-semibold text-[18px] @xl:text-[28px] leading-none mt-0.5 @xl:mt-1.5"
                  style={{
                    color: [
                      "var(--cyan)",
                      "var(--cyan)",
                      "var(--cyan)",
                      "var(--steel)",
                    ][i],
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — CONSOLE */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col p-2 @xl:p-5">
        <div
          className="flex-1 min-h-0 flex flex-col bg-[var(--navy-1)] border border-[var(--line)] overflow-hidden"
          style={{ borderRadius: radius * 0.25 }}
        >
          {/* TITLE BAR */}
          <div className="flex items-center gap-2 @xl:gap-4 h-9 @xl:h-14 px-3 @xl:px-5 border-b border-[var(--line)] bg-[var(--navy-2)] shrink-0">
            <div className="flex gap-2 @xl:gap-3">
              {["var(--red)", "var(--amber)", "var(--cyan)"].map((c) => (
                <span
                  key={c}
                  className="w-2.5 h-2.5 @xl:w-4 @xl:h-4"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 @xl:gap-3 min-w-0">
              <Lock
                className="text-[var(--cyan)] shrink-0 w-3 h-3 @xl:w-5 @xl:h-5"
                strokeWidth={2.5}
              />
              <TextContent
                content={blocks.addressBar.content}
                data-content-keys={["addressBar"]}
                className={`${MONO} text-[var(--ice)] text-[9px] @xl:text-[15px] truncate`}
              />
            </div>
            <TextContent
              content="Live"
              className={`${MONO} text-[var(--green)] text-[8px] @xl:text-[12px] shrink-0`}
            />
          </div>

          {/* TABS as floating capsules, matching the reference hotspots. */}
          <div className="flex flex-wrap items-center gap-2 @xl:gap-4 border-b border-[var(--line)] shrink-0 px-4 @xl:px-8 py-2.5 @xl:py-5">
            {tabs.map((t, i) => (
              <Capsule
                key={t.id}
                size="sm"
                tilt={i % 2 === 0 ? -2 : 2}
                dimmed={tab !== i}
                onClick={() => setTab(i)}
              >
                <TextContent
                  content={t.label}
                  data-content-keys={[`tabs.rows.${i}.label`]}
                />
              </Capsule>
            ))}
          </div>

          {tab === 0 ? (
            /* ---------- REPORT REVIEW ---------- */
            <div className="flex-1 min-h-0 flex flex-col @xl:flex-row">
              {/* table */}
              <div className="flex-1 min-w-0 min-h-0 flex flex-col border-b @xl:border-b-0 @xl:border-r border-[var(--line)]">
                {/* filters */}
                <div className="flex gap-px bg-[var(--line)] border-b border-[var(--line)] shrink-0">
                  {filters.map((f, i) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFilter(i);
                        setSelected(0);
                        setDecision(-1);
                      }}
                      className="flex-1 py-1.5 @xl:py-3"
                      style={{ background: filter === i ? "var(--navy-4)" : "var(--navy-1)" }}
                    >
                      <TextContent
                        content={f.label}
                        data-content-keys={[`filters.rows.${i}.label`]}
                        className={`${MONO} text-[8px] @xl:text-[13px]`}
                        style={{ color: filter === i ? "var(--cyan)" : "var(--steel)" }}
                      />
                    </button>
                  ))}
                </div>

                {/* column header */}
                <div className="hidden @xl:flex gap-3 px-4 @xl:px-6 py-1.5 @xl:py-3 bg-[var(--navy-2)] border-b border-[var(--line)] shrink-0">
                  <span className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[12px] w-[54px] shrink-0`}>
                    Id
                  </span>
                  <span className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[12px] flex-1`}>
                    Report
                  </span>
                  <span className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[12px] w-[70px] shrink-0`}>
                    Signal
                  </span>
                  <span className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[12px] w-[80px] shrink-0`}>
                    State
                  </span>
                  <span className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[12px] w-[56px] shrink-0 text-right`}>
                    Age
                  </span>
                </div>

                {/* rows */}
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                  {visible.map((r, i) => {
                    const isSel = reportIndex === i;
                    const sc = SIGNAL_COLORS[r.signal] ?? "var(--steel)";
                    const stc = STATE_COLORS[r.state] ?? "var(--steel)";
                    return (
                      <motion.button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelected(i);
                          setDecision(-1);
                        }}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                        className="relative flex-1 min-h-0 flex flex-col @xl:flex-row @xl:items-center gap-0.5 @xl:gap-3 px-3 @xl:px-6 text-left border-b border-[var(--line)]"
                        style={{
                          background: isSel ? "var(--navy-3)" : "var(--navy-1)",
                          borderLeft: `3px solid ${isSel ? "var(--cyan)" : "var(--line)"}`,
                        }}
                      >
                        <span
                          className={`${MONO} text-[8px] @xl:text-[12px] w-[54px] shrink-0`}
                          style={{ color: isSel ? "var(--cyan)" : "var(--steel)" }}
                        >
                          {r.id.toUpperCase()}
                        </span>
                        <TextContent
                          content={r.title}
                          data-content-keys={[`reports.rows.${reports.indexOf(r)}.title`]}
                          className={`${MONO} text-[9px] @xl:text-[15px] flex-1 truncate`}
                          style={{ color: isSel ? "var(--ice)" : "var(--body)" }}
                        />
                        <span
                          className={`${MONO} text-[8px] @xl:text-[12px] w-[70px] shrink-0 uppercase`}
                          style={{ color: sc }}
                        >
                          {r.signal}
                        </span>
                        <span
                          className={`${MONO} text-[8px] @xl:text-[12px] w-[80px] shrink-0 uppercase`}
                          style={{ color: stc }}
                        >
                          {r.state}
                        </span>
                        <span
                          className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[12px] w-[56px] shrink-0 text-right tabular-nums`}
                        >
                          {r.age}
                        </span>
                      </motion.button>
                    );
                  })}
                  {visible.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                      <TextContent
                        content="No reports in this state"
                        className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-[15px]`}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* decision panel */}
              <div className="@xl:w-[43%] shrink-0 bg-[var(--navy-2)] flex flex-col min-h-0">
                <div className="px-3 @xl:px-6 py-2.5 @xl:py-5 border-b border-[var(--line)] shrink-0">
                  <TextContent
                    content={blocks.detailHeading.content}
                    data-content-keys={["detailHeading"]}
                    className={`${MONO} text-[var(--cyan)] text-[9px] @xl:text-[14px]`}
                  />
                  <TextContent
                    content={report?.title ?? ""}
                    className="font-condensed font-semibold text-white text-[14px] @xl:text-[26px] leading-tight mt-1 @xl:mt-2.5"
                  />
                  <div className="flex flex-wrap gap-1.5 @xl:gap-3 mt-2 @xl:mt-4">
                    {[
                      {
                        k: "Signal",
                        v: report?.signal,
                        c: SIGNAL_COLORS[report?.signal ?? ""] ?? "var(--steel)",
                      },
                      {
                        k: "State",
                        v: report?.state,
                        c: STATE_COLORS[report?.state ?? ""] ?? "var(--steel)",
                      },
                      { k: "Age", v: report?.age, c: "var(--muted)" },
                    ].map((m) => (
                      <span
                        key={m.k}
                        className={`${MONO} text-[8px] @xl:text-[12px] px-2 @xl:px-3 py-1 @xl:py-1.5 border border-[var(--line)]`}
                      >
                        <span className="text-[var(--steel)]">{m.k} </span>
                        <span style={{ color: m.c }}>{m.v}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* actions */}
                <div className="px-3 @xl:px-6 py-2.5 @xl:py-5 border-b border-[var(--line)] shrink-0">
                  <div className="grid grid-cols-3 gap-2 @xl:gap-3">
                    {actions.map((a, i) => {
                      const on = decision === i;
                      const c = ACTION_COLORS[i];
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                          setDecision(i);
                          setLog((prev) => [
                            {
                              id: `${report?.id}-${prev.length}`,
                              text: `${report?.id.toUpperCase()} · ${a.label}`,
                              color: c,
                            },
                            ...prev,
                          ]);
                        }}
                          className="border py-1.5 @xl:py-3.5 transition-colors"
                          style={{
                            borderColor: on ? c : "var(--line)",
                            background: on ? c : "transparent",
                          }}
                        >
                          <TextContent
                            content={a.label}
                            data-content-keys={[`actions.rows.${i}.label`]}
                            className={`${MONO} text-[8px] @xl:text-[13px]`}
                            style={{ color: on ? "var(--navy-0)" : c }}
                          />
                        </button>
                      );
                    })}
                  </div>
                  {decision >= 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${MONO} text-[8px] @xl:text-[12px] mt-2 @xl:mt-3`}
                      style={{ color: ACTION_COLORS[decision] }}
                    >
                      {DECISION_RESULT[decision]}
                    </motion.div>
                  )}
                </div>

                {/* note */}
                <div className="flex-1 min-h-0 px-3 @xl:px-6 py-2.5 @xl:py-5 flex flex-col gap-2 @xl:gap-3">
                  <div>
                    <TextContent
                      content={blocks.noteLabel.content}
                      data-content-keys={["noteLabel"]}
                      className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[12px] mb-1.5 @xl:mb-2`}
                    />
                    <div className="border border-[var(--line)] bg-[var(--navy-1)] p-2.5 @xl:p-4 min-h-[54px] @xl:min-h-[92px]">
                      {note ? (
                        <TextContent
                          content={note}
                          className={`${MONO} text-[9px] @xl:text-[14px] leading-snug`}
                          style={{ color: "var(--ice)" }}
                        />
                      ) : (
                        <TextContent
                          content={blocks.noteValue.content}
                          data-content-keys={["noteValue"]}
                          className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-[14px] leading-snug`}
                        />
                      )}
                    </div>
                  </div>

                  {/* session log */}
                  <div className="flex-1 min-h-0 flex flex-col">
                    <TextContent
                      content={blocks.historyHeading.content}
                      data-content-keys={["historyHeading"]}
                      className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[12px] mb-1.5 @xl:mb-2`}
                    />
                    <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-px bg-[var(--line)] border border-[var(--line)]">
                      {log.length === 0 ? (
                        <div
                          className="flex-1 flex items-center px-2.5 @xl:px-4"
                          style={{ background: "var(--navy-1)" }}
                        >
                          <TextContent
                            content="No decision taken this session"
                            className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[12px]`}
                          />
                        </div>
                      ) : (
                        log.slice(0, 5).map((entry) => (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 @xl:gap-3 px-2.5 @xl:px-4 py-1 @xl:py-2 shrink-0"
                            style={{ background: "var(--navy-1)" }}
                          >
                            <span
                              className="w-1.5 h-1.5 @xl:w-2 @xl:h-2 shrink-0"
                              style={{ background: entry.color }}
                            />
                            <span
                              className={`${MONO} text-[8px] @xl:text-[12px] truncate`}
                              style={{ color: "var(--ice)" }}
                            >
                              {entry.text}
                            </span>
                            <span
                              className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[11px] ml-auto shrink-0`}
                            >
                              written
                            </span>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 @xl:gap-3 mt-2 @xl:mt-4 shrink-0">
                  {["Note kept", "Clear"].map((l, i) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() =>
                        setNote(
                          i === 0
                            ? "Signal holds. Escalating to the playbook."
                            : "",
                        )
                      }
                      className="flex-1 border border-[var(--line)] py-1.5 @xl:py-3"
                    >
                      <span
                        className={`${MONO} text-[8px] @xl:text-[12px]`}
                        style={{ color: i === 0 ? "var(--cyan)" : "var(--steel)" }}
                      >
                        {l}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ---------- QUEST EDITOR ---------- */
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                {quests.map((q, i) => {
                  const off = inactive.includes(i);
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: 14 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                      className="relative flex-1 min-h-0 flex flex-col @xl:flex-row @xl:items-center gap-0.5 @xl:gap-5 px-3 @xl:px-6 py-1.5 @xl:py-3.5 border-b border-[var(--line)]"
                      style={{
                        background: off ? "var(--navy-0)" : "var(--navy-1)",
                        borderLeft: `3px solid ${off ? "var(--steel)" : "var(--cyan)"}`,
                      }}
                    >
                      <span
                        className={`${MONO} text-[8px] @xl:text-[13px] w-[30px] shrink-0`}
                        style={{ color: "var(--steel)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <TextContent
                        content={q.name}
                        data-content-keys={[`quests.rows.${i}.name`]}
                        className={`font-condensed font-semibold text-[12px] @xl:text-[21px] leading-none flex-1 truncate ${off ? "line-through" : ""}`}
                        style={{ color: off ? "var(--steel)" : "var(--ice)" }}
                      />
                      <TextContent
                        content={q.mechanic}
                        data-content-keys={[`quests.rows.${i}.mechanic`]}
                        className={`${MONO} text-[8px] @xl:text-[13px] truncate @xl:w-[32%]`}
                        style={{ color: "var(--muted)" }}
                      />
                      <span
                        className={`${MONO} text-[9px] @xl:text-[15px] tabular-nums shrink-0`}
                        style={{ color: off ? "var(--steel)" : "var(--amber)" }}
                      >
                        {q.points} pts
                      </span>
                      <span
                        className={`${MONO} text-[8px] @xl:text-[12px] tabular-nums w-[64px] shrink-0 text-right`}
                        style={{ color: off ? "var(--steel)" : "var(--cyan)" }}
                      >
                        {off ? "—" : q.assignments}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleQuest(i)}
                        className="shrink-0 border px-2 @xl:px-4 py-1 @xl:py-2 ml-auto @xl:ml-0"
                        style={{ borderColor: off ? "var(--line)" : "var(--red)" }}
                      >
                        <span
                          className={`${MONO} text-[8px] @xl:text-[12px]`}
                          style={{ color: off ? "var(--steel)" : "var(--red)" }}
                        >
                          {off ? "Off" : "On"}
                        </span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* quest actions */}
              <div className="shrink-0 border-t border-[var(--line)] bg-[var(--navy-2)] px-3 @xl:px-6 py-2 @xl:py-4 flex flex-col @xl:flex-row @xl:items-center gap-2 @xl:gap-4">
                <div className="grid grid-cols-4 @xl:flex gap-2 @xl:gap-3 flex-1">
                  {questActions.map((a, i) => {
                    const c = [
                      "var(--cyan)",
                      "var(--cyan)",
                      "var(--red)",
                      "var(--cyan)",
                    ][i];
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => i === 3 && setApplied(true)}
                        className="border px-2 @xl:px-6 py-1.5 @xl:py-3"
                        style={{ borderColor: "var(--line)" }}
                      >
                        <TextContent
                          content={a.label}
                          data-content-keys={[`questActions.rows.${i}.label`]}
                          className={`${MONO} text-[8px] @xl:text-[13px]`}
                          style={{ color: c }}
                        />
                      </button>
                    );
                  })}
                </div>
                <motion.div
                  key={`${inactive.length}-${applied}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="shrink-0 @xl:w-[34%]"
                >
                  <TextContent
                    content={`${inactive.length} quest${
                      inactive.length === 1 ? "" : "s"
                    } deactivated · ${activeAssignments.toLocaleString()} assignments active`}
                    className={`${MONO} text-[8px] @xl:text-[12px]`}
                    style={{
                      color: inactive.length ? "var(--red)" : "var(--steel)",
                    }}
                  />
                </motion.div>
              </div>
            </div>
          )}

          {/* STATUS BAR */}
          <div className="shrink-0 border-t border-[var(--line)] bg-[var(--navy-2)] px-3 @xl:px-6 py-1.5 @xl:py-3 flex items-center justify-between gap-4">
            <TextContent
              content={blocks.status.content}
              data-content-keys={["status"]}
              className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[12px] truncate`}
            />
            {tab === 1 && applied && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${MONO} text-[8px] @xl:text-[12px] shrink-0`}
                style={{ color: "var(--green)" }}
              >
                <TextContent
                  content={blocks.applyResult.content}
                  data-content-keys={["applyResult"]}
                />
              </motion.span>
            )}
          </div>
        </div>
      </div>
      </div>
      </Atmosphere>
    </div>
  );
}
