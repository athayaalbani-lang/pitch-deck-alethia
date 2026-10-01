import { useEffect, useRef, type RefObject } from "react";

/* The reference (jesperlandberg.com) sets `grabbable` on <html> and moves its
   scene by dragging, with the throw carrying on after release. The deck's only
   horizontal input was the wheel, which jumped by a raw delta, so a flick felt
   like a stutter. This adds direct-manipulation drag plus a momentum release
   that settles on the nearest slide using the same easing the site uses for
   its UI transitions: cubic-bezier(.23, 1, .32, 1). */

/** CSS cubic-bezier(x1,y1,x2,y2) -> a sampler f(t) in 0..1. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (a: number, b: number) => 1 - 3 * b + 3 * a;
  const B = (a: number, b: number) => 3 * b - 6 * a;
  const C = (a: number) => 3 * a;
  const calc = (t: number, a: number, b: number) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t: number, a: number, b: number) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // Newton-Raphson, falling back to bisection when the slope is too flat.
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const d = calc(t, x1, x2) - x;
      if (Math.abs(d) < 1e-5) return calc(t, y1, y2);
      const s = slope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t -= d / s;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (hi - lo > 1e-5) {
      if (calc(t, x1, x2) < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return calc(t, y1, y2);
  };
}

const SETTLE = cubicBezier(0.23, 1, 0.32, 1);

/** A drag shorter than this is treated as a click, not a throw. */
const DRAG_SLOP_PX = 4;
/** How much of the release velocity is carried into the settle. */
const FLICK_CARRY = 0.14;
/** Never settle slower than this, however far the throw travelled. */
const MAX_SETTLE_MS = 620;
const MIN_SETTLE_MS = 180;

export function useGrabScroll({
  ref,
  enabled = true,
}: {
  ref: RefObject<HTMLElement | null>;
  enabled?: boolean;
}): void {
  // Pointer state lives in a ref: writing to React state per pointermove would
  // re-render the whole deck on every frame.
  const drag = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    moved: false,
    frame: 0,
  });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const canDrag = (target: EventTarget | null) => {
      const node = target as Element | null;
      if (!node || typeof node.closest !== "function") return false;
      // Never steal a drag from a control or a scrollable region.
      if (node.closest("button, a, input, textarea, select, [role='button']")) return false;
      if (node.closest("[data-contain-scroll='true'], [data-no-drag='true']")) return false;
      return true;
    };

    const snapPoints = () =>
      [...el.children].map((child) => (child as HTMLElement).offsetLeft).filter((x) => x >= 0);

    const nearestSnap = (scrollLeft: number) => {
      const points = snapPoints();
      if (points.length === 0) return scrollLeft;
      let best = points[0];
      for (const point of points) {
        if (Math.abs(point - scrollLeft) < Math.abs(best - scrollLeft)) best = point;
      }
      return best;
    };

    const stopAnimation = () => {
      if (drag.current.frame) {
        cancelAnimationFrame(drag.current.frame);
        drag.current.frame = 0;
      }
    };

    const settleTo = (target: number) => {
      stopAnimation();
      const from = el.scrollLeft;
      const distance = target - from;
      if (Math.abs(distance) < 1) return;

      // Duration scales with the throw, but stays inside a tight band so the
      // deck never feels like it is waiting on an animation.
      const duration = Math.min(
        MAX_SETTLE_MS,
        Math.max(MIN_SETTLE_MS, Math.abs(distance) * 0.55),
      );
      const started = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - started) / duration);
        el.scrollLeft = from + distance * SETTLE(t);
        if (t < 1) {
          drag.current.frame = requestAnimationFrame(step);
        } else {
          drag.current.frame = 0;
        }
      };
      drag.current.frame = requestAnimationFrame(step);
    };

    const onPointerDown = (event: PointerEvent) => {
      // Primary button / single touch only.
      if (event.button !== 0) return;
      if (!canDrag(event.target)) return;
      stopAnimation();

      drag.current.active = true;
      drag.current.pointerId = event.pointerId;
      drag.current.startX = event.clientX;
      drag.current.startScroll = el.scrollLeft;
      drag.current.lastX = event.clientX;
      drag.current.lastT = performance.now();
      drag.current.velocity = 0;
      drag.current.moved = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag.current.active || event.pointerId !== drag.current.pointerId) return;

      const dx = event.clientX - drag.current.startX;
      if (!drag.current.moved && Math.abs(dx) < DRAG_SLOP_PX) return;

      if (!drag.current.moved) {
        drag.current.moved = true;
        // Capture keeps the drag alive if the pointer leaves the deck, but it
        // can legitimately fail (pointer already released, synthetic events).
        // An uncaught throw here would abort the rest of the handler and strand
        // the drag with no settle.
        try {
          el.setPointerCapture(event.pointerId);
        } catch {
          /* capture unavailable — the drag still works, just not beyond the edge */
        }
        el.dataset.dragging = "true";
      }

      // 1:1 direct manipulation — the deck follows the pointer exactly.
      el.scrollLeft = drag.current.startScroll - dx;

      // Velocity in px/ms from the last sample, lightly smoothed.
      const now = performance.now();
      const dt = now - drag.current.lastT;
      if (dt > 0) {
        const instant = (drag.current.lastX - event.clientX) / dt;
        drag.current.velocity = drag.current.velocity * 0.7 + instant * 0.3;
        drag.current.lastX = event.clientX;
        drag.current.lastT = now;
      }
      event.preventDefault();
    };

    const endDrag = (event: PointerEvent) => {
      if (!drag.current.active || event.pointerId !== drag.current.pointerId) return;
      const { moved, velocity } = drag.current;
      drag.current.active = false;
      delete el.dataset.dragging;
      if (el.hasPointerCapture?.(event.pointerId)) {
        try {
          el.releasePointerCapture(event.pointerId);
        } catch {
          /* already released */
        }
      }
      if (!moved) return;

      // Carry a little of the throw, then settle on the nearest slide.
      const carried = el.scrollLeft - velocity * FLICK_CARRY;
      settleTo(nearestSnap(carried));
    };

    // A throw already in flight should not keep running after a new grab.
    const onPointerCancel = (event: PointerEvent) => {
      if (event.pointerId !== drag.current.pointerId) return;
      drag.current.active = false;
      stopAnimation();
      delete el.dataset.dragging;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", onPointerCancel);

    return () => {
      stopAnimation();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [ref, enabled]);
}
