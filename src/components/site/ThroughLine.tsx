export function ThroughLine() {
  return (
    <section
      id="through-line"
      aria-labelledby="through-line-title"
      className="border-t border-border bg-muted/40 scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          the through-line
        </p>

        <h2
          id="through-line-title"
          className="mt-10 max-w-4xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          five shifts. one claim, said five ways.
        </h2>

        <div className="mt-12 max-w-prose space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            an assistant is measured by how well it does what you said. a coworker is measured by
            whether the thing got done.
          </p>
          <p>
            everything above is what it takes to be measured the second way: a self that persists,
            a clock of its own, a team that compounds, eyes on the running product, and a hand it
            can put on itself.
          </p>
        </div>

        <p className="mt-16 max-w-3xl border-l-2 border-primary pl-6 text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
          v6 is the version that stops waiting to be asked.
        </p>
      </div>
    </section>
  );
}
