import { SHIFTS } from "@/content/shifts";
import { Reveal } from "@/components/ui/Reveal";

/* the five shifts, reframed as the machinery of autonomy — one row per loop
   stage, each a v5 → v6 contrast. this is the "how" behind the ring diagram;
   the numbers and stage names line up with it on purpose. */
export function Machinery() {
  return (
    <section
      id="machinery"
      aria-labelledby="machinery-title"
      className="border-t border-border bg-muted/40 scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <Reveal>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            the machinery
          </p>
          <h2
            id="machinery-title"
            className="mt-10 max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            five shifts. each one is a move of the loop.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            free will and taste are the claim. these are the parts that make the claim true — the
            same five stages the ring above walks, said as what actually had to change.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-px overflow-hidden rounded-[var(--radius-house)] border border-border bg-border">
          {SHIFTS.map((s, i) => (
            <Reveal
              as="div"
              key={s.id}
              delay={i * 60}
              className="grid gap-6 bg-card p-6 sm:p-8 lg:grid-cols-12 lg:gap-8"
            >
              <div className="lg:col-span-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-3xl leading-none font-medium tracking-tight text-primary tabular-nums sm:text-4xl">
                    {s.n}
                  </span>
                  <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                    {s.stage}
                  </span>
                </div>
                <h3 className="mt-4 text-lg leading-snug font-semibold tracking-tight">
                  {s.label}
                </h3>
              </div>

              <div className="lg:col-span-9">
                <p className="max-w-2xl border-l-2 border-primary pl-5 leading-relaxed text-pretty text-foreground">
                  {s.claim}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                      v5&nbsp;·&nbsp;
                    </span>
                    {s.v5}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    <span className="font-mono text-[11px] tracking-widest text-primary uppercase">
                      v6&nbsp;·&nbsp;
                    </span>
                    {s.v6}
                  </p>
                </div>
                <p className="mt-6 font-mono text-xs tracking-tight text-muted-foreground">
                  <span className="text-primary" aria-hidden>
                    /{" "}
                  </span>
                  {s.close}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
