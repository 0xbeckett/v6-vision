import { useState } from "react";
import { ArtifactFrame, ControlButton, Legend } from "@/components/artifacts/ArtifactFrame";

/* shift 02 — initiative, not response.
   one clock, two behaviours, laid out in true chronological order so the point
   is spatial: v6's "already handled" row sits physically above the row where the
   alert even fires. advance the clock and watch v6 finish before v5 is told. */

type Lane = "system" | "v6" | "v5";

type Beat = { t: number; lane: Lane; text: string; mark?: string };

const BEATS: Beat[] = [
  { t: 1, lane: "system", text: "error rate crosses the threshold", mark: "⚠" },
  { t: 1, lane: "v6", text: "notices the failing pattern" },
  { t: 2, lane: "v6", text: "proposes the work, unprompted" },
  { t: 3, lane: "v6", text: "arrives with the fix already drafted", mark: "✓" },
  { t: 4, lane: "v5", text: "alert fires — a human pings the room", mark: "🔔" },
  { t: 5, lane: "v5", text: "acknowledges, starts looking" },
  { t: 6, lane: "v5", text: "drafts the same fix" },
];

const MAX_T = 6;
const HANDLED_T = 3; // v6 is done here
const ALERT_T = 4; // v5 first hears about it here

const laneStyle: Record<Lane, { tag: string; dot: string; tagText: string }> = {
  system: { tag: "—", dot: "var(--muted-foreground)", tagText: "text-muted-foreground" },
  v6: { tag: "v6", dot: "var(--primary)", tagText: "text-primary" },
  v5: { tag: "v5", dot: "var(--muted-foreground)", tagText: "text-muted-foreground" },
};

export function Initiative() {
  const [now, setNow] = useState(0);
  const done = now >= MAX_T;
  const handled = now >= HANDLED_T && now < ALERT_T;

  return (
    <ArtifactFrame label="initiative" hint="advance the clock →">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            t = <span className="tabular-nums text-foreground">{now}</span> / {MAX_T}
          </span>
          <div className="flex gap-2">
            <ControlButton onClick={() => setNow(0)} disabled={now === 0} aria-label="reset the clock">
              reset
            </ControlButton>
            <ControlButton
              tone="primary"
              onClick={() => setNow((n) => Math.min(MAX_T, n + 1))}
              disabled={done}
            >
              advance ▸
            </ControlButton>
          </div>
        </div>

        <ol className="relative space-y-1 pl-6">
          {/* the rail, filled up to the current time */}
          <div aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-border" />
          <div
            aria-hidden
            className="absolute top-2 left-[7px] w-px bg-primary/70 transition-[height] duration-300 ease-out"
            style={{ height: `calc(${(Math.min(now, MAX_T) / MAX_T) * 100}% - 0.5rem)` }}
          />
          {BEATS.map((b, i) => {
            const active = b.t <= now;
            const style = laneStyle[b.lane];
            const isHandledRow = b.lane === "v6" && b.mark === "✓";
            return (
              <li
                key={i}
                className="relative flex items-start gap-3 rounded-[calc(var(--radius-house)-0.25rem)] px-2 py-2 transition-colors duration-300 ease-out"
                style={{ backgroundColor: isHandledRow && active ? "var(--muted)" : "transparent" }}
              >
                <span
                  aria-hidden
                  className="absolute top-3.5 -left-[1.30rem] size-2 rounded-full border transition-colors duration-300 ease-out"
                  style={{
                    backgroundColor: active ? style.dot : "transparent",
                    borderColor: active ? style.dot : "var(--border)",
                  }}
                />
                <span
                  className={`w-9 shrink-0 font-mono text-[0.7rem] tabular-nums tracking-wide transition-opacity duration-300 ${active ? style.tagText : "text-muted-foreground"}`}
                  style={{ opacity: active ? 1 : 0.4 }}
                >
                  t+{b.t}
                </span>
                <span
                  className={`font-mono text-[0.7rem] tracking-widest uppercase ${active ? style.tagText : "text-muted-foreground"}`}
                  style={{ opacity: active ? 1 : 0.4, minWidth: "1.6rem" }}
                >
                  {style.tag}
                </span>
                <span
                  className="text-sm leading-snug transition-opacity duration-300"
                  style={{
                    opacity: active ? 1 : 0.4,
                    color: active ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {b.mark && <span aria-hidden className="mr-1">{b.mark}</span>}
                  {b.text}
                </span>
              </li>
            );
          })}
        </ol>

        <div
          className="rounded-[calc(var(--radius-house)-0.25rem)] border border-border bg-muted/40 px-4 py-3 font-mono text-xs leading-relaxed transition-colors duration-300"
          role="status"
        >
          {now < HANDLED_T && (
            <span className="text-muted-foreground">the room is quiet. nothing has arrived to react to.</span>
          )}
          {handled && (
            <span className="text-foreground">
              handled at <span className="text-primary tabular-nums">t+{HANDLED_T}</span> — the alert
              hasn’t even fired yet.
            </span>
          )}
          {now >= ALERT_T && !done && (
            <span className="text-muted-foreground">
              now v5 gets the ping — and starts the work v6 finished a beat ago.
            </span>
          )}
          {done && (
            <span className="text-foreground">
              same fix, both times. v6 shipped it at{" "}
              <span className="text-primary tabular-nums">t+{HANDLED_T}</span>; v5 was still being
              notified at <span className="tabular-nums">t+{ALERT_T}</span>.
            </span>
          )}
        </div>

        <Legend v5="waits for something to arrive" v6="runs on its own clock" />
      </div>
    </ArtifactFrame>
  );
}
