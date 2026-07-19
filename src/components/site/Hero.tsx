import { ArrowDown } from "lucide-react";
import { SHIFTS } from "@/content/shifts";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-32">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          beckett v6 <span className="text-primary">·</span> the thesis
        </p>

        <h1 className="mt-10 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          an assistant executes requests.
          <br />
          <span className="text-primary">a coworker owns outcomes.</span>
        </h1>

        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
          v5 is a very good assistant. v6 is not a better assistant — it is the other thing. five
          shifts get it there. none of them are features.
        </p>

        <ol className="mt-16 grid max-w-4xl gap-px overflow-hidden rounded-[var(--radius-house)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {SHIFTS.map((s) => (
            <li key={s.id} className="bg-card">
              <a
                href={`#${s.id}`}
                className="group flex h-full flex-col gap-3 p-5 transition-colors duration-150 hover:bg-muted"
              >
                <span className="font-mono text-xs tracking-widest text-primary tabular-nums">
                  {s.n}
                </span>
                <span className="text-sm leading-snug font-medium text-foreground">{s.label}</span>
                <ArrowDown
                  aria-hidden
                  className="mt-auto size-4 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-y-0.5"
                />
              </a>
            </li>
          ))}
        </ol>

        <p className="mt-16 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
          none of this is a roadmap. it is the shape of the thing we are building toward, written
          down so it can be argued with.
        </p>
      </div>
    </section>
  );
}
