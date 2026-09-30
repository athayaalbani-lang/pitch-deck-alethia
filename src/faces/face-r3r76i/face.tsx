import React from "react";
import { AlethiaScreen, ProductMetric, ProductPanel, ProductPill } from "@/components/ui/alethia-screen";

const activityCells = Array.from({ length: 126 }, (_, index) => index);

export default function ProfileFace() {
  return (
    <AlethiaScreen active="profile" footer="ALETHIA · LEARNER PROFILE">
      <div className="grid h-full min-h-0 gap-3 @xl:grid-cols-[1.6fr_.9fr] @xl:gap-5">
        <div className="grid min-h-0 grid-rows-[1fr_.78fr_.9fr] gap-3 @xl:gap-5">
          <ProductPanel className="flex min-h-0 flex-col">
            <div className="flex items-center gap-2.5 @xl:gap-5 border-b border-[#263544] pb-2 @xl:pb-4">
              <img alt="" aria-hidden="true" className="h-11 w-11 @xl:h-20 @xl:w-20 rounded-full border border-[#263544] bg-[#0b1420] object-contain p-1.5 @xl:p-3" src="/media/operator-pixel-cutout.svg" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.12em] text-[#a6e86b]">Learner profile</p>
                <h1 className="mt-1 text-sm @xl:text-2xl font-bold">Username</h1>
                <p className="mt-1 text-[7px] @xl:text-[10px] text-[#91a0af]">Bio and social links are optional profile details.</p>
              </div>
              <ProductPill>Edit profile</ProductPill>
            </div>
            <div className="mt-2 @xl:mt-4 grid grid-cols-2 gap-2 @xl:gap-3">
              <ProductMetric label="Level" value="—" note="Account-specific" />
              <ProductMetric label="Modules completed" value="— / 3" note="Practice progress" />
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#263544] pt-2 @xl:pt-4">
              <span className="font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.1em] text-[#91a0af]">Displayed achievements</span>
              <div className="flex gap-1.5 @xl:gap-2">
                {[0, 1, 2, 3].map((index) => <span className="grid h-5 w-5 @xl:h-8 @xl:w-8 place-items-center border border-dashed border-[#364657] text-[7px] @xl:text-[10px] text-[#8191a1]" key={index}>+</span>)}
              </div>
            </div>
          </ProductPanel>

          <ProductPanel className="flex min-h-0 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Activity</h2>
                <p className="mt-1 text-[6px] @xl:text-[9px] text-[#91a0af]">Report activity shown across the recent profile window</p>
              </div>
              <ProductPill>Personal record</ProductPill>
            </div>
            <div className="mt-auto grid grid-flow-col grid-rows-7 gap-[2px] @xl:gap-[3px] w-fit">
              {activityCells.map((cell) => <span className="h-[5px] w-[5px] @xl:h-[9px] @xl:w-[9px] border border-[#263544] bg-[#0b1420]" key={cell} />)}
            </div>
          </ProductPanel>

          <ProductPanel className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">My reports</h2>
                <p className="mt-1 text-[6px] @xl:text-[9px] text-[#91a0af]">Reports submitted by this account</p>
              </div>
              <ProductPill>Reports</ProductPill>
            </div>
            <div className="mt-2 @xl:mt-4 grid flex-1 grid-cols-3 gap-2 @xl:gap-3">
              {["Submitted reports", "Review status", "Investigation notes"].map((label, index) => (
                <div className="flex flex-col justify-between border border-[#263544] bg-[#0b1420] p-2 @xl:p-4" key={label}>
                  <span className="font-mono text-[6px] @xl:text-[9px] uppercase text-[#8191a1]">0{index + 1}</span>
                  <span className="text-[7px] @xl:text-[11px] font-semibold leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </ProductPanel>
        </div>

        <div className="grid min-h-0 grid-rows-[.8fr_1.2fr] gap-3 @xl:gap-5">
          <ProductPanel className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Account</h2>
              <ProductPill>Sign in required</ProductPill>
            </div>
            <dl className="mt-2 @xl:mt-4 space-y-2 @xl:space-y-4">
              <div className="flex items-baseline justify-between gap-3 border-b border-[#263544] pb-1.5 @xl:pb-3"><dt className="font-mono text-[6px] @xl:text-[9px] uppercase text-[#8191a1]">Username</dt><dd className="text-[7px] @xl:text-xs">Account-specific</dd></div>
              <div className="flex items-baseline justify-between gap-3 border-b border-[#263544] pb-1.5 @xl:pb-3"><dt className="font-mono text-[6px] @xl:text-[9px] uppercase text-[#8191a1]">Email</dt><dd className="text-[7px] @xl:text-xs">Private account field</dd></div>
              <div className="flex items-baseline justify-between gap-3"><dt className="font-mono text-[6px] @xl:text-[9px] uppercase text-[#8191a1]">Controls</dt><dd className="text-[7px] @xl:text-xs text-[#a6e86b]">Edit · Sign out</dd></div>
            </dl>
          </ProductPanel>
          <ProductPanel className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Practice mastery</h2>
                <p className="mt-1 text-[6px] @xl:text-[9px] text-[#91a0af]">A summary of current module outcomes</p>
              </div>
              <ProductPill>View insights</ProductPill>
            </div>
            <div className="mt-2 @xl:mt-4 space-y-2 @xl:space-y-4">
              {["Familiar", "Skilled", "Needs practice"].map((state, index) => (
                <div className="flex items-center gap-2 @xl:gap-4" key={state}>
                  <span className="w-20 @xl:w-36 shrink-0 text-[7px] @xl:text-[10px] text-[#d0d9e1]">{state}</span>
                  <div className="h-1.5 @xl:h-2 flex-1 bg-[#263544]"><div className={`h-full ${index === 2 ? "bg-[#d5a45d]" : "bg-[#a6e86b]"} w-0`} /></div>
                  <span className="font-mono text-[6px] @xl:text-[9px] text-[#8191a1]">—</span>
                </div>
              ))}
            </div>
            <p className="mt-auto border-t border-[#263544] pt-2 @xl:pt-4 text-[6px] @xl:text-[9px] leading-relaxed text-[#91a0af]">Public profiles expose a limited set of profile details and community activity. Email and account progress remain private.</p>
          </ProductPanel>
        </div>
      </div>
    </AlethiaScreen>
  );
}
