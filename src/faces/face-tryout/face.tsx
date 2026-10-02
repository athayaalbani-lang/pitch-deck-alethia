import React from "react";
import { motion } from "motion/react";
import { Atmosphere } from "@/components/ui/atmosphere";
import { MaskReveal } from "@/components/ui/motion";
import { Ring } from "@/components/ui/8bit";
import { TextContent } from "@/components/ui/text-content";
import { blocks } from "./face.content.json";

const MONO = "font-terminal uppercase tracking-[0.18em]";

export default function TryoutFace() {
  const openPrototype = () => {
    window.open(blocks.url.content, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="h-full w-full font-body text-[var(--ice)]">
      <Atmosphere
        ghost="TRY"
        ghostFloat={{ right: "-2%", bottom: "-26%", size: "76vh" }}
        ring="bottom-right"
        bokeh={12}
      >
        <div className="flex h-full w-full flex-col px-4 py-3 @xl:px-14 @xl:py-7">
          <header className="flex shrink-0 items-center justify-between border-b border-[var(--line)] pb-2.5 @xl:pb-4">
            <div className="flex items-center gap-2.5 @xl:gap-3">
              <Ring size={13} thickness={0.5} color="var(--cyan)" />
              <TextContent
                content={blocks.badge.content}
                data-content-keys={["badge"]}
                className={`${MONO} text-[var(--cyan)] text-[7px] @xl:text-[15px] font-semibold`}
              />
            </div>
            <TextContent
              content={blocks.statusLabel.content}
              data-content-keys={["statusLabel"]}
              className={`${MONO} text-[var(--steel)] text-[6px] @xl:text-[13px]`}
            />
          </header>

          <main className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
            <MaskReveal>
              <motion.h1
                initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                className="font-condensed text-[40px] @xl:text-[110px] font-black leading-[0.85] tracking-[-0.02em] text-white pb-[0.22em]"
              >
                {blocks.title.content}
              </motion.h1>
            </MaskReveal>

            <p className="mt-1 @xl:mt-2 max-w-[900px] text-[10px] @xl:text-[24px] font-medium leading-snug tracking-[-0.01em] text-[var(--body)]">
              {blocks.lead.content}
            </p>

            {/* QR — the bridge to the website. White card for scan contrast,
                deck chrome around it so it belongs to the slide family. */}
            <motion.figure
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.33, 1, 0.68, 1] }}
              className="mt-5 @xl:mt-8 rounded-[var(--rw-radius)] border border-[var(--line)] bg-white p-3 @xl:p-5 shadow-[0_18px_60px_-12px_rgba(166,232,107,0.35)]"
            >
              <img
                alt="QR code linking to the Alethia prototype website"
                className="block h-auto w-[260px] @xl:w-[380px] select-none"
                draggable={false}
                src="/media/qr-dark.png"
              />
              <figcaption
                className={`${MONO} mt-2 @xl:mt-3 text-center text-[7px] @xl:text-[12px] font-semibold text-[#166534]`}
              >
                {blocks.qrCaption.content}
              </figcaption>
            </motion.figure>

            <motion.button
              type="button"
              onClick={openPrototype}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="mt-5 @xl:mt-7 inline-flex items-center gap-2 @xl:gap-3 rounded-full px-6 @xl:px-10 py-2.5 @xl:py-4 font-grotesk font-bold text-[11px] @xl:text-[20px] tracking-[-0.01em] text-[var(--ink-0)] transition hover:brightness-110"
              style={{
                background: "var(--spectrum)",
                transform: "rotate(-0.6deg)",
                boxShadow:
                  "0 10px 34px -8px rgba(166,232,107,0.55), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              {blocks.ctaLabel.content}
              <span aria-hidden="true">↗</span>
            </motion.button>

            <p
              className={`${MONO} mt-3 @xl:mt-4 text-[var(--steel)] text-[6px] @xl:text-[12px] break-all`}
            >
              {blocks.url.content}
            </p>
          </main>

          <footer className="flex shrink-0 items-center justify-center gap-3 @xl:gap-4 pt-3 @xl:pt-6">
            <Ring size={12} thickness={0.5} color="var(--cyan)" />
            <TextContent
              content={blocks.footerLabel.content}
              data-content-keys={["footerLabel"]}
              className={`${MONO} text-[var(--steel)] text-[6px] @xl:text-[12px]`}
            />
          </footer>
        </div>
      </Atmosphere>
    </div>
  );
}
