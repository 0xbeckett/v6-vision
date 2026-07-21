import { useEffect, useRef, useState } from "react";

/* fires once when the element scrolls into view. reveal-on-scroll is built on
   this — the transition itself lives in the Reveal component's classes. */
export function useInView<T extends Element = HTMLDivElement>(rootMargin = "-12% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}

/* honor the OS setting for anything decorative — the SMIL loop pulse checks
   this and renders static when motion is unwelcome. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
