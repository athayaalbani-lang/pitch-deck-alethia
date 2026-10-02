import {
  DynamicFaceRender,
  type FaceEntry,
} from "@/components/entrypoint-layouts/dynamic-face-render";
import {
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
  type CornersMode,
  type MobileCanvas,
  type SlidesDisplay,
  type StackedOrientation,
} from "@/components/entrypoint-layouts/slides-layout-shared";
import { CardsBackgroundLayer } from "@/components/ui/cards-background-layer";
import { readKeyboardIntent } from "@/hooks/use-keyboard-navigation";
import { useDeckDepth } from "@/hooks/use-deck-depth";
import { useGrabScroll } from "@/hooks/use-grab-scroll";
import {
  MIN_CARDS_PEEK_SLIDES_PER_VIEW,
  useContainerDimensionScale,
} from "@/hooks/use-slides-scale";
import {
  useHorizontalWheelScroll,
  useReclaimWheelScroll,
} from "@/hooks/use-wheel-scroll";
import {
  faceIdToHash,
  getFaceIdFromHash,
  setFaceIdInHash,
} from "@/utils/face-hash";
import {
  setActiveSlideIndex,
  useRegisterFaceNavigation,
  useSlideStepper,
} from "@/utils/face-navigation";
import {
  clearProgrammaticStackedScroll,
  getCurrentStackedFaceId,
  isProgrammaticStackedScroll,
  scrollStackedFaceIntoView,
  setCurrentStackedFaceId,
  subscribeToStackedFace,
} from "@/utils/stacked-face-tracker";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";

const LEGACY_MOBILE_SLIDE_WIDTH = 720;
const LEGACY_MOBILE_SLIDE_HEIGHT = 1280;
const COMPACT_MOBILE_SLIDE_WIDTH = 384;
const COMPACT_MOBILE_SLIDE_HEIGHT = 683;

const CURRENT_FACE_MIN_VISIBLE_PX = 50;
const STACKED_MOUNT_ROOT_MARGIN = "150%";
const LAYOUT_SETTLE_TIMEOUT_MS = 1000;

function getMobileSlideDimensions(value: MobileCanvas): {
  width: number;
  height: number;
} {
  return value === "COMPACT"
    ? { width: COMPACT_MOBILE_SLIDE_WIDTH, height: COMPACT_MOBILE_SLIDE_HEIGHT }
    : { width: LEGACY_MOBILE_SLIDE_WIDTH, height: LEGACY_MOBILE_SLIDE_HEIGHT };
}

function useStackedHashScroll({
  faceIds,
  orientation,
}: {
  faceIds: string[];
  orientation: StackedOrientation;
}): void {
  useEffect(() => {
    if (faceIds.length === 0) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const elements = faceIds
      .map((id) =>
        document.querySelector<HTMLElement>(
          `[data-face-id="${CSS.escape(id)}"]`,
        ),
      )
      .filter((el): el is HTMLElement => el !== null);

    let rafId: number | null = null;
    let layoutSettleObserver: ResizeObserver | null = null;
    let layoutSettleTimeoutId: number | null = null;

    const initialFaceId = getFaceIdFromHash(faceIds);
    if (initialFaceId) {
      setCurrentStackedFaceId(initialFaceId);

      const performInitialScroll = () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = null;
          scrollStackedFaceIntoView(initialFaceId, "instant", orientation);
        });
      };

      performInitialScroll();

      layoutSettleObserver = new ResizeObserver(performInitialScroll);
      for (const el of elements) layoutSettleObserver.observe(el);
      layoutSettleObserver.observe(document.documentElement);

      layoutSettleTimeoutId = window.setTimeout(() => {
        layoutSettleObserver?.disconnect();
        layoutSettleObserver = null;
        layoutSettleTimeoutId = null;
      }, LAYOUT_SETTLE_TIMEOUT_MS);
    }

    const updateCurrentFromScroll = () => {
      if (isProgrammaticStackedScroll()) return;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const visiblePastEdge =
          orientation === "HORIZONTAL" ? rect.right : rect.bottom;
        if (visiblePastEdge > CURRENT_FACE_MIN_VISIBLE_PX) {
          setCurrentStackedFaceId(el.getAttribute("data-face-id"));
          return;
        }
      }
    };

    const intersectionObserver =
      elements.length > 0
        ? new IntersectionObserver(updateCurrentFromScroll, { threshold: 0 })
        : null;
    if (intersectionObserver) {
      for (const el of elements) intersectionObserver.observe(el);
    }

    // The hash is written with `silent: true`, which fires no `hashchange`.
    // Publish the position explicitly so chrome mounted outside the deck
    // (the prev/next bar) still tracks scrolls, keys and button taps.
    /* Publishes the slide that is actually centred.
   The IntersectionObserver below reports whichever slide is entering the
   viewport, which during a settle is the neighbour — so the hash and the slide
   indicator trailed by one. Deriving the index from the scroll offset instead
   keeps the label, the progress rail and the visible slide describing the same
   slide.

   The write lands a beat after the press rather than with it: the tracker names
   the intended target before the scroll begins, so re-deriving from the offset
   at that instant would read the slide being left. The settle poll further down
   corrects it once the offset lands, which is why the URL and the counter can
   trail the visible slide by about a second. Publishing the named face directly
   was tried and made the lag lead by one instead, so the offset stays the
   authority here. */
