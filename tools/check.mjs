/* interaction + a11y smoke test. run against local or the live URL. */
import { chromium } from "/home/beckett/Projects/beckett/node_modules/playwright/index.mjs";

const URL = process.env.CHECK_URL || "http://127.0.0.1:8762/";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1280, height: 850 } })).newPage();
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
await p.goto(URL, { waitUntil: "networkidle" });

let failed = 0;
const ok = (name, pass) => {
  if (!pass) failed++;
  console.log((pass ? "ok    " : "FAIL  ") + name);
};

// 01 — graph
await p.locator("#graph .node-hit").nth(2).hover();
await p.waitForTimeout(300);
ok("graph readout updates on hover", /cast 217/.test(await p.locator("#graph-readout").innerText()));
ok("graph lights incident edges", (await p.locator('#graph .edge[data-lit="true"]').count()) > 0);

// 02 — re-cast
const before = await p.locator("#recast-note").innerText();
await p.locator("#recast").click();
await p.waitForTimeout(400);
const after = await p.locator("#recast-note").innerText();
ok("re-cast rewrites the note", before !== after && /0\.37/.test(after));
ok("outlier flag clears after re-cast", (await p.locator('.bar[data-outlier="true"]').count()) === 0);
await p.locator("#recast").click();
await p.waitForTimeout(300);
ok("re-cast is reversible", (await p.locator('.bar[data-outlier="true"]').count()) === 1);

// 03 — version toggle
const d5 = await p.locator("#track .track-path").getAttribute("d");
await p.locator('[data-ver="v6"]').click();
await p.waitForTimeout(300);
ok("v5/v6 toggle swaps the path", d5 !== (await p.locator("#track .track-path").getAttribute("d")));
ok("toggle sets aria-pressed", (await p.locator('[data-ver="v6"]').getAttribute("aria-pressed")) === "true");

// 04 — transport ports
await p.locator("#seam .port").nth(1).hover();
await p.waitForTimeout(300);
ok("port hover updates readout", /terminal/.test(await p.locator("#seam-readout").innerText()));

// 05 — the eye
await p.locator("#rescan").scrollIntoViewIfNeeded();
await p.waitForTimeout(3400);
ok("all six verdicts print", (await p.locator("#verdicts .verdict-line.is-in").count()) === 6);

// keyboard + structure
await p.locator("#graph .node-hit").first().focus();
ok(
  "focus ring on svg node",
  (await p.evaluate(() => getComputedStyle(document.activeElement).outlineWidth)) !== "0px",
);
ok("exactly one h1", (await p.locator("h1").count()) === 1);
ok("five pillar headings", (await p.locator("main h2").count()) === 5);
ok("no page errors", errs.length === 0);
if (errs.length) console.log(errs.join("\n"));

await b.close();
console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
