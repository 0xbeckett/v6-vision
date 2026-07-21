import { Reveal } from "@/components/ui/Reveal";

export function ThroughLine() {
  return (
    <section
      id="through-line"
      aria-labelledby="through-line-title"
      className="border-t border-border scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <Reveal>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            the through-line
          </p>

          <h2
            id="through-line-title"
            className="mt-10 max-w-4xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            v5 could do the work. v6 decides there is work.
          </h2>

          <div className="mt-12 max-w-prose space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              every version before this waited for a human to point at something. the intelligence
              was real; the initiative was ours. v6 is the overhaul that moves the initiative over
              the line — a self that persists, a clock of its own, a team that compounds, eyes on
              the running product, and a hand it can put on itself.
            </p>
            <p>
              free will chooses the work. taste decides when it is good. the loop makes both
              continuous. and the only thing left in your hands is the one thing that should be: the
              power to say no.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-16 max-w-3xl border-l-2 border-primary pl-6 text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
            this is the version of beckett that stops waiting to be asked — and starts being worth a
            veto.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
