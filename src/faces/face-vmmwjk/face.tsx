import React from "react";
import { AlethiaScreen, ProductButton, ProductPageHeader, ProductPanel, ProductPill } from "@/components/ui/alethia-screen";

const checkpoints = ["Message arrives", "Inspect", "Verify", "Choose a response", "See the outcome"];

export default function CourierSimulationFace() {
  return (
    <AlethiaScreen active="training" footer="ALETHIA · SAFE SIMULATION · NO REAL DATA IS COLLECTED">
      <div className="flex h-full min-h-0 flex-col gap-3 @xl:gap-5">
        <ProductPageHeader
          title="Courier message"
          description="A simulated delivery message is designed to make you act before you have time to check. Inspect the sender and link, verify through an official channel, then choose a response."
          action={<ProductPill tone="signal">Module 01 · SMS phishing</ProductPill>}
        />
        <ol className="grid shrink-0 grid-cols-5 border-y border-[#263544]">
          {checkpoints.map((checkpoint, index) => <li className={`border-b-2 px-1.5 py-2 @xl:px-3 @xl:py-3 font-mono text-[5px] @xl:text-[9px] ${index === 0 ? "border-[#a6e86b] text-[#a6e86b]" : "border-transparent text-[#8191a1]"}`} key={checkpoint}><span className="mr-1 @xl:mr-2">{index + 1}</span>{checkpoint}</li>)}
        </ol>

        <div className="grid min-h-0 flex-1 gap-3 @xl:grid-cols-[.72fr_1.05fr_1.05fr] @xl:gap-5">
          <ProductPanel className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between gap-2 border-b border-[#263544] pb-2 @xl:pb-4"><h2 className="font-mono text-[7px] @xl:text-[10px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Simulation flow</h2><ProductPill>5 steps</ProductPill></div>
            <div className="mt-2 @xl:mt-4 flex-1 space-y-2 @xl:space-y-4">
              {checkpoints.map((step, index) => <div className="flex items-center gap-2 @xl:gap-3" key={step}><span className={`grid h-5 w-5 @xl:h-8 @xl:w-8 shrink-0 place-items-center rounded-full border font-mono text-[6px] @xl:text-[9px] ${index === 0 ? "border-[#a6e86b] bg-[#a6e86b] text-[#0b1420]" : "border-[#364657] text-[#91a0af]"}`}>{index + 1}</span><span className={`text-[6px] @xl:text-[9px] ${index === 0 ? "font-semibold text-[#edf4f8]" : "text-[#91a0af]"}`}>{step}</span></div>)}
            </div>
            <div className="border-t border-[#263544] pt-2 @xl:pt-4"><p className="font-mono text-[5px] @xl:text-[8px] uppercase tracking-[.12em] text-[#8191a1]">Safe simulation</p><p className="mt-1 text-[6px] @xl:text-[9px] leading-relaxed text-[#a6e86b]">No real parcel, courier, or personal data is involved.</p></div>
          </ProductPanel>

          <ProductPanel className="flex min-h-0 flex-col">
            <div className="mx-auto w-full max-w-[480px] flex-1 overflow-hidden border border-[#364657] bg-[#0a111a] shadow-[0_12px_40px_rgba(0,0,0,.35)]">
              <div className="flex items-center justify-between border-b border-[#263544] bg-[#111c28] px-3 py-2 @xl:px-5 @xl:py-3"><span className="font-mono text-[6px] @xl:text-[9px] uppercase text-[#91a0af]">SMS · Today, 09:41</span><span className="font-mono text-[6px] @xl:text-[9px] text-[#edf4f8]">ParcelPath Desk</span></div>
              <div className="flex h-full flex-col p-3 @xl:p-6">
                <div className="max-w-[90%] border border-[#263544] bg-[#182534] p-2.5 @xl:p-5">
                  <p className="text-[8px] @xl:text-sm leading-relaxed">Your parcel is waiting at a sorting centre.</p>
                  <p className="mt-2 text-[8px] @xl:text-sm leading-relaxed">Confirm before 6:00 PM or the parcel will be returned.</p>
                  <p className="mt-2 @xl:mt-4 rounded border border-[#edbd67]/30 bg-[#edbd67]/[.05] p-2 font-mono text-[7px] @xl:text-[11px] text-[#edbd67]">parcel-check[.]example/confirm</p>
                </div>
                <p className="mt-2 @xl:mt-4 font-mono text-[5px] @xl:text-[8px] uppercase tracking-[.1em] text-[#8191a1]">Fictional message · link safely defanged</p>
                <div className="mt-auto grid gap-1.5 @xl:gap-2 pt-3 @xl:pt-6">
                  <ProductButton>Inspect message</ProductButton>
                  <span className="inline-flex min-h-7 @xl:min-h-10 items-center justify-center border border-[#263544] px-3 font-mono text-[6px] @xl:text-[9px] text-[#91a0af]">Start the 5-step practice</span>
                </div>
              </div>
            </div>
          </ProductPanel>

          <ProductPanel className="flex min-h-0 flex-col">
            <div className="flex items-start justify-between gap-3 border-b border-[#263544] pb-2 @xl:pb-4"><div><h2 className="font-mono text-[7px] @xl:text-[10px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Analyst notes</h2><p className="mt-1 text-[6px] @xl:text-[9px] text-[#91a0af]">Signals the learner can inspect</p></div><img alt="" aria-hidden="true" className="h-8 w-8 @xl:h-12 @xl:w-12 object-contain" src="/media/leveltwo.webp" /></div>
            <div className="mt-2 @xl:mt-4 space-y-2 @xl:space-y-4">
              <div className="border-l-2 border-[#edbd67] bg-[#0b1420] p-2 @xl:p-4"><p className="font-mono text-[6px] @xl:text-[9px] text-[#edbd67]">Sender is not verified</p><p className="mt-1 text-[6px] @xl:text-[10px] leading-relaxed text-[#d0d9e1]">A display name does not prove the message came from a courier.</p></div>
              <div className="border-l-2 border-[#edbd67] bg-[#0b1420] p-2 @xl:p-4"><p className="font-mono text-[6px] @xl:text-[9px] text-[#edbd67]">Domain does not match</p><p className="mt-1 text-[6px] @xl:text-[10px] leading-relaxed text-[#d0d9e1]">Compare the link with the courier's official app or site.</p></div>
            </div>
            <div className="mt-auto border-t border-[#263544] pt-2 @xl:pt-4"><p className="font-mono text-[5px] @xl:text-[8px] uppercase text-[#8191a1]">Choose a response</p><div className="mt-1.5 @xl:mt-3 flex flex-wrap gap-1.5"><ProductPill>Open link</ProductPill><ProductPill tone="signal">Verify officially</ProductPill><ProductPill>Report & delete</ProductPill></div></div>
          </ProductPanel>
        </div>
      </div>
    </AlethiaScreen>
  );
}
