/* the five shifts, as data — reframed as the machinery of autonomy. each shift
   is one move of the loop in content/autonomy.ts (the `stage` field names it).
   free will and taste are the thesis; these five are how the thing actually
   runs. copy lives here so the section stays layout. */

export type Shift = {
  id: string;
  n: string;
  /* the loop stage this shift is */
  stage: string;
  /* short label for the rail */
  label: string;
  title: string;
  /* the claim, in one line */
  claim: string;
  v5: string;
  v6: string;
  /* the line that lands the row */
  close: string;
};

export const SHIFTS: Shift[] = [
  {
    id: "continuous-self",
    n: "01",
    stage: "perceive",
    label: "one continuous self",
    title: "one continuous self, not a set of transcripts",
    claim: "a will needs a self to hold it. v6 has one that never resets.",
    v5: "per-channel sessions with a memory agent bolted on the side",
    v6: "a single identity holding every room, project, and past decision at once",
    close: "it perceives everything at once because it never left.",
  },
  {
    id: "initiative",
    n: "02",
    stage: "decide",
    label: "initiative",
    title: "initiative, not response",
    claim: "this is where free will lives: it decides, on its own clock, what is worth doing.",
    v5: "acts when spoken to — a mention, a nudge, a ticket update",
    v6: "runs on its own clock and arrives with the work already chosen and drafted",
    close: "the best ticket is the one nobody had to write.",
  },
  {
    id: "standing-team",
    n: "03",
    stage: "dispatch",
    label: "a standing team",
    title: "a standing team, not disposable workers",
    claim: "having decided, it dispatches a team that has been here before.",
    v5: "every worker cold-started, one-shot, and forgetting on exit",
    v6: "apprentices that accumulate skill per-codebase and per-domain",
    close: "the second pass through a repo is not the first pass again.",
  },
  {
    id: "eyes-on",
    n: "04",
    stage: "watch",
    label: "eyes on the running thing",
    title: "eyes on the running thing",
    claim: "taste needs to see the result. v6 watches what it shipped, in production.",
    v5: "ships code and infers success from a green check",
    v6: "sees the rendered ui, reads the production signal, catches its own regressions",
    close: "a green check is a claim about a test suite, not a working product.",
  },
  {
    id: "self-modification",
    n: "05",
    stage: "self-modify",
    label: "safe self-modification",
    title: "safe self-modification",
    claim: "the loop closes on itself: it improves the thing doing the improving. you keep the veto.",
    v5: "can file a ticket against its own source; a human shepherds every change in",
    v6: "proposes, validates, deploys, and rolls itself back when it was wrong",
    close: "it changes itself. you keep the stop button.",
  },
];
