import { useEffect, useMemo, useRef, useState } from "react";
import { NODES, EDGES, EDGE_MAP, FLOWS, type Pt } from "@/content/engine";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

/* ── the engine, alive ──────────────────────────────────────────────────────
   ro's architecture diagram, rebuilt as a living agent-mesh. the topology is
   drawn in SVG (crisp, themeable, part of the page — never a PNG). two kinds
   of traffic run through it forever: pink particles on the memory + context
   edges, bright-neutral particles on the execution / task edges. an ochre comet
   traces one sample flow at a time, lighting the nodes it touches, and auto-
   cycles through four end-to-end paths. hover or click any agent for its role.

   the animation is imperative: react renders the static structure once, then a
   single rAF loop mutates circle positions directly (no per-frame re-render),
   which is what keeps it at 60fps. prefers-reduced-motion drops the loop for a
   fully static, still-interactive diagram. */

const VB = { w: 1200, h: 980 };
const COMET_LEN = 7;
const COMET_GAP = 26; // viewBox units between comet segments
const PX_PER_SEC = 58; // ambient particle pixel speed
const PAUSE = 1.1; // seconds a flow lingers after the comet lands

type EdgeGeo = { id: string; kind: "memory" | "exec"; pts: Pt[]; cum: number[]; total: number };

function buildGeo(pts: Pt[]): { cum: number[]; total: number } {
  const cum = [0];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    cum.push(total);
  }
  return { cum, total };
}

/* point at an absolute arc-length along a polyline */
function ptAt(geo: EdgeGeo, len: number): Pt {
  const { pts, cum, total } = geo;
  if (total === 0) return pts[0];
  const d = len <= 0 ? 0 : len >= total ? total : len;
  let i = 0;
  while (i < cum.length - 2 && cum[i + 1] < d) i++;
  const seg = cum[i + 1] - cum[i] || 1;
  const f = (d - cum[i]) / seg;
  return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f };
}

