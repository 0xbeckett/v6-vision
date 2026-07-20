import { useState } from "react";
import { ArtifactFrame, ControlButton, Legend } from "@/components/artifacts/ArtifactFrame";

/* shift 03 — a standing team, not disposable workers.
   run the same ticket against the same repo, over and over. v5 cold-starts every
   time, so its bar never moves. v6 is an apprentice: each pass keeps what it
   learned, so time-to-green falls and converges. the first pass is a tie —
   that's the point. the second pass is not the first pass again. */

const MAX = 6;
const V5_MINUTES = 42;
const V5_TOKENS = 128; // thousands

/* apprentice curve: floor 28%, each repeat closes 34% of the remaining gap. */
const ratio = (i: number) => 0.28 + 0.72 * 0.66 ** i;
const v6Minutes = (i: number) => Math.round(V5_MINUTES * ratio(i));
const v6Tokens = (i: number) => Math.round(V5_TOKENS * ratio(i));

export function StandingTeam() {
  const [runs, setRuns] = useState(1);
  const last = runs - 1;
  const faster = (V5_MINUTES / v6Minutes(last)).toFixed(1);
  const saved = Math.round((1 - v6Tokens(last) / V5_TOKENS) * 100);

  return (
    <ArtifactFrame label="a standing team" hint="re-run the same ticket →">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            same ticket · pass <span className="tabular-nums text-foreground">{runs}</span>
          </span>
          <div className="flex gap-2">
            <ControlButton onClick={() => setRuns(1)} disabled={runs === 1} aria-label="reset to the first pass">
              reset
            </ControlButton>
            <ControlButton tone="primary" onClick={() => setRuns((r) => Math.min(MAX, r + 1))} disabled={runs >= MAX}>
              run again ▸
            </ControlButton>
          </div>
        </div>

        {/* time-to-green, per pass */}
        <div>
          <div className="flex items-end justify-between gap-2 sm:gap-4" style={{ height: "9rem" }}>
            {Array.from({ length: MAX }).map((_, i) => {
              const shown = i < runs;
              const v6h = (v6Minutes(i) / V5_MINUTES) * 100;
              return (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <div className="flex h-full w-full items-end justify-center gap-1">
                    {/* v5 — cold start, always the same */}
                    <div
                      className="w-1/2 max-w-4 rounded-t-sm bg-muted-foreground/30 transition-opacity duration-300 ease-out"
                      style={{ height: "100%", opacity: shown ? 1 : 0.12 }}
                      title={`v5 · pass ${i + 1} · ${V5_MINUTES}m`}
                    />
                    {/* v6 — apprentice, compounding */}
                    <div
                      className="w-1/2 max-w-4 rounded-t-sm bg-primary transition-[height,opacity] duration-300 ease-out"
                      style={{ height: shown ? `${v6h}%` : "0%", opacity: shown ? 1 : 0 }}
                      title={`v6 · pass ${i + 1} · ${v6Minutes(i)}m`}
                    />
                  </div>
                  <span
                    className="font-mono text-[0.65rem] tabular-nums text-muted-foreground transition-opacity duration-300"
                    style={{ opacity: shown ? 1 : 0.3 }}
                  >
                    {i + 1}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-1 text-center font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase">
            time to green, by pass
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[calc(var(--radius-house)-0.25rem)] border border-border bg-border sm:grid-cols-3">
          <Stat label="this pass" value={`${v6Minutes(last)}m`} sub={`v5 still ${V5_MINUTES}m`} />
          <Stat label="speed" value={`×${faster}`} sub="faster than a cold start" accent />
          <Stat label="tokens" value={`−${saved}%`} sub={`${v6Tokens(last)}k vs ${V5_TOKENS}k`} accent />
        </div>

        <p className="font-mono text-xs leading-relaxed text-muted-foreground" role="status">
          {runs === 1
            ? "pass one is a tie — nobody has been here before."
            : `pass ${runs}: the apprentice kept what the last run learned.`}
        </p>

        <Legend v5="cold-started every pass" v6="keeps what it learned" />
      </div>
    </ArtifactFrame>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="bg-card p-4">
      <p className="font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums tracking-tight ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[0.7rem] text-muted-foreground">{sub}</p>
    </div>
  );
}
