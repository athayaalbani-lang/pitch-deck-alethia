let currentFaceId: string | null = null;
let isProgrammaticScroll = false;
let clearProgrammaticTimeoutId: number | null = null;

const PROGRAMMATIC_SCROLL_TIMEOUT_MS = 1000;

/* Cubic-bezier(.23, 1, .32, 1) — the curve the deck's own micro-interactions and
   its drag-settle both use, so a button press and a throw arrive the same way. */
const SETTLE_MS = 420;

/**
 * Scroll the container to `target`, animating it by hand.
 *
 * The native `scrollTo({ behavior: "smooth" })` silently does nothing here. This
 * container's children each carry a 3D transform (translateZ / rotateY / scale) to
 * build the depth corridor, and Chromium drops a smooth-scroll animation on a
 * scroller whose descendants are transformed: the call is accepted and the offset
 * never moves. The visible symptom was navigation that advanced the hash while
 * the slide stayed exactly where it was, permanently clipped at the viewport edge.
 *
 * Assigning `scrollLeft` directly does work, so the animation is done with rAF
 * over that property instead. A scroll event is dispatched each frame so anything
 * reading the offset — the depth corridor above all — tracks the move rather than
 * committing its pass against the position before the scroll began.
 */
function animateScroll(container: HTMLElement, target: number, smooth: boolean): void {
  const start = container.scrollLeft;
  const distance = target - start;

  if (!smooth || Math.abs(distance) < 1) {
    container.scrollLeft = target;
    container.dispatchEvent(new Event("scroll"));
    return;
  }

  let settled = false;
  const land = () => {
    if (settled || !container.isConnected) return;
    settled = true;
    window.clearTimeout(landTimer);
    container.scrollLeft = target;
    container.dispatchEvent(new Event("scroll"));
  };

  /* A hard landing. `requestAnimationFrame` is suspended outright in a
     background tab, so an rAF-only animation never advances there and the deck
     would be left parked between two slides — the exact clipped-slide symptom
     this whole path exists to prevent. `setTimeout` keeps firing when frames do
     not, so this guarantee the move always completes. */
  const landTimer = window.setTimeout(land, SETTLE_MS + 160);

  const startTime = performance.now();
  const step = (now: number) => {
    if (settled || !container.isConnected) return;
    const t = Math.min(1, (now - startTime) / SETTLE_MS);
    /* Ease-out-expo, matching the deck's other settle motion. */
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    container.scrollLeft = start + distance * eased;
    container.dispatchEvent(new Event("scroll"));
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      settled = true;
      window.clearTimeout(landTimer);
    }
  };

  requestAnimationFrame(step);
}

const listeners = new Set<() => void>();

export function getCurrentStackedFaceId(): string | null {
  return currentFaceId;
}

export function setCurrentStackedFaceId(faceId: string | null): void {
  if (currentFaceId === faceId) return;
  currentFaceId = faceId;
  for (const listener of listeners) listener();
}

export function subscribeToStackedFace(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isProgrammaticStackedScroll(): boolean {
  return isProgrammaticScroll;
}

export function clearProgrammaticStackedScroll(): void {
  isProgrammaticScroll = false;
  if (clearProgrammaticTimeoutId !== null) {
    window.clearTimeout(clearProgrammaticTimeoutId);
    clearProgrammaticTimeoutId = null;
  }
}

function markProgrammaticStackedScroll(): void {
  isProgrammaticScroll = true;
  if (clearProgrammaticTimeoutId !== null) {
    window.clearTimeout(clearProgrammaticTimeoutId);
  }
  clearProgrammaticTimeoutId = window.setTimeout(() => {
    isProgrammaticScroll = false;
    clearProgrammaticTimeoutId = null;
  }, PROGRAMMATIC_SCROLL_TIMEOUT_MS);
}

export function scrollStackedFaceIntoView(
  faceId: string,
  behavior: ScrollBehavior,
  orientation: "VERTICAL" | "HORIZONTAL" = "VERTICAL",
): void {
  const element = document.querySelector<HTMLElement>(
    `[data-face-id="${CSS.escape(faceId)}"]`,
  );
  if (!element) return;
  markProgrammaticStackedScroll();

  if (orientation === "HORIZONTAL") {
    const container = element.closest<HTMLElement>(
      ".stacked-slides-container, .stacked-mobile-slides-container",
    );
    if (container) {
      /* Layout geometry, not `getBoundingClientRect`. The deck applies a 3D
         transform to every slide (translateZ, rotateY, scale), so a rect measured
         here comes back post-transform and no longer matches the slide's real
         width — which made the centring offset wrong and left the stack resting
         between two slides, with the active one sliced by the viewport edge.
         `offsetLeft`/`offsetWidth` are unaffected by transforms and describe
         exactly what the scroll position is measured against. */
      const centreOffset = (container.clientWidth - element.offsetWidth) / 2;
      const left = element.offsetLeft - container.clientLeft - centreOffset;
      /* Clamped to the real scrollable range. Landing past the end silently
         clamps, but the hash and the visible slide would then disagree. */
      const max = container.scrollWidth - container.clientWidth;
      const next = Math.min(Math.max(left, 0), Math.max(max, 0));

      animateScroll(container, next, behavior === "smooth");
      return;
    }
  }

  element.scrollIntoView({ behavior, block: "center", inline: "nearest" });
}