const publishCurrentFace = (faceId: string | null) => {
      if (!faceId) return;
      const index = getCurrentStackedFaceIndex({ faceIds, orientation });
      const centredFaceId = faceIds[index] ?? faceId;
      setFaceIdInHash(centredFaceId, { silent: true });
      setActiveSlideIndex(index);
    };

    publishCurrentFace(getCurrentStackedFaceId());

    const unsubscribeFromTracker = subscribeToStackedFace(() => {
      publishCurrentFace(getCurrentStackedFaceId());
    });

    const syncFromHash = () => {
      const faceId = getFaceIdFromHash(faceIds);
      if (!faceId || faceId === getCurrentStackedFaceId()) return;
      setCurrentStackedFaceId(faceId);
      scrollStackedFaceIntoView(faceId, "smooth", orientation);
    };

    window.addEventListener("scrollend", clearProgrammaticStackedScroll);
    window.addEventListener("hashchange", syncFromHash);

    /* Re-publish once a move has finished. The tracker only fires when the
       intended face id changes, but the scroll animates after that, so the hash
       would keep naming a neighbour for the whole transition. `scrollend` does not
       fire for scripted offset writes, so a poll backs it up; it only writes when
       the hash has actually drifted from the centred slide. */
    const settleTimer = window.setInterval(() => {
      if (isProgrammaticStackedScroll()) return;
      const index = getCurrentStackedFaceIndex({ faceIds, orientation });
      const centred = faceIds[index];
      if (!centred) return;
      if (getFaceIdFromHash(faceIds) !== centred) publishCurrentFace(centred);
    }, 200);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      intersectionObserver?.disconnect();
      layoutSettleObserver?.disconnect();
      unsubscribeFromTracker();
      window.removeEventListener("scrollend", clearProgrammaticStackedScroll);
      window.removeEventListener("hashchange", syncFromHash);
      window.clearInterval(settleTimer);
      if (layoutSettleTimeoutId !== null) {
        window.clearTimeout(layoutSettleTimeoutId);
      }
      window.history.scrollRestoration = previousScrollRestoration;
      setCurrentStackedFaceId(null);
      clearProgrammaticStackedScroll();
    };
  }, [faceIds, orientation]);
}

function getCurrentStackedFaceIndex({
  faceIds,
  orientation,
}: {
  faceIds: string[];
  orientation: StackedOrientation;
}): number {
  /* Nearest slide to the viewport's centre, in layout coordinates.
   *
   * The old test asked which slide still had pixels past the leading edge, which
   * identifies the slide *arriving* rather than the one on screen — so pressing
   * next twice in a row skipped a slide. Measuring against the centre matches
   * what the deck actually shows and needs no minimum-visible threshold. Layout
   * offsets are used rather than rects because the slides carry a 3D transform,
   * which makes a rect no longer match the slide's real box. */
  const container = document.querySelector<HTMLElement>(
    ".stacked-slides-container, .stacked-mobile-slides-container",
  );

  let best = 0;
  if (container) {
    const centre = orientation === "HORIZONTAL"
      ? container.scrollLeft + container.clientWidth / 2
      : container.scrollTop + container.clientHeight / 2;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < faceIds.length; i++) {
      const faceId = faceIds[i];
      if (!faceId) continue;
      const element = document.querySelector<HTMLElement>(
        `[data-face-id="${CSS.escape(faceId)}"]`,
      );
      if (!element) continue;
      const midpoint =
        orientation === "HORIZONTAL"
          ? element.offsetLeft + element.offsetWidth / 2
          : element.offsetTop + element.offsetHeight / 2;
      const distance = Math.abs(midpoint - centre);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }

    return best;
  }

  const trackedFaceId = getCurrentStackedFaceId();
  if (trackedFaceId) {
    const trackedIndex = faceIds.indexOf(trackedFaceId);
    if (trackedIndex !== -1) return trackedIndex;
  }
  return best;
}

