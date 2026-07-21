/* ro's engine diagram, as data. every node, edge and sample flow from the
   hand-made source lives here so <EngineMesh> stays pure animation + layout.
   coordinates are in a fixed 1200 × 980 viewBox that mirrors the drawing:
   memory across the top, the concierge spine down the middle, the
   self-improving loop at the bottom, and the tall CONTEXT column on the left. */

export type Pt = { x: number; y: number };
export type Side = "top" | "bottom" | "left" | "right";
export type FlowKind = "memory" | "exec";

export type EngineNode = {
  id: string;
  label: string;
  /* one-line role drawn under the label inside the node */
  sub: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /* which flow the node belongs to — drives its accent (pink vs neutral),
     matching the coloured titles in the source drawing. */
  flow: FlowKind;
  /* the fuller role, shown in the detail panel on hover/click */
  role: string;
  tools?: string[];
};

export const NODES: EngineNode[] = [
  {
    id: "routines",
    label: "Routines",
    sub: "scheduled kick-offs",
    x: 44, y: 40, w: 188, h: 92,
    flow: "memory",
    role: "Scheduled reminders that kick off routine tasks so the system is proactive — it starts work on its own clock instead of waiting to be asked.",
  },
  {
    id: "memory",
    label: "Memory Agent",
    sub: "long-term memory + context",
    x: 372, y: 32, w: 392, h: 136,
    flow: "memory",
    role: "Stores long-term memory and context. Passes relevant context to the Chat Agent so it never says “I don’t know what you’re talking about.”",
  },
  {
    id: "chat",
    label: "Chat Agent",
    sub: "user-facing entry point",
    x: 352, y: 232, w: 252, h: 124,
    flow: "memory",
    role: "The user-facing entry point. For complex flows it generates a plan first, then hands off to the Concierge to carry it out.",
  },
  {
    id: "other",
    label: "Other Agents",
    sub: "specific / complex flows",
    x: 664, y: 232, w: 248, h: 124,
    flow: "memory",
    role: "Other agents handle specific or complex flows and return control to the Concierge when they’re done.",
  },
  {
    id: "context",
    label: "Context",
    sub: "live · includes memory",
    x: 40, y: 250, w: 156, h: 706,
    flow: "memory",
    role: "All relevant context is captured here in real-time and used across the whole system. It includes memory and feeds the self-improving loop — the Live Context nothing starts from zero without.",
  },
  {
    id: "user",
    label: "User",
    sub: "you",
    x: 236, y: 402, w: 110, h: 60,
    flow: "exec",
    role: "You. You talk to the Concierge, and the Memory and Chat agents keep the user-facing side grounded in context. You hold a veto, not a wrench.",
  },
  {
    id: "concierge",
    label: "Concierge Agent",
    sub: "orchestrates + delegates",
    x: 372, y: 392, w: 252, h: 110,
    flow: "exec",
    role: "The orchestrator. It delegates work across the system, deciding who does what and stitching the results back together.",
    tools: ["Browser", "Quick Scripting"],
  },
  {
    id: "bored",
    label: "Bored",
    sub: "watches for openings",
    x: 684, y: 392, w: 228, h: 110,
    flow: "exec",
    role: "Monitors for opportunities and idle capacity — the part that notices there’s slack and something worth doing, and nudges the system to act.",
  },
  {
    id: "quick",
    label: "Quick Agent",
    sub: "fast, tool-driven results",
    x: 372, y: 548, w: 252, h: 104,
    flow: "exec",
    role: "Executes tasks using tools for fast results — the low-latency path when an answer or action is needed now.",
    tools: ["Browser", "Quick Scripting"],
  },
  {
    id: "workers",
    label: "Workers",
    sub: "async execution at scale",
    x: 684, y: 548, w: 228, h: 104,
    flow: "exec",
    role: "Execute tasks asynchronously at scale — the standing team that grinds through the heavier work in parallel.",
  },
  {
    id: "review",
    label: "Review Agent",
    sub: "reviews + escalates",
    x: 968, y: 520, w: 200, h: 140,
    flow: "exec",
    role: "Reviews outputs and escalates to a human or a supervision agent as needed. The quality gate before anything ships.",
  },
  {
    id: "efficiency",
    label: "Efficiency Agent",
    sub: "optimizes processes",
    x: 372, y: 704, w: 246, h: 104,
    flow: "exec",
    role: "Identifies improvements and optimizes processes — one half of the loop that keeps the system getting cheaper and faster over time.",
  },
  {
    id: "learning",
    label: "Learning Agent",
    sub: "adapts from outcomes",
    x: 712, y: 704, w: 246, h: 104,
    flow: "exec",
    role: "Learns from outcomes and adapts behavior — the other half of the loop, turning what happened into how the system acts next time.",
  },
  {
    id: "improvement",
    label: "Improvement Agent",
    sub: "long-term system improvement",
    x: 372, y: 856, w: 586, h: 100,
    flow: "exec",
    role: "Long-term system improvement and optimization with context. Where the gains from the Efficiency↔Learning loop compound.",
  },
];

