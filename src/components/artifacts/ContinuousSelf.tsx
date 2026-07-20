import { useId, useState } from "react";
import { ArtifactFrame, Legend } from "@/components/artifacts/ArtifactFrame";
import { useIsCompact } from "@/lib/hooks";

/* shift 01 — one continuous self.
   the same twelve decisions, laid on one timeline, read two ways. v5 keeps only
   what fits in a window that slides with the cursor; v6 keeps everything from the
   origin up to it. scrub the cursor and watch the window drop history the moment
   it ages out — while the continuous self just reaches further back. */

type Room = "infra" | "design" | "tickets";

type Decision = { t: number; room: Room; what: string };

const ROOMS: Room[] = ["infra", "design", "tickets"];

/* t is position along the six-week timeline, 0 (oldest) → 100 (now). */
const DECISIONS: Decision[] = [
  { t: 4, room: "infra", what: "capped retries at 3" },
  { t: 8, room: "design", what: "picked the ochre accent" },
  { t: 18, room: "tickets", what: "shipped #44" },
  { t: 24, room: "infra", what: "moved the queue to redis" },
  { t: 34, room: "design", what: "made dark the default" },
  { t: 40, room: "tickets", what: "deferred #48" },
  { t: 50, room: "infra", what: "added the health probe" },
  { t: 58, room: "tickets", what: "closed #50" },
  { t: 68, room: "design", what: "tightened the type scale" },
  { t: 74, room: "infra", what: "rotated the deploy token" },
  { t: 88, room: "tickets", what: "opened #53" },
  { t: 94, room: "design", what: "drafted the artifacts" },
];

/* the window v5 can hold at once, in timeline units. */
const WINDOW = 26;
/* the decision the readout keeps asking after — set early, six weeks back. */
const TARGET = DECISIONS[0];

const laneTop = (room: Room) => `${18 + ROOMS.indexOf(room) * 32}%`;

function Timeline({
  now,
  mode,
}: {
  now: number;
  mode: "v5" | "v6";
}) {
  const spanLeft = mode === "v5" ? Math.max(0, now - WINDOW) : 0;
  const held = (t: number) => t <= now && t >= spanLeft;
  return (
    <div className="relative h-24 w-full overflow-hidden rounded-[calc(var(--radius-house)-0.25rem)] border border-border bg-muted/40">
      {/* the span each version can reach back to */}
      <div
        className="absolute inset-y-0 bg-primary/10 transition-[left,width] duration-300 ease-out"
        style={{ left: `${spanLeft}%`, width: `${Math.max(0, now - spanLeft)}%` }}
      />
      {/* room hairlines */}
      {ROOMS.map((room) => (
        <div
          key={room}
          aria-hidden
          className="absolute right-0 left-0 border-t border-dashed border-border/60"
          style={{ top: laneTop(room) }}
        />
      ))}
      {/* the cursor — "now" */}
      <div
        className="absolute inset-y-0 w-px bg-foreground/70 transition-[left] duration-300 ease-out"
        style={{ left: `${now}%` }}
      />
      {/* the decisions */}
      {DECISIONS.map((d) => {
        const on = held(d.t);
        return (
          <div
            key={d.what}
            className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-300 ease-out"
            style={{
              left: `${d.t}%`,
              top: laneTop(d.room),
              backgroundColor: on ? "var(--primary)" : "transparent",
              borderColor: on ? "var(--primary)" : "var(--muted-foreground)",
              opacity: on ? 1 : 0.35,
            }}
            title={`#${d.room} — ${d.what}`}
          />
        );
      })}
    </div>
  );
}

export function ContinuousSelf() {
  const compact = useIsCompact();
  const sliderId = useId();
  const [now, setNow] = useState(82);

  const heldV6 = DECISIONS.filter((d) => d.t <= now).length;
  const heldV5 = DECISIONS.filter((d) => d.t <= now && d.t >= now - WINDOW).length;
  const targetSeen = TARGET.t <= now;
  const targetInWindow = targetSeen && TARGET.t >= now - WINDOW;

  return (
    <ArtifactFrame label="one continuous self" hint={compact ? "a fixed moment" : "drag to scrub time →"}>
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between font-mono text-xs">
              <span className="tracking-widest text-muted-foreground uppercase">v5 · rotating window</span>
              <span className="tabular-nums text-muted-foreground">holds {heldV5}/12</span>
            </div>
            <Timeline now={now} mode="v5" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between font-mono text-xs">
              <span className="tracking-widest text-primary uppercase">v6 · continuous self</span>
              <span className="tabular-nums text-foreground">holds {heldV6}/12</span>
            </div>
            <Timeline now={now} mode="v6" />
          </div>
        </div>

        {!compact && (
          <div>
            <label htmlFor={sliderId} className="sr-only">
              scrub the timeline cursor
            </label>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={100}
              value={now}
              onChange={(e) => setNow(Number(e.target.value))}
              className="v6-range w-full"
              aria-valuetext={`cursor at ${now} percent; v5 holds ${heldV5}, v6 holds ${heldV6}`}
            />
            <div className="mt-1 flex justify-between font-mono text-[0.7rem] tracking-wide text-muted-foreground">
              <span>six weeks ago</span>
              <span>now</span>
            </div>
          </div>
        )}

        <div className="rounded-[calc(var(--radius-house)-0.25rem)] border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed">
          <p className="text-muted-foreground">
            <span className="text-foreground">recall</span> — “the retry cap we set six weeks ago?”
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p className="text-muted-foreground">
              v5 ·{" "}
              <span className={targetInWindow ? "text-foreground" : "text-muted-foreground"}>
                {!targetSeen ? "not seen yet" : targetInWindow ? "in the window" : "dropped from the window"}
              </span>
            </p>
            <p className="text-muted-foreground">
              v6 ·{" "}
              <span className={targetSeen ? "text-primary" : "text-muted-foreground"}>
                {targetSeen ? "held — #infra, six weeks back" : "not seen yet"}
              </span>
            </p>
          </div>
        </div>

        <Legend v5="only what still fits the window" v6="every room, all the way back" />
      </div>
    </ArtifactFrame>
  );
}