function useStackedKeyboardNavigation({
  faceIds,
  orientation,
}: {
  faceIds: string[];
  orientation: StackedOrientation;
}): void {
  useEffect(() => {
    if (faceIds.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const intent = readKeyboardIntent(e);
      if (!intent) return;

      const current = getCurrentStackedFaceIndex({ faceIds, orientation });
      const next = intent.isNext
        ? Math.min(faceIds.length - 1, current + 1)
        : Math.max(0, current - 1);
      if (next === current) return;

      e.preventDefault();

      setTimeout(() => {
        if (e.cancelBubble) return;
        const faceId = faceIds[next];
        if (!faceId) return;
        setCurrentStackedFaceId(faceId);
        scrollStackedFaceIntoView(faceId, "smooth", orientation);
      }, 0);
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [faceIds, orientation]);
}

function useStackedNavigation({
  faceIds,
  orientation,
}: {
  faceIds: string[];
  orientation: StackedOrientation;
}): void {
  useStackedHashScroll({ faceIds, orientation });
  useStackedKeyboardNavigation({ faceIds, orientation });

  const handleNavigateToFace = useCallback(
    ({
      faceId,
      behavior = "smooth",
    }: {
      faceId: string;
      behavior?: ScrollBehavior;
    }) => {
      setCurrentStackedFaceId(faceId);
      scrollStackedFaceIntoView(faceId, behavior, orientation);
    },
    [orientation],
  );
  useRegisterFaceNavigation(handleNavigateToFace);
}

function useIntersection({
  rootMargin,
  threshold,
}: {
  rootMargin?: string;
  threshold?: number;
}): { ref: (node: HTMLElement | null) => void; isIntersecting: boolean } {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsIntersecting(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, rootMargin, threshold]);

  return { ref: setNode, isIntersecting };
}

function StackedSlide({
  face,
  slideWidth,
  slideHeight,
  scaledWidth,
  scaledHeight,
  displayScale,
  isFullscreen,
  componentMap,
}: {
  face: FaceEntry;
  slideWidth: number;
  slideHeight: number;
  scaledWidth: number;
  scaledHeight: number;
  displayScale: number;
  isFullscreen: boolean;
  componentMap: Record<string, ComponentType>;
}) {
  const { ref: mountRef, isIntersecting: isNearViewport } = useIntersection({
    rootMargin: STACKED_MOUNT_ROOT_MARGIN,
  });
  const { ref: visibleRef, isIntersecting: isVisible } = useIntersection({
    threshold: 0.01,
  });

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      mountRef(node);
      visibleRef(node);
    },
    [mountRef, visibleRef],
  );

  const shouldMount = isNearViewport || isVisible;

  return (
    <div
      ref={setRefs}
      id={faceIdToHash(face.id)}
      data-face-id={face.id}
      className="stacked-slide-wrapper"
      style={{
        width: isFullscreen ? "100vw" : scaledWidth,
        /* Reserve the fixed nav's strip. This both re-centres the slide above
           the bar and shortens the container the scale hook measures, so the
           slide can never grow tall enough to slide underneath it. */
        height: isFullscreen ? "100%" : scaledHeight,
        display: isFullscreen ? "grid" : undefined,
        placeItems: isFullscreen ? "center" : undefined,
        zIndex: 1,
      }}
    >
      {isFullscreen ? (
        <div style={{ width: scaledWidth, height: scaledHeight, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: slideWidth,
              height: slideHeight,
              transform: `scale(${displayScale})`,
              transformOrigin: "top left",
            }}
          >
            {shouldMount && (
              <DynamicFaceRender
                faceId={face.id}
                slideWidth={slideWidth}
                slideHeight={slideHeight}
                componentMap={componentMap}
                isVisible={isVisible}
              />
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            width: slideWidth,
            height: slideHeight,
            transform: `scale(${displayScale})`,
            transformOrigin: "top left",
          }}
        >
          {shouldMount && (
            <DynamicFaceRender
              faceId={face.id}
              slideWidth={slideWidth}
              slideHeight={slideHeight}
              componentMap={componentMap}
              isVisible={isVisible}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function StackedSlidesLayout({
  faces,
  componentMap,
  slidesDisplay,
  orientation,
  cardsSlidesPerView,
  cardsBackgroundColor,
  cardsBackgroundImage,
  cornersMode,
  isMobile,
  mobileCanvas,
}: {
  faces: FaceEntry[];
  componentMap: Record<string, ComponentType>;
  slidesDisplay: SlidesDisplay;
  orientation: StackedOrientation;
  cardsSlidesPerView: number;
  cardsBackgroundColor: string;
  cardsBackgroundImage: string;
  cornersMode: CornersMode;
  isMobile: boolean;
  mobileCanvas: MobileCanvas;
}) {
  const visibleFaces = useMemo(
    () => faces.filter((face) => !face.hidden),
    [faces],
  );
  const mobileSlide = getMobileSlideDimensions(mobileCanvas);
  const slideWidth = isMobile ? mobileSlide.width : SLIDE_WIDTH;
  const slideHeight = isMobile ? mobileSlide.height : SLIDE_HEIGHT;

  const containerRef = useRef<HTMLDivElement>(null);
  useReclaimWheelScroll(containerRef);
  useHorizontalWheelScroll({
    ref: containerRef,
    enabled: orientation === "HORIZONTAL",
  });
  /* The reference is `grabbable`: the scene is dragged and thrown. Same
     interaction here, with the throw settling on the nearest slide. */
  useGrabScroll({
    ref: containerRef,
    enabled: orientation === "HORIZONTAL" && slidesDisplay === "FULLSCREEN",
  });
  /* The stack doubles as a 3D corridor: neighbours recede and yaw as the
     centred slide advances. Only meaningful once one slide fills the view. */
  useDeckDepth({
    ref: containerRef,
    enabled: orientation === "HORIZONTAL" && slidesDisplay === "FULLSCREEN",
  });

  const scale = useContainerDimensionScale({
    containerRef,
    orientation,
    slidesDisplay,
    cardsSlidesPerView: isMobile
      ? MIN_CARDS_PEEK_SLIDES_PER_VIEW
      : cardsSlidesPerView,
    slideWidth,
    slideHeight,
    stabilizeViewportHeight: isMobile && orientation === "VERTICAL",
  });
  const displayScale = scale ?? (isMobile ? 0.5 : 1);
  const scaledWidth = slideWidth * displayScale;
  const scaledHeight = slideHeight * displayScale;

  const faceIds = useMemo(
    () => visibleFaces.map((face) => face.id),
    [visibleFaces],
  );
  useStackedNavigation({ faceIds, orientation });

  /* Prev/next and the progress rail live outside this layout, so they drive the
     deck through the shared stepper. Without a handler registered here they are
     inert: the press still advanced the hash, so the deck *looked* like it was
     navigating while the scroll position never moved and the active slide stayed
     exactly where it was. */
  useSlideStepper((direction) => {
    const current = getCurrentStackedFaceIndex({ faceIds, orientation });
    const next = direction === "next" ? current + 1 : current - 1;
    const faceId = faceIds[Math.min(Math.max(next, 0), faceIds.length - 1)];
    if (!faceId) return;
    setCurrentStackedFaceId(faceId);
    scrollStackedFaceIntoView(faceId, "smooth", orientation);
  });

  const isHorizontal = orientation === "HORIZONTAL";
  const displayMode = slidesDisplay === "FULLSCREEN" ? "fullscreen" : "cards";
  const containerClass = isMobile
    ? "stacked-mobile-slides-container"
    : "stacked-slides-container";

  return (
    <div
      ref={containerRef}
      className={containerClass}
      data-slides-display={displayMode}
      data-cards-corners={cornersMode}
      data-orientation={isHorizontal ? "horizontal" : "vertical"}
      style={{
        backgroundColor: "transparent",
        /* In fullscreen the fixed slide nav overlays the bottom strip, so the
           container reserves that space. The scale hook measures this element,
           so reserving here is what keeps the slide from being sized large
           enough to disappear under the bar. */
        height: slidesDisplay === "FULLSCREEN" ? "calc(100dvh - var(--deck-nav-inset, 0px))" : undefined,
      }}
    >
      <CardsBackgroundLayer
        color={cardsBackgroundColor}
        image={cardsBackgroundImage}
      />
      {visibleFaces.map((face) => (
        <StackedSlide
          key={face.id}
          face={face}
          slideWidth={slideWidth}
          slideHeight={slideHeight}
          scaledWidth={scaledWidth}
          scaledHeight={scaledHeight}
          displayScale={displayScale}
          isFullscreen={slidesDisplay === "FULLSCREEN"}
          componentMap={componentMap}
        />
      ))}
    </div>
  );
}
