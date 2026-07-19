/* screenshot the site so the design can be judged by eye instead of guessed at.
   also fails loudly on page errors and horizontal overflow. */
import { chromium } from "/home/beckett/Projects/beckett/node_modules/playwright/index.mjs";
import fs from "node:fs";

const URL = process.env.SHOOT_URL || "http://127.0.0.1:8762/";
const OUT = process.env.SHOOT_OUT || "/tmp/v6shots";
fs.mkdirSync(OUT, { recursive: true });

const errors = [];

async function shoot(name, viewport) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${name}: console ${m.text()}`);
  });

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 1) errors.push(`${name}: horizontal overflow ${overflow}px`);

  await page.screenshot({ path: `${OUT}/${name}-hero.png` });
  await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });

  const total = await page.evaluate(() => document.body.scrollHeight);
  const steps = Math.min(Math.ceil(total / viewport.height), 9);
  for (let i = 1; i < steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * viewport.height * 0.92);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/${name}-${i}.png` });
  }

  await browser.close();
}

await shoot("desk", { width: 1440, height: 900 });
await shoot("phone", { width: 390, height: 844 });

console.log(errors.length ? errors.join("\n") : "no page errors, no overflow");
process.exit(errors.length ? 1 : 0);
