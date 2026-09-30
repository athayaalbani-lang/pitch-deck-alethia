import React from "react";
import { AlethiaScreen, ProductMetric, ProductPageHeader, ProductPanel, ProductPill } from "@/components/ui/alethia-screen";

const achievements = [
  { title: "First practice completed", group: "Practice module", image: "/media/levelone.webp" },
  { title: "First community report", group: "Community", image: "/media/leveltwo.webp" },
  { title: "Seven-day practice streak", group: "Consistency", image: "/media/levelthree.webp" },
];

export default function TrainingInsightFace() {
  return (
    <AlethiaScreen active="insights" footer="ALETHIA · LEARNING INSIGHTS">
      <div className="flex h-full min-h-0 flex-col gap-3 @xl:gap-5">
        <ProductPageHeader
          title="Practice insights"
          description="Review practice outcomes, habits, achievements, and progress over time. Values belong to the signed-in learner."
          action={<ProductPill>Personal learning record</ProductPill>}
        />
        <dl className="grid shrink-0 grid-cols-2 gap-2 @xl:grid-cols-4 @xl:gap-3">
          <ProductMetric label="Modules completed" value="— / 3" note="Account-specific" />
          <ProductMetric label="Current mastery" value="—" note="Familiar · Skilled · Needs practice" />
          <ProductMetric label="Practice streak" value="—" note="Built from learner activity" />
          <ProductMetric label="Achievements" value="—" note="Earned through activity" />
        </dl>
        <div className="grid min-h-0 flex-1 gap-3 @xl:grid-cols-[1.15fr_.85fr] @xl:gap-5">
          <ProductPanel className="flex min-h-0 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Observed practice habits</h2>
                <p className="mt-1 text-[7px] @xl:text-[10px] text-[#91a0af]">Inspect · verify · report</p>
              </div>
              <ProductPill>Feedback, not certification</ProductPill>
            </div>
            <div className="mt-3 @xl:mt-6 grid min-h-0 flex-1 grid-rows-3 gap-2 @xl:gap-4">
              {[
                { title: "Inspect the sender and route", description: "Practised in phishing and document scenarios" },
                { title: "Verify through an official channel", description: "Review your choices after each practice run" },
                { title: "Report a suspicious pattern", description: "Contribute a report to the community feed" },
              ].map((habit, index) => (
                <div className="flex min-h-0 flex-col justify-center border border-[#263544] bg-[#0b1420] p-2.5 @xl:p-5" key={habit.title}>
                  <div className="flex items-center gap-2 @xl:gap-4">
                    <span className="grid h-6 w-6 @xl:h-10 @xl:w-10 shrink-0 place-items-center border border-[#a6e86b]/35 bg-[#a6e86b]/[.06] font-mono text-[8px] @xl:text-xs text-[#a6e86b]">0{index + 1}</span>
                    <div className="min-w-0">
                      <h3 className="text-[8px] @xl:text-sm font-semibold">{habit.title}</h3>
                      <p className="mt-1 text-[6px] @xl:text-[10px] text-[#91a0af]">{habit.description}</p>
                    </div>
                    <span className="ml-auto font-mono text-[6px] @xl:text-[9px] uppercase text-[#8191a1]">Account data</span>
                  </div>
                  <div className="ml-8 @xl:ml-14 mt-2 @xl:mt-4 h-1 @xl:h-1.5 bg-[#263544]"><div className="h-full w-0 bg-[#a6e86b]" /></div>
                </div>
              ))}
            </div>
          </ProductPanel>

          <div className="grid min-h-0 grid-rows-[.8fr_1.2fr] gap-3 @xl:gap-5">
            <ProductPanel className="flex min-h-0 flex-col">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Practice streak</h2>
                <span className="font-mono text-[8px] @xl:text-xs text-[#edf4f8]">— days</span>
              </div>
              <div className="mt-auto grid grid-cols-7 gap-1 @xl:gap-2 pt-3 @xl:pt-5">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <div className="text-center" key={`${day}-${index}`}><span className="mx-auto block h-4 @xl:h-8 w-full border border-[#263544] bg-[#0b1420]" /><span className="mt-1 block font-mono text-[6px] @xl:text-[9px] text-[#8191a1]">{day}</span></div>)}
              </div>
            </ProductPanel>
            <ProductPanel className="flex min-h-0 flex-col">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Achievements</h2>
                  <p className="mt-1 text-[6px] @xl:text-[9px] text-[#91a0af]">Examples of activity-based achievements</p>
                </div>
                <ProductPill>Per learner</ProductPill>
              </div>
              <div className="mt-2 @xl:mt-4 grid min-h-0 flex-1 grid-cols-3 gap-2 @xl:gap-3">
                {achievements.map((achievement) => (
                  <div className="flex min-w-0 flex-col items-center justify-center border border-[#263544] bg-[#0b1420] p-1.5 @xl:p-3 text-center" key={achievement.title}>
                    <img alt="" aria-hidden="true" className="h-8 w-8 @xl:h-14 @xl:w-14 object-contain opacity-70" src={achievement.image} />
                    <p className="mt-1 @xl:mt-2 text-[6px] @xl:text-[10px] font-semibold leading-tight">{achievement.title}</p>
                    <span className="mt-1 font-mono text-[5px] @xl:text-[8px] uppercase tracking-[.08em] text-[#8191a1]">{achievement.group}</span>
                  </div>
                ))}
              </div>
            </ProductPanel>
          </div>
        </div>
      </div>
    </AlethiaScreen>
  );
}
