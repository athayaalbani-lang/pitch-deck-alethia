import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";
import { TextContent } from "@/components/ui/text-content";
import { Icon } from "@/components/ui/icon";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Capsule, RoundControl } from "@/components/ui/sbs";
import { MaskReveal } from "@/components/ui/motion";
import { Overline, Ring } from "@/components/ui/8bit";
import { navigateTo } from "@/utils/face-navigation";

const MONO = "font-grotesk uppercase tracking-[0.18em]";

export default function ClosingFace() {
  const showQrBox = controls.showQrBox?.value ?? true;
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.3 });

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ghost="GO" ring="center" bokeh={22}>
        <div className="w-full h-full flex flex-col justify-between px-6 @xl:px-12 py-5 @xl:py-9 relative z-10">

          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3 @xl:pb-4">
            <div className="flex items-center gap-3 @xl:gap-4">
              <Ring size={16} thickness={0.5} color="var(--cyan)" />
              <TextContent
                content={blocks.badge.content}
                className={`${MONO} text-[var(--cyan)] text-[8px] @xl:text-sm`}
                data-content-keys={["badge"]}
              />
            </div>
            <TextContent
              content={blocks.statusLabel.content}
              className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-sm`}
              data-content-keys={["statusLabel"]}
            />
          </div>

          {/* Main */}
          <div className="flex-1 flex flex-col items-center justify-center text-center my-3 @xl:my-5 w-full">
            <MaskReveal>
              <TextContent
                content={blocks.wordmark.content}
                className="font-condensed font-black text-[64px] @xl:text-[150px] leading-[0.84] tracking-[-0.02em] text-white uppercase"
                data-content-keys={["wordmark"]}
              />
            </MaskReveal>

            <TextContent
              content={blocks.tagline.content}
              className="font-grotesk text-[15px] @xl:text-[30px] text-[var(--body)] font-medium tracking-wide max-w-[1200px] mt-2 @xl:mt-4"
              data-content-keys={["tagline"]}
            />

            {/* Recap tiles as capsules, mirroring the reference hotspots. */}
            <div className="w-full max-w-[1500px] mt-6 @xl:mt-10">
              <div className="flex flex-wrap items-center justify-center gap-2.5 @xl:gap-5 mb-2.5 @xl:mb-4">
                {blocks.recapTiles.rows.slice(0, 4).map((tile, idx) => (
                  <Capsule
                    key={tile.id}
                    size="sm"
                    tilt={idx % 2 === 0 ? -2 : 2}
                    onClick={() => navigateTo({ faceId: tile.targetFaceId })}
                  >
                    <span className="flex items-center gap-2">
                      <span>{tile.num}</span>
                      <TextContent
                        content={tile.label}
                        data-content-keys={[`recapTiles.rows.${idx}.label`]}
                      />
                    </span>
                  </Capsule>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 @xl:gap-5">
                {blocks.recapTiles.rows.slice(4, 7).map((tile, idx) => (
                  <Capsule
                    key={tile.id}
                    size="sm"
                    tilt={idx % 2 === 0 ? 2 : -2}
                    onClick={() => navigateTo({ faceId: tile.targetFaceId })}
                  >
                    <span className="flex items-center gap-2">
                      <span>{tile.num}</span>
                      <TextContent
                        content={tile.label}
                        data-content-keys={[`recapTiles.rows.${idx + 4}.label`]}
                      />
                    </span>
                  </Capsule>
                ))}
              </div>
            </div>

            {/* Closing statement */}
            <div className="mt-6 @xl:mt-10 max-w-[1300px] w-full">
              <Capsule size="lg" tilt={-1}>
                <TextContent
                  content={blocks.closingStatement.content}
                  data-content-keys={["closingStatement"]}
                />
              </Capsule>
            </div>

            <div className="flex items-center gap-2.5 @xl:gap-4 mt-5 @xl:mt-8">
              <Ring size={18} thickness={0.5} color="var(--cyan)" />
              <TextContent
                content={blocks.callToAction.content}
                className={`${MONO} text-[var(--cyan)] text-[9px] @xl:text-[19px] font-semibold`}
                data-content-keys={["callToAction"]}
              />
            </div>
          </div>

          {/* Lower third */}
          <div className="h-24 @xl:h-32 w-full flex items-center justify-center z-10 relative">
            {showQrBox ? (
              <div className="flex items-center gap-4 @xl:gap-6 text-[var(--steel)]">
                <Icon name="qr-code" size={30} className="text-[var(--steel)]" />
                <TextContent
                  content={blocks.qrPlaceholderLabel.content}
                  className={`${MONO} text-[8px] @xl:text-[15px]`}
                  data-content-keys={["qrPlaceholderLabel"]}
                />
              </div>
            ) : (
              <TextContent
                content={blocks.reservedLabel.content}
                className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[15px]`}
                data-content-keys={["reservedLabel"]}
              />
            )}
          </div>
        </div>
      </Atmosphere>
    </div>
  );
}