const NODE_MAP: Record<string, EngineNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
);

/* ── geometry helpers ──────────────────────────────────────────────────────
   anchors sit on a node's border; edges route between anchors as orthogonal
   elbows (or gentle curves for the efficiency↔learning loop). we resolve the
   polyline once here so both the stroked path and the travelling particles
   share the exact same geometry. */

function anc(id: string, side: Side, t: number): Pt {
  const n = NODE_MAP[id];
  switch (side) {
    case "top": return { x: n.x + n.w * t, y: n.y };
    case "bottom": return { x: n.x + n.w * t, y: n.y + n.h };
    case "left": return { x: n.x, y: n.y + n.h * t };
    case "right": return { x: n.x + n.w, y: n.y + n.h * t };
  }
}

/* straight */
const L = (a: Pt, b: Pt): Pt[] => [a, b];
/* horizontal first, then vertical — last segment enters a top/bottom side */
const HV = (a: Pt, b: Pt): Pt[] => [a, { x: b.x, y: a.y }, b];
/* vertical first, then horizontal — last segment enters a left/right side */
const VH = (a: Pt, b: Pt): Pt[] => [a, { x: a.x, y: b.y }, b];

/* sample a quadratic bezier into a polyline so curved edges animate like the
   straight ones. */
function quad(a: Pt, c: Pt, b: Pt, steps = 20): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    out.push({
      x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    });
  }
  return out;
}

/* turn a polyline into an SVG path with softly rounded corners. particles use
   the raw points; the tiny corner-cut mismatch is imperceptible. */
