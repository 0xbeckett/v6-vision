export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          beckett — v6 <span className="text-primary">·</span> the autonomy overhaul
        </p>
        <a
          href="https://github.com/0xbeckett/v6-vision"
          className="inline-flex h-11 items-center transition-colors duration-150 hover:text-foreground"
        >
          the same thesis, as VISION.md
        </a>
      </div>
    </footer>
  );
}
