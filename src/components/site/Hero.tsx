import { ArrowDown } from "lucide-react";
import { HERO } from "@/content/autonomy";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-28">
        <p className="animate-in font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {HERO.eyebrow}
        </p>

        <h1 className="animate-in mt-10 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance [animation-delay:80ms] sm:text-6xl lg:text-7xl">
          {HERO.title[0]}
          <br />
          <span className="text-primary">{HERO.title[1]}</span>
        </h1>

        <p className="animate-in mt-10 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground [animation-delay:160ms] sm:text-xl">
          {HERO.lede}
        </p>

        <p className="animate-in mt-8 max-w-2xl border-l-2 border-primary pl-6 text-xl leading-tight font-semibold tracking-tight text-balance [animation-delay:220ms] sm:text-2xl">
          {HERO.kicker}
        </p>

        <a
          href="#invocation"
          className="animate-in group mt-16 inline-flex h-11 items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors duration-150 [animation-delay:300ms] hover:text-foreground"
        >
          why this is a different thing
          <ArrowDown
            aria-hidden
            className="size-4 transition-transform duration-200 ease-out group-hover:translate-y-0.5"
          />
        </a>
      </div>
    </section>
  );
}
