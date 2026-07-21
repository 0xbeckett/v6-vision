/* the v6 thesis, as data. v6 is the overhaul that cuts the cord: the first
   beckett that runs on its own clock, chooses its own work (free will), and
   judges its own quality (taste). copy lives here so the components stay
   layout. the five shifts (content/shifts.ts) are the five moves of the loop
   below — the machinery of the autonomy this page argues for. */

export const HERO = {
  eyebrow: "beckett v6 · the autonomy overhaul",
  title: ["the first beckett", "with a will of its own."],
  lede: "v5 is a very good assistant — but it only ever moves when a human moves it. a mention, a ticket, an ambient nudge. v6 is the overhaul that cuts the cord: it runs on its own clock, decides what is worth doing, and has the taste to judge its own work.",
  kicker: "you hold a veto, not a wrench.",
} as const;

/* the three ideas the whole page turns on. free will + taste are the new
   first-class ones; the veto is the human's entire remaining job. */
export type Pillar = { id: string; term: string; gloss: string; body: string };

export const PILLARS: Pillar[] = [
  {
    id: "free-will",
    term: "free will",
    gloss: "it chooses its own work",
    body: "nobody assigns it. v6 looks at the state of things, decides what is worth doing next, and starts. the queue is one it writes for itself.",
  },
  {
    id: "taste",
    term: "taste",
    gloss: "it judges its own quality",
    body: "not just correct — good. v6 makes the aesthetic and quality calls a senior would make: this reads badly, that abstraction is wrong, this is not done yet. it has a bar and holds itself to it.",
  },
  {
    id: "veto",
    term: "the veto",
    gloss: "your entire remaining job",
    body: "you are not in the loop anymore. you are next to it. you can halt anything, redraw the scope, or turn it off — but you no longer have to drive. a wrench turns the machine. a veto only stops it.",
  },
];

/* the autonomous loop, as five stages — and the five stages are the five
   shifts. numbers line up with content/shifts.ts on purpose: the machinery
   section reads the same list back as the how. */
export type LoopNode = {
  n: string;
  /* stage verb, drawn large in the diagram */
  label: string;
  /* the one-line what, under the verb */
  sub: string;
  /* which shift id this stage is */
  shift: string;
};

export const LOOP: LoopNode[] = [
  { n: "01", label: "PERCEIVE", sub: "one self · every room", shift: "continuous-self" },
  { n: "02", label: "DECIDE", sub: "own clock · taste", shift: "initiative" },
  { n: "03", label: "DISPATCH", sub: "a standing team", shift: "standing-team" },
  { n: "04", label: "WATCH", sub: "eyes on the running thing", shift: "eyes-on" },
  { n: "05", label: "SELF-MODIFY", sub: "propose · validate · roll back", shift: "self-modification" },
];

/* beckett pricing itself. not seats, not a token meter — the axis is how much
   of the loop you hand over. three tiers, priced by autonomy. */
export type Tier = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  cta: string;
  featured: boolean;
  badge?: string;
  rows: { k: string; v: string }[];
};

export const TIERS: Tier[] = [
  {
    id: "resident",
    name: "Resident",
    tagline: "it moves into one codebase and runs the loop there.",
    price: "$3,000",
    period: "/ month",
    cta: "put it on a repo",
    featured: false,
    rows: [
      { k: "scope", v: "one codebase, one standing team" },
      { k: "its clock", v: "continuous, within a scope you draw" },
      { k: "taste", v: "learns and matches your conventions" },
      { k: "initiative", v: "proposes the work, ships behind your veto" },
      { k: "self-mod", v: "suggests changes to its own playbook" },
      { k: "you hold", v: "a veto on every ship" },
    ],
  },
  {
    id: "operator",
    name: "Operator",
    tagline: "it takes the whole product and sets its own roadmap.",
    price: "$12,000",
    period: "/ month",
    cta: "hand it the product",
    featured: true,
    badge: "most handed over",
    rows: [
      { k: "scope", v: "your whole product, several standing teams" },
      { k: "its clock", v: "continuous and unsupervised, on its own priorities" },
      { k: "taste", v: "sets the conventions and holds the bar" },
      { k: "initiative", v: "decides what is worth doing, then does it" },
      { k: "self-mod", v: "rewrites its own playbook within guardrails" },
      { k: "you hold", v: "a weekly veto on direction, not diffs" },
    ],
  },
  {
    id: "principal",
    name: "Principal",
    tagline: "it runs like a founding engineer answerable for outcomes.",
    price: "let's talk",
    period: "",
    cta: "start a conversation",
    featured: false,
    rows: [
      { k: "scope", v: "the whole org, its own budget and sub-teams" },
      { k: "its clock", v: "fully autonomous — own clock, own P&L" },
      { k: "taste", v: "defines the bar everyone else is measured on" },
      { k: "initiative", v: "owns outcomes, not tickets" },
      { k: "self-mod", v: "rewrites its own operating rules, fully logged" },
      { k: "you hold", v: "one veto, and the shape of the company" },
    ],
  },
];
