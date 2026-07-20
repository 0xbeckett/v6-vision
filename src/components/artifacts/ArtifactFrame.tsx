import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* the shared instrument shell. every one of the five artifacts renders through
   this so they read as one family: a hairline-bordered card, a mono caption
   rail up top, and the interactive body below. no shadows, no gradients — depth
   comes from the border and a half-step surface shift, per the house style. */

type FrameProps = {
  /* mono label, upper-left — names the instrument */
  label: string;
  /* one-line, plain-language cue for what to do — upper-right on desktop */
  hint: string;
  children: ReactNode;
  className?: string;
};

export function ArtifactFrame({ label, hint, children, className }: FrameProps) {
  return (
    <figure
      className={cn(
        "not-prose overflow-hidden rounded-[var(--radius-house)] border border-border bg-card",
        className,
      )}
    >
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border px-4 py-3 sm:px-6">
        <span className="font-mono text-xs tracking-widest text-primary uppercase">
          <span aria-hidden>▸ </span>
          {label}
        </span>
        <span className="font-mono text-[0.7rem] tracking-wide text-muted-foreground">{hint}</span>
      </figcaption>
      <div className="p-4 sm:p-6">{children}</div>
    </figure>
  );
}

/* the house pushbutton. real <button>, all interaction states, fast transition,
   tokens only. `tone` picks neutral vs the one accent for the primary move. */
export function ControlButton({
  children,
  onClick,
  disabled,
  tone = "neutral",
  className,
  ...rest
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "neutral" | "primary";
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-house)] px-4 font-mono text-xs tracking-widest uppercase transition-colors duration-150 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-40",
        tone === "primary"
          ? "bg-primary text-primary-foreground hover:brightness-110 active:brightness-95"
          : "border border-border bg-muted text-foreground hover:bg-border active:bg-border/70",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* two-swatch key so the v5/v6 split reads without relying on color alone. */
export function Legend({ v5, v6 }: { v5: string; v6: string }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.7rem] tracking-wide text-muted-foreground">
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="size-2.5 rounded-full border border-muted-foreground/60" />
        v5 — {v5}
      </span>
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="size-2.5 rounded-full bg-primary" />
        v6 — {v6}
      </span>
    </div>
  );
}
