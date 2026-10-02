import React, { useCallback, useEffect, useRef, useState } from "react";
import { TextContent } from "@/components/ui/text-content";
import { PlanetBody, PlanetSpin } from "@/components/ui/planet-spin";
import { navigateTo } from "@/utils/face-navigation";
import { faces } from "@/faces.config.json";
import { NodeGraph } from "./components/node-graph";
import "./hero.css";

/* Artwork.
 *
 * `Planetmain-cutout.png` and `Planetside-cutout.png` are derived from
 * `Planetmain.png` and `Planetside.png`. Those two are JPEGs despite their
 * extension, so they carry no alpha at all — what looks like transparency is a
 * painted light-grey checkerboard — and cannot sit on the dark backdrop as-is.
 * The cut-outs were produced by keying neutral grey seeded from the image
 * border, which leaves the greys inside the artwork untouched. The originals are
 * kept alongside them. */
const PLANET_MAIN = "/media/Planetmain-cutout.png";
const PLANET_SIDE = "/media/Planetside-cutout.png";

const destinations = [
  { number: "01", label: "Practice modules", faceId: "face-1ecenb" },
  { number: "02", label: "Community reports", faceId: "face-8uelwy" },
  { number: "03", label: "Practice insights", faceId: "face-9sa50d" },
];

const OPENING_ID = "face-uqqcri";

/* The deck's own position, kept in step with any reordering of faces.config. */
const slideNumber = String(faces.findIndex((face) => face.id === OPENING_ID) + 1).padStart(2, "0");

/* Artwork is laid out in pixels, so it needs a pixel size — and that size has to
 * follow the artboard. CSS cannot supply it: `--u` resolves to a length, and a
 * `transform: scale(var(--u))` is invalid for want of a unitless number. So the
 * width is measured and the size computed, mirroring the two design bases the
 * stylesheet uses: 1920 for the desktop artboard, 760 for the compact one. Both
 * artboards are 16:9, so no separate height pass is needed. */
const DESIGN_BASE = 1920;
const COMPACT_BASE = 760;
const COMPACT_AT = 700;
/* Sizing is driven by the reference's proportions rather than by the artwork's
   own box. There the Earth is a limb: wider than the frame, cropped by both
   side edges, with only its upper arc in view below the copy. Reproducing that
   needs a planet far larger than the artboard — which also pushes the lettering
   baked into the artwork's base cleanly out of frame. */
const PLANET_MAIN_DESIGN_PX = 1360;
const PLANET_SIDE_DESIGN_PX = 340;

function useArtboard() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: DESIGN_BASE, height: (DESIGN_BASE * 9) / 16 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ width: rect.width, height: rect.height });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

