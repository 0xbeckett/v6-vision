import { usePrefersReducedMotion } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";

/* the thesis in two small drawings. v5 is a line: a human pushes, it acts, it
   stops, it waits. v6 is a loop: closed, self-running, a human tethered
   outside. one accent, minimal ink. */

function V5Line() {
  return (
    <svg viewBox="0 0 320 120" className="h-auto w-full" role="img" aria-label="v5: a human invokes beckett, it acts once, then stops and waits.">
      <text x="26" y="44" textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 11 }}>
        human
      </text>
      <circle cx="26" cy="66" r="6" fill="var(--color-muted-foreground)" />
      <line x1="36" y1="66" x2="150" y2="66" stroke="var(--color-border)" strokeWidth="2" />
      <path d="M144 61 L154 66 L144 71 z" fill="var(--color-muted-foreground)" />
      <text x="180" y="44" textAnchor="middle" className="fill-foreground font-mono" style={{ fontSize: 11 }}>
        beckett
      </text>
      <circle cx="180" cy="66" r="6" fill="var(--color-foreground)" />
      <line x1="190" y1="66" x2="272" y2="66" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="2 5" />
      {/* the dead end */}
      <line x1="278" y1="52" x2="278" y2="80" stroke="var(--color-muted-foreground)" strokeWidth="2.5" strokeLinecap="round" />
      <text x="234" y="100" textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 10.5, letterSpacing: "0.04em" }}>
        acts once · then waits
      </text>
    </svg>
  );
}

function V6Loop() {
  const reduced = usePrefersReducedMotion();
  const cx = 160;
  const cy = 62;
  const r = 34;
  return (
    <svg viewBox="0 0 320 120" className="h-auto w-full" role="img" aria-label="v6: a closed loop that keeps itself running, with a human tethered outside it.">
      {/* the loop */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-border)" strokeWidth="2" />
      <path d={`M ${cx + r} ${cy} a ${r} ${r} 0 0 1 -6 ${r * 0.62}`} fill="none" stroke="var(--color-muted-foreground)" strokeWidth="0" />
      {/* direction arrowhead */}
      <path d="M-6 -5 L6 0 L-6 5 z" fill="var(--color-muted-foreground)" opacity="0.6" transform={`translate(${cx} ${cy - r}) rotate(90)`} />
      {/* orbiting pulse */}
      <g>
        {!reduced && (
          <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="6s" repeatCount="indefinite" />
        )}
        <circle cx={cx} cy={cy - r} r="8" fill="var(--color-primary)" opacity="0.16" />
        <circle cx={cx} cy={cy - r} r="4" fill="var(--color-primary)" />
      </g>
      {/* human tethered outside */}
      <circle cx="278" cy="62" r="6" fill="var(--color-muted-foreground)" />
      <text x="278" y="40" textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 11 }}>
        human
      </text>
      <line x1="272" y1="62" x2={cx + r + 4} y2="62" stroke="var(--color-muted-foreground)" strokeWidth="1.5" strokeDasharray="2 5" opacity="0.7" />
      <text x={cx} y={cy + 4} textAnchor="middle" className="fill-foreground font-mono" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
        LOOP
      </text>
      <text x="130" y="112" textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 10.5, letterSpacing: "0.04em" }}>
        never stops · veto outside
      </text>
    </svg>
  );
}

export function InvocationContrast() {
  return (
    <section
      id="invocation"
      aria-labelledby="invocation-title"
      className="border-t border-border bg-muted/40 scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <Reveal>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            v5 vs v6 · the difference in one shape
          </p>
          <h2
            id="invocation-title"
            className="mt-10 max-w-4xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            every beckett before this was a line. v6 is a loop.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-house)] border border-border bg-border md:grid-cols-2">
          <Reveal as="div" className="bg-card p-6 sm:p-10">
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              v5 · invoked
            </p>
            <div className="mt-8">
              <V5Line />
            </div>
            <p className="mt-8 max-w-sm leading-relaxed text-muted-foreground">
              something has to arrive first — a mention, a ticket, a nudge. it does the thing, then
              it is done. left alone, it does nothing, indefinitely.
            </p>
          </Reveal>

          <Reveal as="div" delay={120} className="relative bg-card p-6 sm:p-10">
            <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              v6 · autonomous
            </p>
            <div className="mt-8">
              <V6Loop />
            </div>
            <p className="mt-8 max-w-sm leading-relaxed text-foreground">
              nothing has to arrive. it perceives, decides, acts, and checks itself on a clock it
              owns. you are the dashed line — attached, able to stop it, no longer driving it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
