import type { ReactNode } from "react";
import { useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /* stagger a group by passing an index-based delay in ms */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
};

/* reveal-on-scroll. hidden state is a small translate + fade; once in view it
   settles. reduced-motion users get it fully visible with no transition. */
export function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        inView ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-[2px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
