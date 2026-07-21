const LINKS = [
  { href: "#invocation", label: "the shift" },
  { href: "#architecture", label: "architecture" },
  { href: "#machinery", label: "machinery" },
  { href: "#pricing", label: "pricing" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav
        aria-label="primary"
        className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8"
      >
        <a
          href="#top"
          className="font-mono text-sm font-medium tracking-tight transition-colors duration-150 hover:text-primary"
        >
          beckett<span className="text-primary">/</span>v6
        </a>

        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="inline-flex h-11 items-center rounded-[var(--radius-house)] px-3 font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors duration-150 hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#pricing"
          className="ml-auto inline-flex h-11 items-center rounded-[var(--radius-house)] bg-primary px-4 font-mono text-xs tracking-widest text-primary-foreground uppercase transition-colors duration-150 hover:bg-primary/90 md:ml-2"
        >
          hire it
        </a>
      </nav>
    </header>
  );
}
