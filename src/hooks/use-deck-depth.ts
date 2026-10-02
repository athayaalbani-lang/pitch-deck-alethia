import { useEffect, type RefObject } from "react";

/* Depth for the deck itself.
 *
 * The horizontal stack is treated as a 3D corridor: the slide nearest the
 * viewport centre sits flat and fully lit, while slides to either side recede
 * along Z and yaw away on Y. Scrolling then reads as moving *through* the deck
 * rather than past it.
 *
 * Crucially a slide is only ever *fully* visible while it is centred. Opacity
 * collapses over a short span (`peekFade`) instead of decaying all the way out,
 * so at rest the neighbours are invisible and pressing next or prev replaces the
 * slide outright — no sliver of the outgoing or incoming one left at the edge.
 * Fully faded slides also drop out of hit-testing and the a11y tree.
 *
 * Transforms are written straight from a passive scroll listener instead of a
 * requestAnimationFrame loop. rAF is suspended in background tabs, which would
 * freeze the depth mid-flick and leave the deck looking broken when the user
 * returns; scroll events keep firing regardless. */

type Slide = HTMLElement;

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

export function useDeckDepth({
  ref,
  enabled = true,
  depth = 520,
  maxYaw = 11,
  dim = 0,
  scaleFalloff = 0.1,
  /** Normalised offset at which a neighbouring slide has faded out entirely. */
  peekFade = 0.34,
}: {
  ref: RefObject<HTMLElement | null>;
  enabled?: boolean;
  /** Z distance applied per full unit of normalised offset. */
  depth?: number;
  /** Peak Y rotation, in degrees, at the edge of the viewport. */
  maxYaw?: number;
  /** Opacity floor for a fully off-centre slide. */
  dim?: number;
  scaleFalloff?: number;
  /** Normalised offset at which a neighbouring slide has faded out entirely. */
  peekFade?: number;
}): void {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let slides: Slide[] = [];
    let last = -1;

    const apply = () => {
      const width = el.clientWidth;
      if (width === 0) return;
      const centre = el.scrollLeft + width / 2;

      /* Which slide is current is decided by proximity to the viewport centre,
         not by a zero offset. The two are not the same thing: the stack settles
         wherever a scroll or a smooth programmatic jump leaves it, and a
         fractional resting position would otherwise leave the nearest slide
         partly faded and the deck with nothing fully visible. So the nearest
         slide is pinned opaque and every other slide is measured against it. */
      let nearest = 0;
      let nearestGap = Infinity;
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (!slide) continue;
        const gap = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centre);
        if (gap < nearestGap) {
          nearestGap = gap;
          nearest = i;
        }
      }
      const anchor = slides[nearest];

      for (const slide of slides) {
        const isCurrent = slide === anchor;

        // Offset of this slide's centre from the current slide's centre,
        // normalised so that +/-1 sits exactly one slide-width away.
        const offset = isCurrent
          ? 0
          : (slide.offsetLeft + slide.offsetWidth / 2 - centre) / width;
        const clamped = clamp(offset, -1.6, 1.6);
        const away = isCurrent ? 0 : Math.abs(clamped);

        const z = -away * depth;
        const yaw = -clamped * maxYaw;
        const scale = 1 - away * scaleFalloff;

        /* A slide must read as fully replaced, not as the next one peeking in
           from the edge. Opacity collapses over a short span near the centre —
           `peekFade` normalised units, roughly a third of a slide — rather than
           decaying gradually all the way out, so a neighbour is gone well before
           it reaches the frame edge and prev/next land on a clean single slide. */
        const opacity = isCurrent ? 1 : Math.max(dim, 1 - clamp(away / peekFade, 0, 1));

        // Yaw and scale are rounded to avoid a style write on every subpixel of
        // a slow drag; the browser still composites smoothly.
        slide.style.transform =
          `translate3d(0,0,${z.toFixed(1)}px) ` +
          `rotateY(${yaw.toFixed(2)}deg) ` +
          `scale(${scale.toFixed(4)})`;
        slide.style.opacity = opacity.toFixed(3);

        /* Fully faded slides leave the hit-test and the a11y tree, so an invisible
           neighbour cannot swallow a click meant for the slide on top of it and
           is not announced to a screen reader. */
        const hidden = !isCurrent && opacity <= 0.001;
        slide.style.visibility = hidden ? "hidden" : "";
        slide.style.pointerEvents = hidden ? "none" : "";
        slide.setAttribute("aria-hidden", hidden ? "true" : "false");

        // The current slide must paint above its neighbours as they recede.
        slide.style.zIndex = isCurrent ? "10" : String(9 - Math.round(away * 6));
      }
    };

    let settleTimer = 0;

    /* `scroll` fires continuously during a move, but the deck settles on a
       slide only once the offset stops changing, and nothing scrolls after the
       final frame. Without a trailing pass the opacity run stays committed to
       wherever the deck was mid-flight, which leaves the slide that just arrived
       invisible while the one that left stays painted.

       A timer rather than `scrollend`: that event is not fired for the scripted
       offset writes this deck's navigation uses, so the deck would never settle. */
    const scheduleSettle = () => {
      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        settleTimer = 0;
        apply();
      }, 140);
    };

    const onScroll = (_event: Event) => {
      // Coalesce bursts without relying on rAF.
      const now = Date.now();
      if (now - last < 16) return;
      last = now;
      apply();
      scheduleSettle();
    };

    const onScrollEnd = () => {
      scheduleSettle();
    };

    const collect = () => {
      slides = [...el.querySelectorAll<HTMLElement>(":scope > [data-face-id]")];
      apply();
    };

    collect();
    // Boolean form: the scroll listener takes no meaningful argument, so the
    // typed overload here does not accept the options object.
    el.addEventListener("scroll", onScroll, true);
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("resize", collect);

    // A face can mount late (the deck mounts neighbours lazily), so refresh the
    // list whenever the stack's size changes.
    const observer = new ResizeObserver(collect);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", collect);
      if (settleTimer) window.clearTimeout(settleTimer);
      observer.disconnect();
      for (const slide of slides) {
        slide.style.transform = "";
        slide.style.opacity = "";
        slide.style.zIndex = "";
        slide.style.visibility = "";
        slide.style.pointerEvents = "";
        slide.removeAttribute("aria-hidden");
      }
    };
  }, [ref, enabled, depth, maxYaw, dim, scaleFalloff, peekFade]);
}
