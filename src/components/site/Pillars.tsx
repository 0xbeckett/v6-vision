import { PILLARS } from "@/content/autonomy";
import { Reveal } from "@/components/ui/Reveal";

/* free will and taste, made first-class — plus the one thing left for the
   human. three cards, the reading spine of the whole page. */
export function Pillars() {
  return (
    <section
      id="pillars"
      aria-labelledby="pillars-title"
      className="border-t border-border scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <Reveal>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            what changed
          </p>
          <h2
            id="pillars-title"
            className="mt-10 max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            two new faculties, and a smaller job for you.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            "proactive" undersells it. v6 has a will — it picks its own work — and it has taste —
            it judges its own quality. those are not features. they are the difference between a
            tool and a colleague.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-house)] border border-border bg-border md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal as="div" key={p.id} delay={i * 90} className="flex flex-col gap-4 bg-card p-6 sm:p-8">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs tracking-widest text-primary tabular-nums">
                  0{i + 1}
                </span>
                <h3 className="text-2xl font-semibold tracking-tight">{p.term}</h3>
              </div>
              <p className="font-mono text-xs tracking-wide text-muted-foreground">{p.gloss}</p>
              <p className="mt-1 leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
