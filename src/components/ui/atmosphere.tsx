import React from "react";
import { Bokeh } from "@/components/ui/sbs";
import { Ring } from "@/components/ui/8bit";
import { Float, Pulse } from "@/components/ui/madbox";

/**
 * Slide backdrop carrying the SBS Town look — deep black, a soft lime bloom,
 * drifting out-of-focus motes and the occasional rotating ring. Content is
 * laid over the top, so faces keep their own information untouched.
 */
export function Atmosphere({
  ghost,
  ring = "bottom-right",
  bokeh = 18,
  ghostFloat,
  children,
}: {
  /** Oversized translucent numeral behind the content. */
  ghost?: string;
  /** Position/scale of the ghost numeral. `float` turns on the Madbox pulse. */
  ghostFloat?: { right: string; bottom: string; size: string };
  ring?: "bottom-right" | "bottom-left" | "top-left" | "top-right" | "center" | "none";
  /** Drifting light motes; set to 0 for calmer narrative slides. */
  bokeh?: number;
  children?: React.ReactNode;
}) {
  const ghostStyle = ghostFloat ?? {
    right: "-4%",
    bottom: "-24%",
    size: "62vh",
  };
  const ringPos =
    ring === "bottom-right"
      ? { right: "-4%", bottom: "-6%" }
      : ring === "bottom-left"
        ? { left: "-4%", bottom: "-6%" }
        : ring === "top-right"
          ? { right: "-4%", top: "-6%" }
          : ring === "top-left"
            ? { left: "-4%", top: "-6%" }
            : ring === "center"
              ? { left: "50%", top: "50%", marginLeft: -160, marginTop: -160 }
              : null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--ink-1)]">
      {/* Key light raking in from the top-left, as in the reference city. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 22% 8%, rgba(166,232,107,0.10), transparent 62%), radial-gradient(56% 50% at 88% 96%, rgba(126,217,87,0.07), transparent 66%)",
        }}
        aria-hidden="true"
      />

      <Bokeh count={bokeh} />

      {ringPos && (
        <div
          className="pointer-events-none absolute"
          style={{ ...ringPos, width: 320, height: 320, opacity: 0.14 }}
        >
          <Ring size={320} thickness={0.14} slow color="var(--cyan)" />
        </div>
      )}

      {ghost && (
        <div
          className="pointer-events-none absolute select-none"
          style={{
            right: ghostStyle.right,
            bottom: ghostStyle.bottom,
            fontSize: ghostStyle.size,
          }}
          aria-hidden="true"
        >
          <Float index={0}>
            <Pulse index={0}>
              <div
                className="font-condensed font-bold leading-none"
                style={{
                  color: "var(--ink-3)",
                  letterSpacing: "-0.04em",
                }}
              >
                {ghost}
              </div>
            </Pulse>
          </Float>
        </div>
      )}

      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