export default function OpeningFace() {
  const [shellRef, artboard] = useArtboard();
  const root = useRef<HTMLDivElement>(null);
  const [navOpen, setNavOpen] = useState(false);

  const base = artboard.width <= COMPACT_AT ? COMPACT_BASE : DESIGN_BASE;
  const scale = artboard.width / base;
  const mainPx = Math.round(PLANET_MAIN_DESIGN_PX * scale);
  const sidePx = Math.round(PLANET_SIDE_DESIGN_PX * scale);

  /* The planet is seated by an explicit top offset rather than by a stage box.

   A shorter stage was tried and leaves a visible horizontal seam: the artwork's
   box is far taller than the disc inside it, so wherever the stage ends it cuts
   across visible pixels. Seating the box directly and letting the whole slide
   clip it means the only edge that ever touches the artwork is the frame's own
   bottom, which is what makes it read as a planet rising out of view.

   The offset has to clear the copy stack, not merely look like it does. The
   cut-out carries only an 8px transparent margin, so its box top *is* the top of
   the visible disc — there is no hidden headroom to hide the paragraph behind.
   Seating at the frame's midpoint puts the disc's edge straight through the CTA,
   so the line sits below the button's baseline with room to spare while the
   planet still fills and overruns the lower third the way the reference does. */
  const planetTop = artboard.height * 0.64;

  /* --- Entrance sequence --------------------------------------------- *
   * Mirrors the reference: add `.anim` before paint so the opening frame is
   * composed rather than flashing the finished page, then add `.play` to run the
   * stagger. The classes are stripped afterwards, leaving the slide in its
   * authored static state with no residual transforms or running timers.
   *
   * The timer fallback is load-bearing, not defensive padding. `.anim` holds
   * every element at `opacity: 0` until `.play` arrives, and a backgrounded tab
   * suspends requestAnimationFrame entirely — so without a path that does not go
   * through rAF the slide would stay blank. `setTimeout` keeps running in a
   * hidden tab, so it is the one clock that can be relied on here. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("anim");

    let raf1 = 0;
    let raf2 = 0;
    let played = false;

    const play = () => {
      if (played) return;
      played = true;
      el.classList.add("play");
      window.setTimeout(() => el.classList.remove("anim", "play"), 2150);
    };

    const viaFrame = () => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(play);
      });
    };

    const fontGuard = window.setTimeout(viaFrame, 500);
    const safety = window.setTimeout(play, 700);

    if (typeof document?.fonts?.ready?.then === "function") {
      document.fonts.ready.then(viaFrame).catch(() => {});
    }

    return () => {
      window.clearTimeout(fontGuard);
      window.clearTimeout(safety);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      el.classList.remove("anim", "play");
    };
  }, []);

  /* --- Burger menu ----------------------------------------------------- */
  const closeNav = useCallback(() => setNavOpen(false), []);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavOpen(false);
        root.current?.querySelector<HTMLButtonElement>(".alu-burger")?.focus();
      }
    };
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!root.current?.contains(target)) setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onPointer);
    };
  }, [navOpen]);

  return (
    <div ref={root} className="alu">
      {/* Measures the artboard so the artwork can be sized in pixels. */}
      <div ref={shellRef} className="absolute inset-0" aria-hidden="true" />

      {/* BACKDROP — the main planet, seated low and turning slowly on the spot. */}
      <div className="alu-sky" aria-hidden="true">
        <div className="alu-stage" style={{ top: planetTop }}>
          <div className="alu-hero">
            <div className="alu-art-glow" />
            <PlanetBody src={PLANET_MAIN} width={mainPx} />
          </div>
        </div>
      </div>

      {/* The two flanking planets, cropped by the left and right edges. */}
      <div className="alu-flanks" aria-hidden="true">
        <div className="alu-flank">
          <PlanetSpin duration={52} src={PLANET_SIDE} width={sidePx} />
        </div>
        <div className="alu-flank">
          <PlanetSpin duration={52} src={PLANET_SIDE} width={sidePx} />
        </div>
      </div>

      <div className="alu-ui">
        {/* NAV — Alethia's own mark and destinations. */}
        <header className="alu-navbar">
          <div className="alu-navrow" data-open={navOpen}>
            <a className="alu-logo" href="#">
              <span aria-hidden="true" className="alu-logo-mark">
                A_
              </span>
              <b>ALETHIA</b>
            </a>

            <nav aria-label="Product screens">
              <ul className="alu-links" id="alu-site-nav">
                {destinations.map((item) => (
                  <li key={item.number}>
                    <a
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        navigateTo({ faceId: item.faceId });
                        closeNav();
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    className="alu-pill-sm"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      navigateTo({ faceId: "face-nqw26v" });
                      closeNav();
                    }}
                  >
                    Admin tools
                  </a>
                </li>
              </ul>
            </nav>

            <button
              aria-controls="alu-site-nav"
              aria-expanded={navOpen}
              aria-label={navOpen ? "Close navigation" : "Open navigation"}
              className="alu-burger"
              onClick={(event) => {
                event.stopPropagation();
                setNavOpen((open) => !open);
              }}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>

        {/* COPY — centred stack. Every string is Alethia's own. */}
        <div className="alu-copy">
          <div className="alu-col alu-eyebrow">
            <span className="alu-ent-mask">
              <span className="alu-ent-line">
                <TextContent content="A safe place to practise" data-content-keys={["overline"]} />
              </span>
            </span>
          </div>

          {/* The wordmark doubles as the hero headline, so the name lands in the
              centre of the composition rather than only in the nav corner. */}
          <h1 className="alu-col alu-title">
            <span className="alu-ent-mask">
              <span className="alu-ent-line">
                <TextContent content="ALETHIA" data-content-keys={["wordmark"]} />
              </span>
            </span>
          </h1>

          <h2 className="alu-col alu-subtitle">
            <span className="alu-ent-mask">
              <span className="alu-ent-line">
                <TextContent
                  content="The state of not being hidden."
                  data-content-keys={["headline"]}
                />
              </span>
            </span>
          </h2>

          <div className="alu-col alu-rule">
            <span />
          </div>

          <TextContent
            as="p"
            className="alu-col alu-lede"
            content="Practise spotting social engineering in fictional scenarios, then review the clues behind each decision."
            data-content-keys={["lead"]}
          />

          <div className="alu-col alu-cta">
            <button
              className="alu-cta-btn"
              onClick={() => navigateTo({ faceId: "face-landing" })}
              type="button"
            >
              Start
            </button>
          </div>

          {/* The product map, kept from the original slide. */}
          <div className="alu-graph" aria-hidden="true">
            <NodeGraph
              active={false}
              adminLabel="Admin tools"
              bare
              dim={1}
              fill
              nodes={["Practice", "Progress", "Reports"]}
            />
          </div>
        </div>

        <nav aria-label="Explore product screens" className="alu-dest">
          {destinations.map((item) => (
            <button key={item.number} onClick={() => navigateTo({ faceId: item.faceId })} type="button">
              <b>{item.number}</b>
              {item.label}
            </button>
          ))}
        </nav>

        <span className="sr-only">Slide {slideNumber}</span>
      </div>
    </div>
  );
}