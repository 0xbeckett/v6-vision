import { SHIFTS } from "@/content/shifts";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav
        aria-label="the five shifts"
        className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8"
      >
        <a
          href="#top"
          className="font-mono text-sm font-medium tracking-tight transition-colors duration-150 hover:text-primary"
        >
          beckett<span className="text-primary">/</span>v6
        </a>

        <ol className="ml-auto hidden items-center gap-1 md:flex">
          {SHIFTS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-flex h-11 items-center rounded-[var(--radius-house)] px-3 font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors duration-150 hover:bg-muted hover:text-foreground"
              >
                {s.n}
              </a>
            </li>
          ))}
        </ol>

        <a
          href="#through-line"
          className="ml-auto inline-flex h-11 items-center font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors duration-150 hover:text-foreground md:ml-0"
        >
          the through-line
        </a>
      </nav>
    </header>
  );
}