export function EngineMesh() {
  const reduced = usePrefersReducedMotion();
  const [activeFlow, setActiveFlow] = useState(0);
  const [focused, setFocused] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [lit, setLit] = useState<Set<string>>(() => new Set(FLOWS[0].nodes));

  /* resolve every edge to a sampled polyline with cumulative lengths, once. */
  const edgeGeo = useMemo<EdgeGeo[]>(
    () => EDGES.map((e) => ({ id: e.id, kind: e.kind, pts: e.pts, ...buildGeo(e.pts) })),
    [],
  );
  const geoById = useMemo(() => Object.fromEntries(edgeGeo.map((g) => [g.id, g])), [edgeGeo]);

  /* per-flow: the concatenated comet path + where each node lights up. */
  const flowGeo = useMemo(
    () =>
      FLOWS.map((f) => {
        const edges = f.spine.map((id) => geoById[id]);
        const starts: number[] = [];
        let total = 0;
        edges.forEach((e) => {
          starts.push(total);
          total += e.total;
        });
        const firstNode = EDGE_MAP[f.spine[0]].from;
        const nodeStops = f.spine.map((id, k) => ({ node: EDGE_MAP[id].to, d: starts[k] + edges[k].total }));
        const stopIds = new Set([firstNode, ...nodeStops.map((s) => s.node)]);
        const baseNodes = f.nodes.filter((n) => !stopIds.has(n));
        return { edges, starts, total, firstNode, nodeStops, baseNodes };
      }),
    [geoById],
  );

  const flowEdgeSet = useMemo(
    () => new Set([...FLOWS[activeFlow].spine, ...FLOWS[activeFlow].extra]),
    [activeFlow],
  );

  /* one gentle ambient particle stream per edge (both ways on bi edges),
     travelling at a constant pixel speed so long edges aren't faster. */
  const ambient = useMemo(() => {
    const arr: { ei: number; kind: "memory" | "exec"; phase: number; speed: number; dir: 1 | -1 }[] = [];
    edgeGeo.forEach((g, ei) => {
      const count = Math.max(1, Math.min(3, Math.round(g.total / 240)));
      const speed = g.total > 0 ? PX_PER_SEC / g.total : 0;
      for (let i = 0; i < count; i++) {
        const phase = (i + (ei % 5) * 0.2) / count;
        arr.push({ ei, kind: g.kind, phase: phase % 1, speed, dir: 1 });
        if (EDGES[ei].bi) arr.push({ ei, kind: g.kind, phase: (phase + 0.5) % 1, speed, dir: -1 });
      }
    });
    return arr;
  }, [edgeGeo]);

  const ambientRef = useRef<(SVGCircleElement | null)[]>([]);
  const cometRef = useRef<(SVGCircleElement | null)[]>([]);
  const cometGlowRef = useRef<SVGCircleElement | null>(null);
  const activeFlowRef = useRef(activeFlow);
  const flowElapsedRef = useRef(0);
  const litSigRef = useRef(-1);

  /* selecting a flow (click or auto-advance) resets its clock + base lighting. */
  useEffect(() => {
    activeFlowRef.current = activeFlow;
    flowElapsedRef.current = 0;
    litSigRef.current = -1;
    if (reduced) {
      setLit(new Set(FLOWS[activeFlow].nodes));
    } else {
      setLit(new Set(flowGeo[activeFlow].baseNodes.concat(flowGeo[activeFlow].firstNode)));
    }
  }, [activeFlow, reduced, flowGeo]);

  /* the loop. skipped entirely under reduced motion. */
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = 0;
    let t = 0;

    const frame = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      t += dt;

      // ambient traffic
      for (let i = 0; i < ambient.length; i++) {
        const el = ambientRef.current[i];
        if (!el) continue;
        const p = ambient[i];
        const g = edgeGeo[p.ei];
        let u = (p.phase + t * p.speed) % 1;
        if (p.dir < 0) u = 1 - u;
        const pos = ptAt(g, u * g.total);
        el.setAttribute("cx", pos.x.toFixed(1));
        el.setAttribute("cy", pos.y.toFixed(1));
      }

      // the flow comet
      const af = activeFlowRef.current;
      const fg = flowGeo[af];
      const dur = Math.min(Math.max(fg.total / 175, 4.5), 8);
      flowElapsedRef.current += dt;
      const e = flowElapsedRef.current;
      const prog = Math.min(e / dur, 1);
      const head = prog * fg.total;
      const fade = e > dur ? Math.max(0, 1 - (e - dur) / PAUSE) : 1;

      for (let i = 0; i < COMET_LEN; i++) {
        const el = cometRef.current[i];
        if (!el) continue;
        const pos = ptAt2(fg, head - i * COMET_GAP);
        const op = fade * (1 - i / COMET_LEN) * 0.95;
        el.setAttribute("cx", pos.x.toFixed(1));
        el.setAttribute("cy", pos.y.toFixed(1));
        el.setAttribute("opacity", op.toFixed(2));
      }
      if (cometGlowRef.current) {
        const pos = ptAt2(fg, head);
        cometGlowRef.current.setAttribute("cx", pos.x.toFixed(1));
        cometGlowRef.current.setAttribute("cy", pos.y.toFixed(1));
        cometGlowRef.current.setAttribute("opacity", (fade * 0.35).toFixed(2));
      }

      // light nodes as the comet passes them
      let stops = 0;
      for (const s of fg.nodeStops) if (head >= s.d - 2) stops++;
      const sig = af * 100 + stops;
      if (sig !== litSigRef.current) {
        litSigRef.current = sig;
        const set = new Set(fg.baseNodes);
        set.add(fg.firstNode);
        for (let k = 0; k < stops; k++) set.add(fg.nodeStops[k].node);
        setLit(set);
      }

      // advance to the next flow once this one has landed + lingered
      if (e > dur + PAUSE) {
        const next = (af + 1) % FLOWS.length;
        activeFlowRef.current = next;
        flowElapsedRef.current = 0;
        litSigRef.current = -1;
        setActiveFlow(next);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduced, ambient, edgeGeo, flowGeo]);

  /* point along a flow's concatenated spine */
  function ptAt2(fg: (typeof flowGeo)[number], len: number): Pt {
    let d = len <= 0 ? 0 : len >= fg.total ? fg.total : len;
    for (let k = 0; k < fg.edges.length; k++) {
      const e = fg.edges[k];
      if (d <= e.total || k === fg.edges.length - 1) return ptAt(e, d);
      d -= e.total;
    }
    return ptAt(fg.edges[0], 0);
  }

  const focusNode = NODES.find((n) => n.id === focused) ?? null;
  const flow = FLOWS[activeFlow];

  function selectNode(id: string) {
    if (pinned && focused === id) {
      setPinned(false);
      setFocused(null);
    } else {
      setPinned(true);
      setFocused(id);
    }
  }

  return (
    <section id="engine" aria-labelledby="engine-title" className="border-t border-border bg-muted/40 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <Reveal>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">the engine</p>
          <h2
            id="engine-title"
            className="mt-10 max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            not a diagram of the system. the system, running.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            every agent v6 runs, wired the way it actually works. two kinds of traffic move through it
            without pause —{" "}
            <span className="font-medium text-[color:var(--color-flow-memory)]">memory + context</span> in
            pink, <span className="font-medium text-foreground">execution + task</span> in white. watch a
            path light up, or hover any agent to see its job.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <figure className="overflow-hidden rounded-[var(--radius-house)] border border-border bg-card">
            {/* flow selector */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-4 sm:px-6">
              <span className="mr-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                {reduced ? "paths" : "watch a flow"}
              </span>
              {FLOWS.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFlow(i)}
                  aria-pressed={i === activeFlow}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 font-mono text-[11px] tracking-wide transition-colors duration-150",
                    i === activeFlow
                      ? "border-primary/60 bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      i === activeFlow ? "bg-primary" : "bg-muted-foreground/50",
                    )}
                  />
                  {f.title}
                </button>
              ))}
            </div>

            {/* the mesh — pans horizontally on small screens */}
            <div className="relative overflow-x-auto">
              <div className="relative w-full min-w-[880px]" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
                <div aria-hidden className="grid-field pointer-events-none absolute inset-0 opacity-60" />
                <svg
                  viewBox={`0 0 ${VB.w} ${VB.h}`}
                  className="absolute inset-0 block h-full w-full"
                  role="img"
                  aria-label="The v6 engine: an agent mesh with a Memory Agent, Chat Agent, Concierge, Quick Agent, Workers, Review Agent, an Efficiency and Learning loop and an Improvement Agent, plus Routines, Bored and a live Context column. Memory and context flow along pink edges; execution and task work flows along white edges."
                >
                  <defs>
                    <marker id="ah-memory" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0 1 L9 5 L0 9 z" fill="var(--color-flow-memory)" opacity="0.75" />
                    </marker>
                    <marker id="ah-exec" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0 1 L9 5 L0 9 z" fill="var(--color-flow-exec)" opacity="0.6" />
                    </marker>
                  </defs>

                  {/* base edges — always faintly present */}
                  {EDGES.map((e) => {
                    const c = e.kind === "memory" ? "var(--color-flow-memory)" : "var(--color-flow-exec)";
                    return (
                      <path
                        key={`b-${e.id}`}
                        d={e.d}
                        fill="none"
                        stroke={c}
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        opacity={0.26}
                        markerEnd={`url(#ah-${e.kind})`}
                        markerStart={e.bi ? `url(#ah-${e.kind})` : undefined}
                      />
                    );
                  })}

                  {/* highlight edges — bright when part of the active flow */}
                  {EDGES.map((e) => {
                    const c = e.kind === "memory" ? "var(--color-flow-memory)" : "var(--color-flow-exec)";
                    const on = flowEdgeSet.has(e.id);
                    return (
                      <path
                        key={`h-${e.id}`}
                        d={e.d}
                        fill="none"
                        stroke={c}
                        strokeWidth={2.6}
                        strokeLinecap="round"
                        style={{
                          opacity: on ? 0.95 : 0,
                          filter: on ? `drop-shadow(0 0 5px ${c})` : "none",
                          transition: "opacity .35s ease",
                        }}
                      />
                    );
                  })}

                  {/* ambient traffic — pink on memory edges, white on execution edges */}
                  {reduced
                    ? EDGES.map((e, ei) => {
                        const g = edgeGeo[ei];
                        const pos = ptAt(g, g.total * 0.5);
                        return (
                          <circle
                            key={`s-${e.id}`}
                            cx={pos.x}
                            cy={pos.y}
                            r={e.kind === "memory" ? 3 : 2.7}
                            fill={e.kind === "memory" ? "var(--color-flow-memory)" : "var(--color-flow-exec)"}
                            opacity={0.9}
                          />
                        );
                      })
                    : ambient.map((p, i) => (
                        <circle
                          key={`a-${i}`}
                          ref={(el) => {
                            ambientRef.current[i] = el;
                          }}
                          r={p.kind === "memory" ? 3 : 2.7}
                          fill={p.kind === "memory" ? "var(--color-flow-memory)" : "var(--color-flow-exec)"}
                          opacity={0.9}
                        />
                      ))}

                  {/* the flow comet — ochre brand accent, only when in motion */}
                  {!reduced && (
                    <>
                      <circle ref={cometGlowRef} r={14} fill="var(--color-primary)" opacity={0} />
                      {Array.from({ length: COMET_LEN }).map((_, i) => (
                        <circle
                          key={`c-${i}`}
                          ref={(el) => {
                            cometRef.current[i] = el;
                          }}
                          r={6.5 - (i / COMET_LEN) * 4.2}
                          fill="var(--color-primary)"
                          opacity={0}
                        />
                      ))}
                    </>
                  )}

                  {/* nodes */}
                  {NODES.map((n) => {
                    const active = lit.has(n.id) || focused === n.id;
                    const accent = n.flow === "memory" ? "var(--color-flow-memory)" : "var(--color-primary)";
                    const isFocus = focused === n.id;
                    const vertical = n.id === "context";
                    return (
                      <g
                        key={n.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`${n.label}. ${n.role}`}
                        className="cursor-pointer"
                        style={{ outline: "none" }}
                        onPointerEnter={() => !pinned && setFocused(n.id)}
                        onPointerLeave={() => !pinned && setFocused(null)}
                        onFocus={() => !pinned && setFocused(n.id)}
                        onBlur={() => !pinned && setFocused(null)}
                        onClick={() => selectNode(n.id)}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter" || ev.key === " ") {
                            ev.preventDefault();
                            selectNode(n.id);
                          }
                        }}
                      >
                        <rect
                          x={n.x}
                          y={n.y}
                          width={n.w}
                          height={n.h}
                          rx={14}
                          fill="var(--color-card)"
                          style={{
                            stroke: active ? accent : "var(--color-border)",
                            strokeWidth: isFocus ? 2.4 : active ? 2 : 1.5,
                            filter: active ? `drop-shadow(0 0 8px ${accent})` : "none",
                            transition: "stroke .3s ease, filter .3s ease",
                          }}
                        />
                        {vertical ? (
                          <>
                            <text
                              x={n.x + 30}
                              y={n.y + n.h / 2}
                              transform={`rotate(-90 ${n.x + 30} ${n.y + n.h / 2})`}
                              textAnchor="middle"
                              className="font-mono"
                              style={{ fontSize: 17, letterSpacing: "0.32em", fontWeight: 600, fill: accent }}
                            >
                              CONTEXT
                            </text>
                            <text x={n.x + 58} y={n.y + 34} className="font-mono" style={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}>
                              includes
                            </text>
                            <text x={n.x + 58} y={n.y + 52} className="font-mono" style={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}>
                              memory
                            </text>
                            <text x={n.x + 58} y={n.y + n.h - 118} className="font-semibold" style={{ fontSize: 15, fill: accent }}>
                              Live
                            </text>
                            <text x={n.x + 58} y={n.y + n.h - 98} className="font-semibold" style={{ fontSize: 15, fill: accent }}>
                              Context
                            </text>
                            <text x={n.x + 58} y={n.y + n.h - 74} style={{ fontSize: 11.5, fill: "var(--color-muted-foreground)" }}>
                              captured
                            </text>
                            <text x={n.x + 58} y={n.y + n.h - 58} style={{ fontSize: 11.5, fill: "var(--color-muted-foreground)" }}>
                              in real-time
                            </text>
                          </>
                        ) : (
                          <>
                            <text
                              x={n.x + 18}
                              y={n.y + n.h / 2 - 3}
                              className="font-semibold"
                              style={{ fontSize: n.w > 300 ? 19 : 16.5, fill: n.flow === "memory" ? "var(--color-flow-memory)" : "var(--color-foreground)" }}
                            >
                              {n.label}
                            </text>
                            <text x={n.x + 18} y={n.y + n.h / 2 + 18} style={{ fontSize: 12.5, fill: "var(--color-muted-foreground)" }}>
                              {n.sub}
                            </text>
                            {n.tools && (
                              <text x={n.x + 18} y={n.y + n.h - 14} className="font-mono" style={{ fontSize: 10.5, letterSpacing: "0.04em", fill: "var(--color-flow-memory)" }}>
                                tools · {n.tools.join(" · ")}
                              </text>
                            )}
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* legend + reduced-motion note */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border px-4 py-3 font-mono text-[11px] text-muted-foreground sm:px-6">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-6 rounded-full" style={{ background: "var(--color-flow-memory)" }} />
                memory + context flow
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-6 rounded-full" style={{ background: "var(--color-flow-exec)" }} />
                execution / task flow
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: "var(--color-primary)" }} />
                {reduced ? "highlighted path" : "active flow trace"}
              </span>
              {reduced && <span className="text-muted-foreground/80">motion reduced — showing a static path</span>}
            </div>
          </figure>
        </Reveal>

        {/* narration: the active flow, and the focused agent's role */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Reveal className="rounded-[var(--radius-house)] border border-border bg-card p-6">
            <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
              flow {String(activeFlow + 1).padStart(2, "0")} · {reduced ? "selected" : "now tracing"}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">{flow.title}</h3>
            <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{flow.desc}</p>
          </Reveal>

          <Reveal
            delay={80}
            className={cn(
              "rounded-[var(--radius-house)] border bg-card p-6 transition-colors duration-200",
              focusNode ? "border-primary/50" : "border-border",
            )}
            aria-live="polite"
          >
            {focusNode ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <p
                    className="font-mono text-[11px] tracking-widest uppercase"
                    style={{ color: focusNode.flow === "memory" ? "var(--color-flow-memory)" : "var(--color-primary)" }}
                  >
                    {focusNode.flow === "memory" ? "memory + context" : "execution / task"}
                  </p>
                  {pinned && (
                    <button
                      type="button"
                      onClick={() => {
                        setPinned(false);
                        setFocused(null);
                      }}
                      className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
                    >
                      clear ✕
                    </button>
                  )}
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{focusNode.label}</h3>
                <p className="mt-3 leading-relaxed text-pretty text-foreground">{focusNode.role}</p>
                {focusNode.tools && (
                  <p className="mt-4 font-mono text-xs text-muted-foreground">
                    <span className="text-[color:var(--color-flow-memory)]">tools</span> ·{" "}
                    {focusNode.tools.join(" · ")}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">the agents</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-muted-foreground">
                  hover or tap any agent
                </h3>
                <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">
                  Fourteen agents, each with a job. The goal they add up to:{" "}
                  <span className="text-foreground">
                    a proactive, always-on participant in the team — like a normal human.
                  </span>
                </p>
              </>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
