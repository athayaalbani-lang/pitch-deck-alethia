import { useEffect, type RefObject } from "react";

/* Depth for the deck itself.
 *
 * The horizontal stack is treated as a 3D corridor: the slide nearest the
 * viewport centre sits flat and fully lit, while slides to either side recede
 * along Z, yaw away on Y and dim. Scrolling then reads as moving *through* the
 * deck rather than past it.
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
  dim = 0.55,
  scaleFalloff = 0.1,
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

      for (const slide of slides) {
        // Offset of this slide's centre from the viewport centre, normalised so
        // that +/-1 sits exactly one slide-width away.
        const offset = (slide.offsetLeft + slide.offsetWidth / 2 - centre) / width;
        const clamped = clamp(offset, -1.6, 1.6);
        const away = Math.abs(clamped);

        const z = -away * depth;
        const yaw = -clamped * maxYaw;
        const scale = 1 - away * scaleFalloff;
        const opacity = 1 - away * (1 - dim);

        // Yaw and scale are rounded to avoid a style write on every subpixel of
        // a slow drag; the browser still composites smoothly.
        slide.style.transform =
          `translate3d(0,0,${z.toFixed(1)}px) ` +
          `rotateY(${yaw.toFixed(2)}deg) ` +
          `scale(${scale.toFixed(4)})`;
        slide.style.opacity = opacity.toFixed(3);
        // The centred slide must paint above its neighbours as they recede.
        slide.style.zIndex = String(10 - Math.round(away * 6));
      }
    };

    const onScroll = (_event: Event) => {
      // Coalesce bursts without relying on rAF.
      const now = Date.now();
      if (now - last < 16) return;
      last = now;
      apply();
    };

    const collect = () => {
      slides = [...el.querySelectorAll<HTMLElement>(":scope > [data-face-id]")];
      apply();
    };

    collect();
    // Boolean form: the scroll listener takes no meaningful argument, so the
    // typed overload here does not accept the options object.
    el.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", collect);

    // A face can mount late (the deck mounts neighbours lazily), so refresh the
    // list whenever the stack's size changes.
    const observer = new ResizeObserver(collect);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", collect);
      observer.disconnect();
      for (const slide of slides) {
        slide.style.transform = "";
        slide.style.opacity = "";
        slide.style.zIndex = "";
      }
    };
  }, [ref, enabled, depth, maxYaw, dim, scaleFalloff]);
}
