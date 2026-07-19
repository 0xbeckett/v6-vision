# v6-vision

the v6 thesis, as a page. lives at [v6.0xbeckett.me](https://v6.0xbeckett.me).

the thesis itself is in [VISION.md](./VISION.md) — the site is that document, laid out.

## structure

```
src/content/shifts.ts        the five shifts, as data. all copy lives here.
src/components/site/         hero, nav, the shared ShiftSection shell, through-line, footer
src/components/shifts/       one component per shift — Shift01… through Shift05…
src/index.css                the token layer (zinc ramp + one ochre accent, dark by default)
```

each of the five shifts is its own component so an interactive layer can be added to one
without touching the other four. `ShiftSection` takes an optional `demo` node — that is the
slot the demos go in.

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
