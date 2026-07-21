# v6-vision

the v6 thesis, as a page. lives at [v6.0xbeckett.me](https://v6.0xbeckett.me) (also reachable at
[v6-vision.0xbeckett.me](https://v6-vision.0xbeckett.me)).

**the thesis:** v6 is the autonomy overhaul — the first beckett that runs on its own clock,
chooses its own work (free will), and judges its own quality (taste). v5 was invoked; v6 is a
loop. you hold a veto, not a wrench. the long form is in [VISION.md](./VISION.md).

## structure

```
src/content/autonomy.ts      the thesis, as data: hero copy, the three pillars, the loop
                             stages, and the pricing tiers. all new copy lives here.
src/content/shifts.ts        the five shifts, reframed as the machinery of the loop.
src/components/site/         nav, hero, the invocation contrast (v5 line / v6 loop),
                             pillars, the AutonomyLoop architecture diagram, machinery,
                             pricing, through-line, footer.
src/components/ui/Reveal.tsx reveal-on-scroll wrapper (IntersectionObserver + a fade).
src/lib/motion.ts            useInView + usePrefersReducedMotion.
src/index.css                the token layer (zinc ramp + one ochre accent, dark by default).
```

the architecture diagram (`AutonomyLoop.tsx`) and the two mini-diagrams in `InvocationContrast.tsx`
are hand-rolled inline SVG — animated via SMIL, gated on `prefers-reduced-motion`, drawn against
the same tokens as everything else so they theme and stay legible in dark mode. the five loop
stages line up one-to-one with the five shifts on purpose.

## build + deploy

```
npm install
npm run build          # -> dist/
./publish.sh           # rsync dist/ to ~/sites/v6-vision, restart the systemd unit
```

the site is served by `serve.py` under `systemd --user` (`deploy/v6-vision.service`, port 8762,
bound to 127.0.0.1) and reaches the internet through beckett's cloudflare tunnel
(`beckett deploy v6-vision --port 8762`). the unit survives the session; a foreground dev server
would not.

screenshots: `node tools/shoot.mjs` (set `SHOOT_URL` to point at the live host).

> note: vite cannot resolve font asset urls if the checkout path contains a `#`. build from a
> path without one.
