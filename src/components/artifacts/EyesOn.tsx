import { useEffect, useRef, useState } from "react";
import { ArtifactFrame, ControlButton, Legend } from "@/components/artifacts/ArtifactFrame";
import { useReducedMotion } from "@/lib/hooks";

/* shift 04 — eyes on the running thing.
   v5's pipeline ends at the green check. v6's keeps going: it watches what it
   shipped, catches its own regression in production, and loops back to fix it.
   run it and the loop actually closes on screen — deploy → observe → back to
   build → deploy → healthy. */

const STAGES = ["idea", "build", "deploy", "observe"] as const;

type Signal = { kind: "ok" | "warn" | "idle"; text: string };

type Step = { stage: number; caption: string; signal: Signal };

const SCRIPT: Step[] = [
  { stage: 0, caption: "a change worth making", signal: { kind: "idle", text: "—" } },
  { stage: 1, caption: "writes the change", signal: { kind: "idle", text: "—" } },
  { stage: 2, caption: "ships it — tests pass, green check", signal: { kind: "idle", text: "green check ✓ — v5 would stop here" } },
  { stage: 3, caption: "watches the running product", signal: { kind: "warn", text: "render regression on /pricing — caught in prod" } },
  { stage: 1, caption: "loops back, patches what it saw", signal: { kind: "warn", text: "regression owned, not filed" } },
  { stage: 2, caption: "re-ships the fix", signal: { kind: "idle", text: "green check ✓ (again)" } },
  { stage: 3, caption: "reads production once more", signal: { kind: "ok", text: "healthy — the loop closed itself" } },
];

const LAST = SCRIPT.length - 1;

export function EyesOn() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (reduced) {
      setStep(LAST);
      setPlaying(false);
      return;
    }
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= LAST) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 900);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, reduced]);

  const cur = SCRIPT[step];
  const closed = step >= LAST;
  const onSecondLap = step >= 4;

  const run = () => {
    if (closed) setStep(0);
    setPlaying(true);
  };

  return (
    <ArtifactFrame label="eyes on the running thing" hint="run the loop →">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            step <span className="tabular-nums text-foreground">{step + 1}</span>/{SCRIPT.length}
            {onSecondLap && <span className="ml-2 text-primary">· lap 2 ↺</span>}
          </span>
          <div className="flex gap-2">
            <ControlButton onClick={() => { setPlaying(false); setStep(0); }} disabled={step === 0 && !playing}>
              reset
            </ControlButton>
            <ControlButton tone="primary" onClick={playing ? () => setPlaying(false) : run}>
              {playing ? "pause" : closed ? "run again ▸" : "run the loop ▸"}
            </ControlButton>
          </div>
        </div>

        {/* the four stages, as a ring flattened into a row */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {STAGES.map((label, i) => {
            const active = cur.stage === i;
            const isGreenCheck = i === 2;
            return (
              <div
                key={label}
                className="relative flex flex-col gap-1 rounded-[calc(var(--radius-house)-0.25rem)] border p-3 transition-colors duration-300 ease-out"
                style={{
                  borderColor: active ? "var(--primary)" : "var(--border)",
                  backgroundColor: active ? "var(--muted)" : "transparent",
                }}
              >
                <span className="flex items-center justify-between font-mono text-[0.7rem] tracking-widest uppercase" style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}>
                  <span>{i + 1} · {label}</span>
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: active ? "var(--primary)" : "var(--border)" }}
                  />
                </span>
                {isGreenCheck && (
                  <span className="font-mono text-[0.62rem] leading-tight text-muted-foreground">
                    v5 stops here
                  </span>
                )}
                {i === 3 && (
                  <span className="font-mono text-[0.62rem] leading-tight text-primary">
                    v6 keeps going ↺
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* the closing arc, made explicit */}
        <div
          className="flex items-center gap-2 rounded-[calc(var(--radius-house)-0.25rem)] border border-dashed px-3 py-2 font-mono text-[0.7rem] tracking-wide transition-colors duration-300"
          style={{
            borderColor: onSecondLap ? "var(--primary)" : "var(--border)",
            color: onSecondLap ? "var(--primary)" : "var(--muted-foreground)",
          }}
        >
          <span aria-hidden>↩</span>
          observe → build — {onSecondLap ? "the loop closed" : "where the loop returns"}
        </div>

        {/* the production signal it's reading */}
        <div className="rounded-[calc(var(--radius-house)-0.25rem)] border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed" role="status">
          <p className="tracking-widest text-muted-foreground uppercase">production signal</p>
          <p
            className="mt-2 flex items-center gap-2"
            style={{
              color:
                cur.signal.kind === "warn"
                  ? "var(--foreground)"
                  : cur.signal.kind === "ok"
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
            }}
          >
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  cur.signal.kind === "warn"
                    ? "var(--ring)"
                    : cur.signal.kind === "ok"
                      ? "var(--primary)"
                      : "var(--border)",
              }}
            />
            {cur.signal.text}
          </p>
          <p className="mt-2 text-muted-foreground">{cur.caption}</p>
        </div>

        <Legend v5="infers success from a green check" v6="reads the running product" />
      </div>
    </ArtifactFrame>
  );
}
