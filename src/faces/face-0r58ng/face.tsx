import React from "react";
import { AlethiaScreen, ProductMetric, ProductPageHeader, ProductPanel, ProductPill } from "@/components/ui/alethia-screen";
import { Glint, Reveal, ScanBar, Sprite3D, Tilt } from "@/components/ui/anim";

const modules = [
  { title: "Courier SMS Phishing", copy: "Inspect a delivery message before choosing a response.", image: "/media/sms-phishing-cutout.webp", status: "Module 01" },
  { title: "Marketplace Social Engineering", copy: "Notice trust shifts and unusual requests in a conversation.", image: "/media/social-engineering-cutout.webp", status: "Module 02" },
  { title: "Risky Document Analysis", copy: "Check a file's source and details before opening it.", image: "/media/malicious.webp", status: "Module 03" },
];

const metrics = [
  { label: "Points", value: "—", note: "From account activity" },
  { label: "Level", value: "—", note: "Progression" },
  { label: "Modules complete", value: "— / 3", note: "Guided practice path" },
  { label: "Reports in review", value: "—", note: "Community reports" },
];

const week = [0, 1, 2, 3, 4, 5, 6];

export default function DashboardFace() {
  return (
    <AlethiaScreen active="dashboard">
      <div className="flex h-full min-h-0 flex-col gap-3 @xl:gap-5">
        <Reveal as="div" blur={4} y={10}>
          <ProductPageHeader
            title="Welcome"
            description="Build the habit of pausing, checking, and verifying. This dashboard brings practice and personal progress together."
          />
        </Reveal>

        <Reveal as="div" className="relative shrink-0" index={1} y={12}>
          <Tilt max={2.5} lift={6}>
            <ProductPanel className="relative p-2.5 @xl:p-4">
              <div className="flex items-center gap-3 @xl:gap-5">
                <Sprite3D
                  alt=""
                  className="h-10 w-10 shrink-0 @xl:h-16 @xl:w-16"
                  depth={10}
                  float={3}
                  sway={5}
                  spin
                  src="/media/operator-pixel-cutout.svg"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[7px] @xl:text-[10px] uppercase tracking-[.14em] text-[#a6e86b]">Achievement update</p>
                  <p className="mt-1 text-[10px] @xl:text-base font-semibold">New achievements appear here as you practise.</p>
                  <p className="mt-0.5 text-[7px] @xl:text-[10px] text-[#8191a1]">Examples shown in this presentation are illustrative; learner records vary.</p>
                </div>
                <ProductPill>Personal record</ProductPill>
              </div>
              <Glint />
            </ProductPanel>
          </Tilt>
        </Reveal>

        <Reveal as="dl" className="grid shrink-0 grid-cols-2 gap-2 @xl:grid-cols-4 @xl:gap-3" index={2} y={12}>
          {metrics.map((metric, index) => (
            <Reveal as="div" index={index} key={metric.label} y={10}>
              <ProductMetric label={metric.label} value={metric.value} note={metric.note} />
            </Reveal>
          ))}
        </Reveal>

        <div className="grid min-h-0 flex-1 gap-3 @xl:grid-cols-[1.55fr_1fr] @xl:gap-5">
          <Reveal className="flex min-h-0 flex-col" index={3} y={14}>
            <ProductPanel className="flex h-full min-h-0 flex-col">
              <div className="mb-2 @xl:mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Practice modules</h2>
                  <p className="mt-1 text-[7px] @xl:text-[10px] text-[#8191a1]">Published modules in the current prototype</p>
                </div>
                <ProductPill tone="signal">3 modules</ProductPill>
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 @xl:gap-3">
                {modules.map((module, index) => (
                  <Reveal as="article" className="flex h-full min-w-0 flex-col overflow-hidden border border-[#263544] bg-[#0b1420]" index={index} key={module.title} step={0.09} y={16}>
                    <Tilt className="flex h-full min-h-0 flex-col" max={5} lift={8}>
                      {/* `Tilt` needs a real box to rotate, so the card's own
                          height is applied here rather than on the wrapper. */}
                      <div className="relative h-[34%] min-h-10 overflow-hidden bg-gradient-to-br from-[#161e27] to-[#0c1521]">
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-50"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, rgba(166,232,107,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(166,232,107,.08) 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                          }}
                        />
                        <Sprite3D
                          alt=""
                          className="absolute inset-y-0 right-0 w-[65%]"
                          depth={16}
                          float={5}
                          glow="#7fc4ff"
                          src={module.image}
                        />
                        <span className="absolute left-2 top-2 @xl:left-3 @xl:top-3 font-mono text-[6px] @xl:text-[9px] text-[#a6e86b]">{module.status}</span>
                      </div>
                      <div className="flex flex-1 flex-col p-2 @xl:p-4">
                        <h3 className="text-[8px] @xl:text-sm font-bold leading-tight">{module.title}</h3>
                        <p className="mt-1.5 @xl:mt-2 text-[7px] @xl:text-[10px] leading-relaxed text-[#8191a1]">{module.copy}</p>
                        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#263544] pt-2 @xl:pt-3 font-mono text-[6px] @xl:text-[9px]">
                          <span className="text-[#a6e86b]">Access follows progress</span>
                          <span className="text-[#8191a1]">→</span>
                        </div>
                      </div>
                      <Glint delay={0.5 + index * 0.12} />
                    </Tilt>
                  </Reveal>
                ))}
              </div>
            </ProductPanel>
          </Reveal>

          <div className="grid min-h-0 grid-rows-2 gap-3 @xl:gap-5">
            <Reveal className="flex min-h-0 flex-col" index={4} y={14}>
              <Tilt className="flex h-full min-h-0 flex-col" max={4} lift={8}>
                <ProductPanel className="relative flex h-full min-h-0 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Daily quest</h2>
                      <p className="mt-1 @xl:mt-3 text-[10px] @xl:text-lg font-semibold">A short activity for today</p>
                      <p className="mt-1 text-[7px] @xl:text-[10px] leading-relaxed text-[#8191a1]">Quest definitions and rewards are configured in the admin tools.</p>
                    </div>
                    <Sprite3D alt="" className="h-9 w-9 shrink-0 @xl:h-14 @xl:w-14" depth={14} float={4} spin src="/media/levelone.webp" />
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#263544] pt-2 @xl:pt-4">
                    <ProductPill>Account-specific</ProductPill>
                    <span className="font-mono text-[7px] @xl:text-[10px] text-[#a6e86b]">View quest →</span>
                  </div>
                  <Glint />
                </ProductPanel>
              </Tilt>
            </Reveal>

            <Reveal className="flex min-h-0 flex-col" index={5} y={14}>
              <Tilt className="flex h-full min-h-0 flex-col" max={4} lift={8}>
                <ProductPanel className="flex h-full min-h-0 flex-col justify-between">
                  <div>
                    <h2 className="font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">Daily activity</h2>
                    <p className="mt-1 @xl:mt-3 text-[9px] @xl:text-base font-semibold">Streaks track practice over time.</p>
                    <p className="mt-1 text-[7px] @xl:text-[10px] text-[#8191a1]">The current and longest streak depend on learner activity.</p>
                  </div>
                  {/* A shimmer, not a bar chart: the slide deliberately shows no
                      activity values, so nothing here may imply a quantity. */}
                  <div className="flex items-end gap-1.5 @xl:gap-2" aria-label="Illustrative weekly activity strip">
                    {week.map((day) => (
                      <ScanBar className="h-4 flex-1 border border-[#263544] bg-[#0b1420] @xl:h-8" delay={day * 0.16} key={day} />
                    ))}
                  </div>
                </ProductPanel>
              </Tilt>
            </Reveal>
          </div>
        </div>
      </div>
    </AlethiaScreen>
  );
}
