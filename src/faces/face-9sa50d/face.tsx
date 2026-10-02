import React from "react";
import { AlethiaScreen, ProductMetric, ProductPageHeader, ProductPanel, ProductPill } from "@/components/ui/alethia-screen";
import { Glint, Reveal, ScanBar, Sprite3D, Tilt } from "@/components/ui/anim";

const achievements = [
  { title: "First practice completed", group: "Practice module", image: "/media/levelone.webp" },
  { title: "First community report", group: "Community", image: "/media/leveltwo.webp" },
  { title: "Seven-day practice streak", group: "Consistency", image: "/media/levelthree.webp" },
];

const metrics = [
  { label: "Modules completed", value: "— / 3", note: "Account-specific" },
  { label: "Current mastery", value: "—", note: "Familiar · Skilled · Needs practice" },
  { label: "Practice streak", value: "—", note: "Built from learner activity" },
  { label: "Achievements", value: "—", note: "Earned through activity" },
];

const habits = [
  { title: "Inspect the sender and route", description: "Practised in phishing and document scenarios" },
  { title: "Verify through an official channel", description: "Review your choices after each practice run" },
  { title: "Report a suspicious pattern", description: "Contribute a report to the community feed" },
];

const days = ["M", "T", "W", "T", "F", "S", "S"];

export default function TrainingInsightFace() {
  return (
    <AlethiaScreen active="insights" footer="ALETHIA · LEARNING INSIGHTS">
      <div className="flex h-full min-h-0 flex-col gap-3 @xl:gap-5">
        <Reveal as="div" blur={4} y={10}>
          <ProductPageHeader
            title="Practice insights"
            description="Review practice outcomes, habits, achievements, and progress over time. Values belong to the signed-in learner."
            action={<ProductPill>Personal learning record</ProductPill>}
          />
        </Reveal>

        <Reveal as="dl" className="grid shrink-0 grid-cols-2 gap-2 @xl:grid-cols-4 @xl:gap-3" index={1} y={12}>
          {metrics.map((metric, index) => (
            <Reveal as="div" index={index} key={metric.label} y={10}>
              <ProductMetric label={metric.label} value={metric.value} note={metric.note} />
            </Reveal>
          ))}
        </Reveal>

        <div className="grid min-h-0 flex-1 gap-3 @xl:grid-cols-[1.15fr_.85fr] @xl:gap-5">
          <Reveal className="flex min-h-0 flex-col" index={2} y={14}>
            <ProductPanel className="flex h-full min-h-0 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[var(--lime)]">Observed practice habits</h2>
                  <p className="mt-1 text-[7px] @xl:text-[10px] text-[var(--ink-muted)]">Inspect · verify · report</p>
                </div>
                <ProductPill>Feedback, not certification</ProductPill>
              </div>
              <div className="mt-3 @xl:mt-6 grid min-h-0 flex-1 grid-rows-3 gap-2 @xl:gap-4">
                {habits.map((habit, index) => (
                  <Reveal className="flex min-h-0 flex-col justify-center border border-[var(--space-line)] bg-[var(--space-panel)] p-2.5 @xl:p-5" index={index} key={habit.title} step={0.1} y={12}>
                    <div className="flex items-center gap-2 @xl:gap-4">
                      <span className="grid h-6 w-6 @xl:h-10 @xl:w-10 shrink-0 place-items-center border border-[var(--lime)]/35 bg-[var(--lime)]/[.06] font-mono text-[8px] @xl:text-xs text-[var(--lime)]">0{index + 1}</span>
                      <div className="min-w-0">
                        <h3 className="text-[8px] @xl:text-sm font-semibold">{habit.title}</h3>
                        <p className="mt-1 text-[6px] @xl:text-[10px] text-[var(--ink-muted)]">{habit.description}</p>
                      </div>
                      <span className="ml-auto font-mono text-[6px] @xl:text-[9px] uppercase text-[var(--ink-muted)]">Account data</span>
                    </div>
                    {/* Shimmer rather than a fill: no mastery percentage is shown
                        on this slide, so the track must not imply one. */}
                    <ScanBar className="ml-8 mt-2 h-1 @xl:ml-14 @xl:mt-4 @xl:h-1.5 bg-[var(--space-line)]" delay={index * 0.2} />
                  </Reveal>
                ))}
              </div>
            </ProductPanel>
          </Reveal>

          <div className="grid min-h-0 grid-rows-[.8fr_1.2fr] gap-3 @xl:gap-5">
            <Reveal className="flex min-h-0 flex-col" index={3} y={14}>
              <Tilt className="flex h-full min-h-0 flex-col" max={4} lift={8}>
                <ProductPanel className="relative flex h-full min-h-0 flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[var(--lime)]">Practice streak</h2>
                    <span className="font-mono text-[8px] @xl:text-xs text-[var(--ink)]">— days</span>
                  </div>
                  <div className="mt-auto grid grid-cols-7 gap-1 pt-3 @xl:gap-2 @xl:pt-5">
                    {days.map((day, index) => (
                      <div className="text-center" key={`${day}-${index}`}>
                        <ScanBar className="mx-auto block h-4 w-full border border-[var(--space-line)] bg-[var(--space-panel)] @xl:h-8" delay={index * 0.13} duration={2.4} />
                        <span className="mt-1 block font-mono text-[6px] @xl:text-[9px] text-[var(--ink-muted)]">{day}</span>
                      </div>
                    ))}
                  </div>
                  <Glint />
                </ProductPanel>
              </Tilt>
            </Reveal>

            <Reveal className="flex min-h-0 flex-col" index={4} y={14}>
              <ProductPanel className="flex h-full min-h-0 flex-col">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[var(--lime)]">Achievements</h2>
                    <p className="mt-1 text-[6px] @xl:text-[9px] text-[var(--ink-muted)]">Examples of activity-based achievements</p>
                  </div>
                  <ProductPill>Per learner</ProductPill>
                </div>
                <div className="mt-2 grid min-h-0 flex-1 grid-cols-3 gap-2 @xl:mt-4 @xl:gap-3">
                  {achievements.map((achievement, index) => (
                    <Reveal className="flex min-w-0 flex-col items-center justify-center border border-[var(--space-line)] bg-[var(--space-panel)] p-1.5 text-center @xl:p-3" index={index} key={achievement.title} step={0.1} y={14}>
                      <Tilt className="flex h-full w-full flex-col items-center justify-center" max={7} lift={10}>
                        <Sprite3D
                          alt=""
                          className="h-8 w-8 @xl:h-14 @xl:w-14"
                          depth={13}
                          float={4}
                          glow="var(--signal-info)"
                          src={achievement.image}
                        />
                        <p className="mt-1 text-[6px] font-semibold leading-tight @xl:mt-2 @xl:text-[10px]">{achievement.title}</p>
                        <span className="mt-1 font-mono text-[5px] uppercase tracking-[.08em] text-[var(--ink-muted)] @xl:text-[8px]">{achievement.group}</span>
                      </Tilt>
                    </Reveal>
                  ))}
                </div>
              </ProductPanel>
            </Reveal>
          </div>
        </div>
      </div>
    </AlethiaScreen>
  );
}
