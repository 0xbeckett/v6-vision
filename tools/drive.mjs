/* temporary self-review driver: exercises each artifact's interaction and
   captures end-states, reduced-motion, and mobile. not committed. */
import { chromium } from "/home/beckett/Projects/beckett/node_modules/playwright/index.mjs";
import fs from "node:fs";

const URL = process.env.DRIVE_URL || "http://127.0.0.1:8841/";
const OUT = "/tmp/v6drive";
fs.mkdirSync(OUT, { recursive: true });
const errors = [];

async function withPage(fn, opts = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: opts.reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${e.message}`));
  await page.goto(URL, { waitUntil: "networkidle" });
  await fn(page);
  await browser.close();
}

const shot = (page, name, sel) =>
  sel ? page.locator(sel).screenshot({ path: `${OUT}/${name}.png` }) : page.screenshot({ path: `${OUT}/${name}.png` });

// ---- desktop: drive self-modification through deploy + rollback ----
await withPage(async (page) => {
  await page.locator("#self-modification").scrollIntoViewIfNeeded();
  const fig = "#self-modification figure";
  await shot(page, "05-stable", fig);
  await page.locator("#self-modification button:has-text('propose')").click();
  await page.locator("#self-modification button:has-text('validate')").click();
  await page.locator("#self-modification button:has-text('deploy')").click();
  await page.waitForTimeout(400);
  await shot(page, "05-deployed", fig);
  await page.locator("#self-modification button:has-text('roll back')").click();
  await page.waitForTimeout(400);
  await shot(page, "05-rolledback", fig);
});

// ---- desktop: veto path ----
await withPage(async (page) => {
  await page.locator("#self-modification").scrollIntoViewIfNeeded();
  await page.locator("#self-modification button:has-text('propose')").click();
  await page.locator("#self-modification button:has-text('veto')").click();
  await page.waitForTimeout(300);
  await shot(page, "05-vetoed", "#self-modification figure");
});

// ---- desktop: run the eyes-on loop to close ----
await withPage(async (page) => {
  await page.locator("#eyes-on").scrollIntoViewIfNeeded();
  await page.locator("#eyes-on button:has-text('run the loop')").click();
  await page.waitForTimeout(7000);
  await shot(page, "04-closed", "#eyes-on figure");
});

// ---- desktop: advance initiative to handled + done ----
await withPage(async (page) => {
  await page.locator("#initiative").scrollIntoViewIfNeeded();
  for (let i = 0; i < 3; i++) await page.locator("#initiative button:has-text('advance')").click();
  await page.waitForTimeout(300);
  await shot(page, "02-handled", "#initiative figure");
});

// ---- desktop: compound standing-team to pass 6 ----
await withPage(async (page) => {
  await page.locator("#standing-team").scrollIntoViewIfNeeded();
  for (let i = 0; i < 5; i++) await page.locator("#standing-team button:has-text('run again')").click();
  await page.waitForTimeout(400);
  await shot(page, "03-pass6", "#standing-team figure");
});

// ---- reduced motion: static legibility of 01 and 04 ----
await withPage(async (page) => {
  await page.locator("#continuous-self").scrollIntoViewIfNeeded();
  await shot(page, "01-reduced", "#continuous-self figure");
  await page.locator("#eyes-on").scrollIntoViewIfNeeded();
  await page.locator("#eyes-on button:has-text('run the loop')").click();
  await page.waitForTimeout(500);
  await shot(page, "04-reduced-run", "#eyes-on figure");
}, { reduced: true });

// ---- mobile: each artifact, uncramped check ----
await withPage(async (page) => {
  for (const [id, name] of [["continuous-self", "m01"], ["initiative", "m02"], ["standing-team", "m03"], ["eyes-on", "m04"], ["self-modification", "m05"]]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await shot(page, name, `#${id} figure`);
  }
}, { viewport: { width: 390, height: 844 } });

console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "no page errors");
process.exit(errors.length ? 1 : 0);