export function toPath(pts: Pt[], r = 12): string {
  if (pts.length <= 2) {
    return `M ${pts[0].x} ${pts[0].y} L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  }
  const dist = (p: Pt, q: Pt) => Math.hypot(q.x - p.x, q.y - p.y);
  const lerp = (p: Pt, q: Pt, d: number): Pt => {
    const len = dist(p, q) || 1;
    return { x: p.x + ((q.x - p.x) / len) * d, y: p.y + ((q.y - p.y) / len) * d };
  };
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1], cur = pts[i], next = pts[i + 1];
    const rr = Math.min(r, dist(prev, cur) / 2, dist(cur, next) / 2);
    const a = lerp(cur, prev, rr);
    const b = lerp(cur, next, rr);
    d += ` L ${a.x} ${a.y} Q ${cur.x} ${cur.y} ${b.x} ${b.y}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

export type Edge = {
  id: string;
  kind: FlowKind;
  from: string;
  to: string;
  pts: Pt[];
  d: string;
  /* bidirectional edges carry traffic (and arrowheads) both ways */
  bi: boolean;
};

/* raw edge definitions → resolved geometry. `curved` edges skip corner
   rounding since they are already smooth samples. */
type Raw = {
  id: string;
  kind: FlowKind;
  from: string;
  to: string;
  pts: Pt[];
  bi?: boolean;
  curved?: boolean;
};

const RAW: Raw[] = [
  // ── memory + context flow (pink) ────────────────────────────────────────
  { id: "M1", kind: "memory", from: "routines", to: "memory", pts: VH(anc("routines", "right", 0.5), anc("memory", "left", 0.5)) },
  { id: "M2", kind: "memory", from: "routines", to: "chat", pts: VH(anc("routines", "bottom", 0.5), anc("chat", "left", 0.32)) },
  { id: "M3", kind: "memory", from: "memory", to: "chat", pts: HV(anc("memory", "bottom", 0.2), anc("chat", "top", 0.5)) },
  { id: "M4", kind: "memory", from: "memory", to: "other", pts: HV(anc("memory", "bottom", 0.82), anc("other", "top", 0.5)) },
  { id: "M5", kind: "memory", from: "chat", to: "other", pts: L(anc("chat", "right", 0.42), anc("other", "left", 0.42)), bi: true },
  { id: "M7", kind: "memory", from: "context", to: "concierge", pts: VH(anc("context", "right", 0.42), anc("concierge", "left", 0.72)) },

  // ── execution / task flow (bright neutral) ──────────────────────────────
  { id: "E1", kind: "exec", from: "user", to: "concierge", pts: L(anc("user", "right", 0.5), anc("concierge", "left", 0.32)), bi: true },
  { id: "E13", kind: "exec", from: "user", to: "chat", pts: HV(anc("user", "top", 0.5), anc("chat", "bottom", 0.15)) },
  { id: "E2", kind: "exec", from: "chat", to: "concierge", pts: HV(anc("chat", "bottom", 0.55), anc("concierge", "top", 0.45)), bi: true },
  { id: "E3", kind: "exec", from: "concierge", to: "bored", pts: L(anc("concierge", "right", 0.5), anc("bored", "left", 0.5)), bi: true },
  { id: "E4", kind: "exec", from: "concierge", to: "quick", pts: L(anc("concierge", "bottom", 0.4), anc("quick", "top", 0.4)), bi: true },
  { id: "E5", kind: "exec", from: "bored", to: "workers", pts: L(anc("bored", "bottom", 0.5), anc("workers", "top", 0.5)) },
  { id: "E6", kind: "exec", from: "workers", to: "review", pts: VH(anc("workers", "right", 0.4), anc("review", "left", 0.35)), bi: true },
  { id: "E7", kind: "exec", from: "quick", to: "efficiency", pts: HV(anc("quick", "bottom", 0.4), anc("efficiency", "top", 0.5)) },
  { id: "E8", kind: "exec", from: "workers", to: "learning", pts: HV(anc("workers", "bottom", 0.5), anc("learning", "top", 0.5)) },
  { id: "E9", kind: "exec", from: "context", to: "efficiency", pts: VH(anc("context", "right", 0.72), anc("efficiency", "left", 0.5)) },
  {
    id: "E10a", kind: "exec", from: "efficiency", to: "learning", curved: true,
    pts: quad(anc("efficiency", "right", 0.35), { x: 665, y: 694 }, anc("learning", "left", 0.35)),
  },
  {
    id: "E10b", kind: "exec", from: "learning", to: "efficiency", curved: true,
    pts: quad(anc("learning", "left", 0.68), { x: 665, y: 820 }, anc("efficiency", "right", 0.68)),
  },
  { id: "E11", kind: "exec", from: "learning", to: "improvement", pts: HV(anc("learning", "bottom", 0.28), anc("improvement", "top", 0.62)) },
  { id: "E12", kind: "exec", from: "context", to: "improvement", pts: VH(anc("context", "right", 0.95), anc("improvement", "left", 0.5)) },
];

export const EDGES: Edge[] = RAW.map((r) => ({
  id: r.id,
  kind: r.kind,
  from: r.from,
  to: r.to,
  pts: r.pts,
  bi: r.bi ?? false,
  d: r.curved ? toPath(r.pts, 0) : toPath(r.pts, 12),
}));

export const EDGE_MAP: Record<string, Edge> = Object.fromEntries(
  EDGES.map((e) => [e.id, e]),
);

/* ── sample flows ──────────────────────────────────────────────────────────
   each flow traces a real end-to-end path. `spine` is the ordered set of
   edges the comet walks (lighting each node as it arrives). `extra` edges
   light up alongside without being walked (e.g. context feeding in). */
export type Flow = {
  id: string;
  title: string;
  desc: string;
  spine: string[];
  extra: string[];
  nodes: string[];
};

export const FLOWS: Flow[] = [
  {
    id: "ask",
    title: "A question comes in",
    desc: "The Chat Agent takes the question and the Memory Agent feeds context in pink. A plan drops to the Concierge, which hands it to the Quick Agent for a fast answer.",
    spine: ["E13", "E2", "E4"],
    extra: ["M3"],
    nodes: ["user", "chat", "memory", "concierge", "quick"],
  },
  {
    id: "proactive",
    title: "A routine fires on its own",
    desc: "Nobody asked. A scheduled routine wakes the system, memory grounds it, the Concierge spins up Bored and the Workers, and the Review Agent checks the result before it ships.",
    spine: ["M2", "E2", "E3", "E5", "E6"],
    extra: ["M1"],
    nodes: ["routines", "memory", "chat", "concierge", "bored", "workers", "review"],
  },
  {
    id: "improve",
    title: "It improves itself",
    desc: "Live Context flows into the Efficiency↔Learning loop — one finds optimizations, the other adapts from outcomes — and both feed the Improvement Agent for long-term gains.",
    spine: ["E9", "E10a", "E10b", "E11"],
    extra: ["E12"],
    nodes: ["context", "efficiency", "learning", "improvement"],
  },
  {
    id: "memory",
    title: "Memory keeps its place",
    desc: "Context is captured live and pushed everywhere it’s needed — into the Chat Agent, the Other Agents and the Concierge — so nothing in the system ever starts from zero.",
    spine: ["M1", "M3", "M4"],
    extra: ["M5", "M7"],
    nodes: ["routines", "memory", "chat", "other", "context", "concierge"],
  },
];
