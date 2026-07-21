import { Check } from "lucide-react";
import { TIERS } from "@/content/autonomy";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

/* beckett pricing itself. the axis is not seats or tokens — it is how much of
   the loop you hand over. three tiers, the middle one recommended. */
export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="border-t border-border scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <Reveal>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            what it costs
          </p>
          <h2
            id="pricing-title"
            className="mt-10 max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            priced by how much you hand over.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            no seats. no per-token meter. you are not renting a login — you are deciding how much
            of the loop runs without you. the number is what an outcome-owning coworker is worth.
          </p>
        </Reveal>

        <div className="mt-16 grid items-start gap-6 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal
              as="div"
              key={t.id}
              delay={i * 90}
              className={cn(
                "flex h-full flex-col rounded-[var(--radius-house)] border bg-card p-6 transition-colors duration-200 sm:p-8",
                t.featured
                  ? "border-primary/60 shadow-[0_0_0_1px_var(--color-primary)] ring-1 ring-primary/20 lg:-translate-y-2"
                  : "border-border hover:border-muted-foreground/40",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold tracking-tight">{t.name}</h3>
                {t.badge ? (
                  <span className="rounded-full bg-primary px-2.5 py-1 font-mono text-[10px] tracking-widest text-primary-foreground uppercase">
                    {t.badge}
                  </span>
                ) : null}
              </div>

              <p className="mt-3 min-h-[2.75rem] text-sm leading-relaxed text-muted-foreground">
                {t.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight tabular-nums">
                  {t.price}
                </span>
                {t.period ? (
                  <span className="font-mono text-sm text-muted-foreground">{t.period}</span>
                ) : null}
              </div>

              <a
                href="#top"
                className={cn(
                  "mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-house)] px-4 font-mono text-xs tracking-widest uppercase transition-colors duration-150",
                  t.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:bg-muted",
                )}
              >
                {t.cta}
              </a>

              <div className="my-7 h-px bg-border" />

              <ul className="flex flex-col gap-4">
                {t.rows.map((row) => (
                  <li key={row.k} className="flex gap-3">
                    <Check
                      aria-hidden
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        t.featured ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className="text-sm leading-snug">
                      <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        {row.k}
                      </span>
                      <span className="mt-0.5 block text-foreground">{row.v}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-12 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
            <span className="text-primary">/</span> every tier holds the same non-negotiable: the
            veto is yours and the stop button always works. autonomy is the product; control is the
            floor under it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
