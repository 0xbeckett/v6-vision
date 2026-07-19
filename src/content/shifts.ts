/* the thesis, as data. copy lives here so the section components stay layout
   and branch #45.2 can hang interactive demos off the same five ids. */

export type Shift = {
  id: string;
  n: string;
  /* short label for the index rail */
  label: string;
  title: string;
  /* the claim, in one line */
  claim: string;
  v5: string;
  v6: string;
  body: string[];
  /* the line that lands the section */
  close: string;
};

export const SHIFTS: Shift[] = [
  {
    id: "continuous-self",
    n: "01",
    label: "one continuous self",
    title: "one continuous self, not a set of transcripts",
    claim: "context stops being a window that rotates and starts being a life that accumulates.",
    v5: "per-channel sessions with a memory agent bolted on the side",
    v6: "a single identity holding every room, project, and past decision at once",
    body: [
      "v5 is a collection of sessions. every room is its own amnesia. what survives between them is whatever a summarizer happened to think was worth writing down.",
      "v6 has one self. it knows what it decided in a thread three weeks ago because it was there, not because there is a note about it somewhere.",
    ],
    close: "one self. every room. no re-introductions.",
  },
  {
    id: "initiative",
    n: "02",
    label: "initiative",
    title: "initiative, not response",
    claim: 'the unit of value moves from "answered fast" to "already handled."',
    v5: "acts when spoken to — a mention, a nudge, a ticket update",
    v6: "runs on its own clock and arrives with the work already drafted",
    body: [
      "v5 waits. something has to arrive before anything happens. left alone in a quiet room it does nothing, indefinitely.",
      "v6 notices a failing pattern before anyone reports it, proposes the work, and shows up with the fix in hand.",
    ],
    close: "the best ticket is the one nobody had to write.",
  },
  {
    id: "standing-team",
    n: "03",
    label: "a standing team",
    title: "a standing team, not disposable workers",
    claim: "casting stops being a guess made from a table and becomes a judgement made from history.",
    v5: "every worker cold-started, one-shot, and forgetting on exit",
    v6: "apprentices that accumulate skill per-codebase and per-domain",
    body: [
      "today the same lesson about the same repo gets learned and thrown away a hundred times. nothing compounds.",
      "v6's workers get better at the repos they have worked in. the second pass through a codebase is not the first pass again.",
    ],
    close: "a team that has been here before.",
  },
  {
    id: "eyes-on",
    n: "04",
    label: "eyes on the running thing",
    title: "eyes on the running thing",
    claim: "idea to deployed to observed, closed by one system, with no human relaying between the stages.",
    v5: "ships code and infers success from a green check",
    v6: "sees the rendered ui, reads the production signal, catches its own regressions",
    body: [
      "a green check is not a working product. it is a claim about a test suite.",
      "v6 watches what it shipped. the loop closes where the software actually runs, not where the pipeline ends.",
    ],
    close: "shipped is not the last step. it is the middle one.",
  },
  {
    id: "self-modification",
    n: "05",
    label: "safe self-modification",
    title: "safe self-modification",
    claim: "the human holds a veto, not a wrench.",
    v5: "can file a ticket against its own source; a human shepherds every change in",
    v6: "proposes, validates, deploys, and rolls itself back when it was wrong",
    body: [
      "v5 can describe the change it wants to itself. someone else still has to review it, merge it, and restart the process.",
      "v6 improves itself continuously, and the rollback is part of the system rather than part of the incident.",
    ],
    close: "it changes itself. you keep the stop button.",
  },
];
