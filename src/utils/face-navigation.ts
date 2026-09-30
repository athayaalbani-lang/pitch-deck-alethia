import { useEffect, useRef } from "react";

export type FaceScrollBehavior = "auto" | "instant" | "smooth";

export interface NavigateToOptions {
  faceId: string;
  behavior?: FaceScrollBehavior;
}

export interface SlideInfo {
  faceId: string;
  name: string;
  index: number;
}

interface RegisteredFace {
  id: string;
  name?: string;
  hidden?: boolean;
}

let registeredSlides: readonly SlideInfo[] = [];

/**
 * The layout owns the real slide position, but it writes the hash with
 * `history.replaceState` + `silent`, which fires no `hashchange`. Without this
 * mirror, UI outside the layout would only ever see the position from a
 * full page load and would never update on arrow keys, swipe or button taps.
 */
let activeSlideIndex: number | null = null;

const stepListeners = new Set<() => void>();

function notifyStepListeners() {
  stepListeners.forEach((listener) => listener());
}

export function setActiveSlideIndex(index: number): void {
  if (activeSlideIndex === index) return;
  activeSlideIndex = index;
  notifyStepListeners();
}

function slidesEqual({
  a,
  b,
}: {
  a: readonly SlideInfo[];
  b: readonly SlideInfo[];
}): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (slide, index) =>
      slide.faceId === b[index].faceId && slide.name === b[index].name,
  );
}

export function registerFaceList({
  faces,
}: {
  faces: RegisteredFace[];
}): () => void {
  const nextSlides = Object.freeze(
    faces
      .filter((face) => !face.hidden)
      .map((face, index) =>
        Object.freeze({
          faceId: face.id,
          name: face.name ?? face.id,
          index,
        }),
      ),
  );
  const slides = slidesEqual({ a: registeredSlides, b: nextSlides })
    ? registeredSlides
    : nextSlides;
  registeredSlides = slides;
  // Deliberately not clearing activeSlideIndex here: child layout effects run
  // before the parent's registration effect, so wiping it would discard a
  // position the layout has already published. getCurrentSlideIndex clamps.
  notifyStepListeners();
  return () => {
    if (registeredSlides === slides) {
      registeredSlides = [];
      activeSlideIndex = null;
      notifyStepListeners();
    }
  };
}

export function useRegisterFaceList({ faces }: { faces: RegisteredFace[] }) {
  const facesRef = useRef(faces);
  facesRef.current = faces;
  const facesKey = JSON.stringify(
    faces.map((face) => [face.id, face.name ?? null, face.hidden ?? false]),
  );
  useEffect(() => {
    const unregister = registerFaceList({ faces: facesRef.current });
    return unregister;
  }, [facesKey]);
}

export function getSlides(): readonly SlideInfo[] {
  return registeredSlides;
}

