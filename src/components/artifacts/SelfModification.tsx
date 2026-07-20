import { useState } from "react";
import { ArtifactFrame, ControlButton, Legend } from "@/components/artifacts/ArtifactFrame";

/* shift 05 — safe self-modification.
   push a change through the whole cycle: it proposes a diff against its own
   source, validates it, deploys itself — and when production goes bad, rolls
   itself back. rollback is a step in the machine, not a step in an incident.
   and the veto is yours: you can stop it before it ships. */

type Phase = "stable" | "proposed" | "validated" | "deployed" | "rolledback" | "vetoed";

const STEPS = ["propose", "validate", "deploy", "rollback"] as const;

/* how far through the four-step cycle each phase has gotten. */
const REACHED: Record<Phase, number> = {
  stable: 0,
  proposed: 1,
  validated: 2,
  deployed: 3,
  rolledback: 4,
  vetoed: 1,
};

const LIVE = "1.4.0";
const CAND = "1.4.1";

export function SelfModification() {
  const [phase, setPhase] = useState<Phase>("stable");

  const liveVersion = phase === "deployed" ? CAND : LIVE;
  const candidate = phase === "proposed" || phase === "validated";
  const errRate = phase === "deployed" ? "3.1%" : "0.2%";
  const errBad = phase === "deployed";

  const status: Record<Phase, string> = {
    stable: "running · healthy",
    proposed: "diff drafted against its own source",
    validated: "checks green in the sandbox — safe to ship",
    deployed: "shipped itself — and production just turned",
    rolledback: "rolled itself back · incident contained",
    vetoed: "you vetoed it — nothing shipped, it stayed put",
  };

  const primary: { label: string; next: Phase; tone?: "primary" } = {
    stable: { label: "propose ▸", next: "proposed", tone: "primary" },
    proposed: { label: "validate ▸", next: "validated", tone: "primary" },
    validated: { label: "deploy ▸", next: "deployed", tone: "primary" },
    deployed: { label: "roll back ▸", next: "rolledback", tone: "primary" },
    rolledback: { label: "reset", next: "stable" },
    vetoed: { label: "reset", next: "stable" },
  }[phase];

  const canVeto = phase === "proposed" || phase === "validated";

  return (
    <ArtifactFrame label="safe self-modification" hint="push it through — then roll it back →">
      <div className="space-y-6">
        {/* version + production metric */}
        <div className="grid gap-px overflow-hidden rounded-[calc(var(--radius-house)-0.25rem)] border border-border bg-border sm:grid-cols-2">
          <div className="bg-card p-4">
            <p className="font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase">running version</p>
            <p className="mt-1 flex items-baseline gap-2 font-mono text-2xl font-semibold tracking-tight tabular-nums">
              <span style={{ color: phase === "deployed" ? "var(--primary)" : "var(--foreground)" }}>
                v{liveVersion}
              </span>
              {candidate && (
                <span className="text-base font-normal text-muted-foreground">→ v{CAND}</span>
              )}
              {phase === "rolledback" && (
                <span className="text-base font-normal text-muted-foreground">↩ from v{CAND}</span>
              )}
            </p>
          </div>
          <div className="bg-card p-4">
            <p className="font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase">production error rate</p>
            <p
              className="mt-1 flex items-center gap-2 font-mono text-2xl font-semibold tracking-tight tabular-nums transition-colors duration-300"
              style={{ color: errBad ? "var(--ring)" : "var(--primary)" }}
            >
              {errRate}
              {errBad && <span aria-hidden className="text-base">⚠</span>}
            </p>
          </div>
        </div>

        {/* the four-step cycle */}
        <div className="grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => {
            const done = REACHED[phase] > i;
            const isRollback = i === 3;
            const activeNow = REACHED[phase] === i + 1;
            return (
              <div
                key={s}
                className="flex flex-col items-center gap-1.5 rounded-[calc(var(--radius-house)-0.25rem)] border p-2.5 text-center transition-colors duration-300 ease-out"
                style={{
                  borderColor: activeNow ? "var(--primary)" : "var(--border)",
                  backgroundColor: activeNow ? "var(--muted)" : "transparent",
                  opacity: phase === "vetoed" && i > 0 ? 0.4 : 1,
                }}
              >
                <span
                  aria-hidden
                  className="size-2 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: done ? "var(--primary)" : "var(--border)" }}
                />
                <span
                  className="font-mono text-[0.65rem] tracking-widest uppercase"
                  style={{ color: done ? (isRollback ? "var(--foreground)" : "var(--primary)") : "var(--muted-foreground)" }}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </div>

        <p
          className="rounded-[calc(var(--radius-house)-0.25rem)] border border-border bg-muted/40 px-4 py-3 font-mono text-xs leading-relaxed"
          role="status"
          style={{ color: phase === "deployed" ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          {status[phase]}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <ControlButton tone={primary.tone} onClick={() => setPhase(primary.next)}>
            {primary.label}
          </ControlButton>
          {canVeto && (
            <ControlButton onClick={() => setPhase("vetoed")} aria-label="veto the change before it ships">
              veto — hold it
            </ControlButton>
          )}
          <span className="font-mono text-[0.7rem] leading-snug text-muted-foreground">
            you hold the stop button, not the wrench.
          </span>
        </div>

        <Legend v5="a human shepherds every change in" v6="proposes, ships, and rolls itself back" />
      </div>
    </ArtifactFrame>
  );
}
