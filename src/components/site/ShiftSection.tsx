import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Shift } from "@/content/shifts";

type Props = {
  shift: Shift;
  /* branch #45.2 hangs its interactive demo here. left empty, the section
     renders as a complete static composition. */
  demo?: ReactNode;
  className?: string;
};

/* the shared shell every one of the five shift sections renders through.
   layout and rhythm live here; copy lives in content/shifts.ts; each shift
   keeps its own component file so a demo can be added to one without
   touching the other four. */
export function ShiftSection({ shift, demo, className }: Props) {
  return (
    <section
      id={shift.id}
      aria-labelledby={`${shift.id}-title`}
      className={cn("border-t border-border scroll-mt-24", className)}
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-40">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <div className="font-mono text-6xl leading-none font-medium tracking-tight text-primary tabular-nums lg:text-7xl">
              {shift.n}
            </div>
            <p className="mt-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {shift.label}
            </p>
          </div>
        </div>

        <div className="lg:col-span-9">
          <h2
            id={`${shift.id}-title`}
            className="max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {shift.title}
          </h2>

          <p className="mt-8 max-w-2xl border-l-2 border-primary pl-6 text-lg leading-relaxed text-pretty sm:text-xl">
            {shift.claim}
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-house)] border border-border bg-border sm:grid-cols-2">
            <div className="bg-card p-6 sm:p-8">
              <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                v5
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">{shift.v5}</p>
            </div>
            <div className="relative bg-card p-6 sm:p-8">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-px bg-primary sm:w-0.5"
              />
              <p className="font-mono text-xs tracking-widest text-primary uppercase">v6</p>
              <p className="mt-3 leading-relaxed text-foreground">{shift.v6}</p>
            </div>
          </div>

          <div className="mt-12 max-w-prose space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {shift.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {demo ? <div className="mt-16">{demo}</div> : null}

          <p className="mt-12 font-mono text-sm tracking-tight text-foreground">
            <span className="text-primary" aria-hidden>
              /{" "}
            </span>
            {shift.close}
          </p>
        </div>
      </div>
    </section>
  );
}
