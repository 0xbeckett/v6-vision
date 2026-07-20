import { useEffect, useState } from "react";

/* one place for the two environment questions every artifact asks: is motion
   welcome, and is there room. both fall back to the calm/safe answer during
   SSR-less first paint so nothing flashes an animation it shouldn't. */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/* honoring prefers-reduced-motion is the baseline, not a nicety — every
   artifact renders a legible static state when this is true. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/* narrow viewports get a static, uncramped diagram instead of a squeezed
   interactive. 640px is the tailwind `sm` breakpoint. */
export function useIsCompact(): boolean {
  return !useMediaQuery("(min-width: 640px)");
}