function normalizeSlideQuery({ value }: { value: string }): string {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

export function resolveFaceId({ query }: { query: string }): string | null {
  if (typeof query !== "string") return null;
  const trimmed = query.trim();
  if (!trimmed) return null;
  const exactId = registeredSlides.find((slide) => slide.faceId === trimmed);
  if (exactId) return exactId.faceId;
  const normalized = normalizeSlideQuery({ value: trimmed });
  if (normalized) {
    const match = registeredSlides.find(
      (slide) =>
        normalizeSlideQuery({ value: slide.faceId }) === normalized ||
        normalizeSlideQuery({ value: slide.name }) === normalized,
    );
    if (match) return match.faceId;
  }
  return findFaceElement(trimmed) ? trimmed : null;
}

type NavigateHandler = (options: NavigateToOptions) => void;

const NAVIGATE_GUARD_MS = 300;

let activeHandler: NavigateHandler | null = null;
let lastNavigateAt = 0;

function registerFaceNavigationHandler(
  handler: NavigateHandler | null,
): () => void {
  activeHandler = handler;
  return () => {
    if (activeHandler === handler) {
      activeHandler = null;
    }
  };
}

export function useRegisterFaceNavigation(handler: NavigateHandler) {
  useEffect(() => {
    const unregister = registerFaceNavigationHandler(handler);
    return unregister;
  }, [handler]);
}

export function wasJustNavigated(ms: number = NAVIGATE_GUARD_MS): boolean {
  return Date.now() - lastNavigateAt < ms;
}

function findFaceElement(faceId: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const escaped = CSS.escape(faceId);
  return document.querySelector<HTMLElement>(
    `[data-face-root-id="${escaped}"], [data-face-id="${escaped}"]`,
  );
}

export function notifyContentRevealState(_: unknown): void {}

export function notifyFaceRevealCompleted(_: unknown): void {}

export function notifyUserScrollTakeover(): void {}

export function scrollToFace({
  faceId,
  behavior = "smooth",
}: {
  faceId: string;
  behavior?: FaceScrollBehavior;
}): boolean {
  const element = findFaceElement(faceId);
  if (!element) return false;
  element.scrollIntoView({ behavior, block: "start" });
  return true;
}

export function scrollEditorToFace(..._: unknown[]): void {}

export function useScrollableNavigateToFace(..._: unknown[]): void {}

export function navigateTo(options: NavigateToOptions): void {
  lastNavigateAt = Date.now();
  const resolvedOptions: NavigateToOptions = {
    ...options,
    faceId: resolveFaceId({ query: options.faceId }) ?? options.faceId,
  };
  if (activeHandler) {
    activeHandler(resolvedOptions);
    return;
  }
  scrollToFace(resolvedOptions);
}

/* ------------------------------------------------------------------ *
 * Slide stepping — lets UI that lives outside the layout (for example a
 * "next slide" button) drive the deck without knowing how it is rendered.
 * ------------------------------------------------------------------ */

export type SlideDirection = "next" | "prev";

let stepHandler: ((direction: SlideDirection) => void) | null = null;

export function registerSlideStepper(
  handler: ((direction: SlideDirection) => void) | null,
): () => void {
  stepHandler = handler;
  notifyStepListeners();
  return () => {
    if (stepHandler === handler) {
      stepHandler = null;
      notifyStepListeners();
    }
  };
}

export function useSlideStepper(handler: (direction: SlideDirection) => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  useEffect(() => {
    return registerSlideStepper((direction) => handlerRef.current(direction));
  }, []);
}

/** Subscribe to slide-count changes. Returns an unsubscribe function. */
export function subscribeToSlides(listener: () => void): () => void {
  stepListeners.add(listener);
  return () => {
    stepListeners.delete(listener);
  };
}

export function stepSlide(direction: SlideDirection): void {
  if (stepHandler) {
    stepHandler(direction);
    return;
  }
  // Fallback for contexts without the deck layout mounted.
  const slides = registeredSlides;
  if (slides.length === 0) return;
  const current = getCurrentSlideIndex();
  const next = current + (direction === "next" ? 1 : -1);
  const target = slides[Math.min(Math.max(next, 0), slides.length - 1)];
  if (target) {
    navigateTo({ faceId: target.faceId });
  }
}

export function getSlideCount(): number {
  return registeredSlides.length;
}

/** Jump straight to a slide by its zero-based position. */
export function goToSlideIndex(index: number): void {
  const target = registeredSlides[index];
  if (!target) return;
  navigateTo({ faceId: target.faceId });
}

export function getCurrentSlideIndex(): number {
  // The layout pushes the authoritative position; trust it over the hash.
  if (activeSlideIndex !== null) {
    return Math.min(Math.max(activeSlideIndex, 0), Math.max(registeredSlides.length - 1, 0));
  }
  if (typeof window === "undefined") return 0;
  const fromHash = window.location.hash.replace(/^#/, "");
  const index = registeredSlides.findIndex(
    (slide) => slide.faceId === fromHash,
  );
  return index === -1 ? 0 : index;
}
