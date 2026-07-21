import { LOOP } from "@/content/autonomy";
import { usePrefersReducedMotion } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";

/* the architecture, drawn. five stages on a ring the system walks by itself,
   clockwise, forever — a pulse sweeps it on its own clock. the human sits
   outside with a dashed tether: it can halt the loop, it cannot drive it.
   pure inline SVG so it is legible, themeable, and part of the page rather
   than an image dropped on top of it. */

const VB = { w: 900, h: 680 };
const C = { x: 424, y: 388 };
const R = 196;
const NODE = { w: 168, h: 60 };

/* five nodes, evenly spaced, first one at the top (-90deg), going clockwise. */
const ANGLES = [-90, -18, 54, 126, 198];

function pt(deg: number, radius: number) {
  const r = (deg * Math.PI) / 180;
  return { x: C.x + radius * Math.cos(r), y: C.y + radius * Math.sin(r) };
}

export function AutonomyLoop() {
  const reduced = usePrefersReducedMotion();

  const nodes = LOOP.map((node, i) => ({ ...node, angle: ANGLES[i], ...pt(ANGLES[i], R) }));

  /* midpoint arrowheads that show the walk direction (clockwise). */
  const arrows = ANGLES.map((a, i) => {
    const next = ANGLES[(i + 1) % ANGLES.length];
    const mid = a + (((next - a + 360) % 360) / 2);
    const p = pt(mid, R);
    return { ...p, rot: mid + 90 };
  });

  /* the sweeping pulse: a bright head + trailing arc, rotated around center. */
  const head = pt(-90, R);
  const tail = pt(-124, R);

  /* dashed tether from the human node down to the decide→dispatch edge — the
     moment the loop turns a decision into action, which is what a veto gates. */
  const human = { x: 726, y: 150 };
  const gate = pt(2, R);

  return (
    <section
      id="architecture"
      aria-labelledby="architecture-title"
      className="border-t border-border scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <Reveal>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            the architecture
          </p>
          <h2
            id="architecture-title"
            className="mt-10 max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            one loop, walked without a hand on it.
          </h2>
          <p className="mt-8 max-w-2xl border-l-2 border-primary pl-6 text-lg leading-relaxed text-pretty sm:text-xl">
            perceive, decide on its own clock, dispatch a standing team, watch the running result,
            self-modify — then again. no stage waits for a human to advance it.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-16">
          <figure className="overflow-hidden rounded-[var(--radius-house)] border border-border bg-card">
            <div className="grid-field pointer-events-none relative">
              <svg
                viewBox={`0 0 ${VB.w} ${VB.h}`}
                className="relative block h-auto w-full"
                role="img"
                aria-label="The v6 autonomous loop: perceive, decide on its own clock, dispatch a standing team, watch the running result, and self-modify — cycling continuously. A human node sits outside the loop, tethered by a dashed line, able to veto but not to drive."
              >
                <defs>
                  <radialGradient id="loop-core" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.12" />
                    <stop offset="70%" stopColor="var(--color-primary)" stopOpacity="0" />
                  </radialGradient>
                  <marker
                    id="loop-arrow"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 0 L10 5 L0 10 z" fill="var(--color-muted-foreground)" />
                  </marker>
                </defs>

                {/* soft core glow */}
                <circle cx={C.x} cy={C.y} r={R - 6} fill="url(#loop-core)" />

                {/* the ring the system walks */}
                <circle
                  cx={C.x}
                  cy={C.y}
                  r={R}
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth={1.5}
                />

                {/* direction arrowheads at each edge midpoint */}
                {arrows.map((a, i) => (
                  <path
                    key={i}
                    d="M-6 -5 L6 0 L-6 5 z"
                    fill="var(--color-muted-foreground)"
                    opacity={0.55}
                    transform={`translate(${a.x} ${a.y}) rotate(${a.rot})`}
                  />
                ))}

                {/* the sweeping pulse — its own clock */}
                <g>
                  {!reduced && (
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${C.x} ${C.y}`}
                      to={`360 ${C.x} ${C.y}`}
                      dur="9s"
                      repeatCount="indefinite"
                    />
                  )}
                  <path
                    d={`M ${tail.x} ${tail.y} A ${R} ${R} 0 0 1 ${head.x} ${head.y}`}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    opacity={0.9}
                  />
                  <circle cx={head.x} cy={head.y} r={11} fill="var(--color-primary)" opacity={0.18} />
                  <circle cx={head.x} cy={head.y} r={5} fill="var(--color-primary)" />
                </g>

                {/* center label */}
                <text
                  x={C.x}
                  y={C.y - 8}
                  textAnchor="middle"
                  className="fill-foreground font-mono"
                  style={{ fontSize: 15, letterSpacing: "0.18em" }}
                >
                  THE LOOP
                </text>
                <text
                  x={C.x}
                  y={C.y + 18}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono"
                  style={{ fontSize: 12.5 }}
                >
                  runs on its own clock
                </text>

                {/* the five stage nodes */}
                {nodes.map((n) => (
                  <g key={n.n}>
                    <rect
                      x={n.x - NODE.w / 2}
                      y={n.y - NODE.h / 2}
                      width={NODE.w}
                      height={NODE.h}
                      rx={12}
                      fill="var(--color-background)"
                      stroke="var(--color-border)"
                      strokeWidth={1.5}
                    />
                    <text
                      x={n.x - NODE.w / 2 + 14}
                      y={n.y - 8}
                      className="fill-primary font-mono"
                      style={{ fontSize: 11, letterSpacing: "0.12em" }}
                    >
                      {n.n}
                    </text>
                    <text
                      x={n.x - NODE.w / 2 + 40}
                      y={n.y - 8}
                      className="fill-foreground font-mono"
                      style={{ fontSize: 14, letterSpacing: "0.06em", fontWeight: 600 }}
                    >
                      {n.label}
                    </text>
                    <text
                      x={n.x - NODE.w / 2 + 14}
                      y={n.y + 15}
                      className="fill-muted-foreground"
                      style={{ fontSize: 12 }}
                    >
                      {n.sub}
                    </text>
                  </g>
                ))}

                {/* the human — outside the loop, tethered, holding a veto */}
                <path
                  d={`M ${human.x} ${human.y + 26} C ${human.x} ${human.y + 90}, ${gate.x + 40} ${gate.y - 40}, ${gate.x} ${gate.y}`}
                  fill="none"
                  stroke="var(--color-muted-foreground)"
                  strokeWidth={1.5}
                  strokeDasharray="2 6"
                  strokeLinecap="round"
                  opacity={0.7}
                  markerEnd="url(#loop-arrow)"
                />
                <circle cx={gate.x} cy={gate.y} r={4} fill="var(--color-muted-foreground)" />

                <g transform={`translate(${human.x} ${human.y})`}>
                  <rect
                    x={-96}
                    y={-26}
                    width={192}
                    height={52}
                    rx={12}
                    fill="var(--color-muted)"
                    stroke="var(--color-border)"
                    strokeWidth={1.5}
                  />
                  {/* stop-octagon glyph */}
                  <g transform="translate(-74 0)" stroke="var(--color-foreground)" strokeWidth={1.5} fill="none">
                    <path d="M-5 -12 H5 L12 -5 V5 L5 12 H-5 L-12 5 V-5 Z" />
                    <path d="M-6 0 H6" />
                  </g>
                  <text
                    x={4}
                    y={-2}
                    textAnchor="middle"
                    className="fill-foreground font-mono"
                    style={{ fontSize: 13, letterSpacing: "0.04em", fontWeight: 600 }}
                  >
                    HUMAN
                  </text>
                  <text
                    x={4}
                    y={15}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    style={{ fontSize: 11.5 }}
                  >
                    veto, not a wrench
                  </text>
                </g>
              </svg>
            </div>
            <figcaption className="border-t border-border px-5 py-4 font-mono text-xs leading-relaxed text-muted-foreground sm:px-8">
              <span className="text-primary">/</span> v5 is a line that dead-ends at the last
              instruction. v6 is this ring — a closed loop that keeps itself running. the human is
              the dashed line: attached, able to stop it, no longer in it.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
