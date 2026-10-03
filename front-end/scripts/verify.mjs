// Verification harness. Serves .output/public, drives Chromium at three viewports,
// and asserts the portfolio meets layout, accessibility, motion and content-honesty rules.
// Never lower a threshold or delete a check. The check count may only go up.
// In-page code runs through page.$eval("html", fn). That is Playwright's browser-context API,
// not JavaScript eval(): fn is a static function in this file, run only against our own local build.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, ".output/public");
const ralphDir = path.resolve(root, "../.ralph");
const shotsDir = path.join(ralphDir, "shots");
const minChecksFile = path.join(ralphDir, "min-checks");
fs.mkdirSync(shotsDir, { recursive: true });

let passed = 0;
let failed = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) passed++;
  else {
    failed++;
    failures.push(`FAIL ${name}${detail ? ` :: ${detail}` : ""}`);
  }
}

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".ico": "image/x-icon", ".svg": "image/svg+xml", ".pdf": "application/pdf",
  ".txt": "text/plain", ".md": "text/markdown", ".woff2": "font/woff2", ".webp": "image/webp",
};
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(outDir, p);
  if (!file.startsWith(outDir)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file) && fs.existsSync(`${file}/index.html`)) file = `${file}/index.html`;
  if (!fs.existsSync(file)) { res.writeHead(404).end("not found"); return; }
  res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
];
const STATUSES = ["live", "early", "private", "in progress"];

/** Run fn inside the page and return its result. */
const inPage = (page, fn) => page.$eval("html", fn);

async function autoScroll(page) {
  await inPage(page, async () => {
    await new Promise((resolve) => {
      const step = Math.max(200, innerHeight * 0.6);
      let y = 0;
      const t = setInterval(() => {
        window.scrollBy({ top: step, behavior: "instant" });
        y += step;
        if (y >= document.documentElement.scrollHeight + step) { clearInterval(t); resolve(); }
      }, 120);
    });
  });
  await page.waitForTimeout(900);
  await inPage(page, () => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});

try {
  // ---------- static content checks ----------
  for (const f of ["experience", "projects", "skills"]) {
    check(`content/${f}.ts exists`, fs.existsSync(path.join(root, `content/${f}.ts`)));
  }
  check("skills data has a growth flag", /growth/.test(fs.readFileSync(path.join(root, "content/skills.ts"), "utf8")));
  const resumeMd = fs.readFileSync(path.join(root, "public/content/resume.md"), "utf8");
  const aboutMd = fs.readFileSync(path.join(root, "public/content/about.md"), "utf8");
  const truth = `${resumeMd}\n${aboutMd}`;
  for (const f of ["about", "contact", "home", "projects", "resume", "skills"]) {
    check(`/content/${f}.md still ships`, fs.existsSync(path.join(outDir, `content/${f}.md`)));
  }

  // ---------- resume pdf ----------
  const pdfRes = await fetch(`${base}resume.pdf`);
  const pdfBuf = Buffer.from(await pdfRes.arrayBuffer());
  check("resume.pdf served 200", pdfRes.status === 200, String(pdfRes.status));
  check("resume.pdf over 10KB", pdfBuf.length > 10240, `${pdfBuf.length} bytes`);
  check("resume.pdf starts with %PDF", pdfBuf.subarray(0, 4).toString() === "%PDF");

  // ---------- per viewport ----------
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const errors = [];
    const badRequests = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("requestfailed", (r) => badRequests.push(`failed ${r.url()}`));
    page.on("response", (r) => { if (r.status() >= 400) badRequests.push(`${r.status()} ${r.url()}`); });
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });

    await page.goto(base, { waitUntil: "domcontentloaded" });
    const h1Fast = await page
      .waitForFunction(() => {
        const h = document.querySelector("h1");
        if (!h) return false;
        const r = h.getBoundingClientRect();
        const cs = getComputedStyle(h);
        return r.width > 0 && cs.visibility === "visible" && Number(cs.opacity) > 0.99;
      }, null, { timeout: 300 })
      .then(() => true, () => false);
    check(`[${vp.name}] h1 visible within 300ms of DOMContentLoaded`, h1Fast);

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);
    const clsLoad = await inPage(page, () => window.__cls);
    check(`[${vp.name}] CLS after load under 0.05`, clsLoad < 0.05, String(clsLoad));

    // document
    const meta = await inPage(page, () => ({
      lang: document.documentElement.lang,
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
      mains: document.querySelectorAll("main").length,
      headers: document.querySelectorAll("body header").length,
      footers: document.querySelectorAll("body footer").length,
      navs: document.querySelectorAll("nav[aria-label]").length,
      h1s: [...document.querySelectorAll("h1")].map((h) => h.textContent || ""),
      skip: !!document.querySelector('a[href="#main"]'),
    }));
    check(`[${vp.name}] html lang set`, meta.lang === "en");
    check(`[${vp.name}] document title and description`, meta.title.length > 10 && meta.desc.length > 30);
    check(`[${vp.name}] landmarks: one main, header, footer, labelled nav`,
      meta.mains === 1 && meta.headers === 1 && meta.footers === 1 && meta.navs >= 1, JSON.stringify(meta));
    check(`[${vp.name}] skip link present`, meta.skip);
    check(`[${vp.name}] exactly one h1 containing Jacob Haflett`,
      meta.h1s.length === 1 && /Jacob Haflett/.test(meta.h1s[0]), JSON.stringify(meta.h1s));
    check(`[${vp.name}] no console errors or page errors`, errors.length === 0, errors.slice(0, 3).join(" | "));
    check(`[${vp.name}] no failed or 4xx requests`, badRequests.length === 0, badRequests.slice(0, 3).join(" | "));

    // overflow
    const overflow = await inPage(page, () => document.documentElement.scrollWidth - window.innerWidth);
    check(`[${vp.name}] no horizontal overflow`, overflow <= 0, `${overflow}px`);

    // hero + CTAs inside first viewport
    const hero = await inPage(page, () => {
      const box = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, width: r.width, height: r.height };
      };
      return {
        role: box("[data-role]"),
        resume: box('a[href="/resume.pdf"]'),
        contact: box('a[href="#contact"].btn'),
        github: box('a[href*="github.com/haflettjm"].btn'),
        vh: window.innerHeight,
      };
    });
    check(`[${vp.name}] role line visible in first viewport`, !!hero.role && hero.role.width > 0 && hero.role.bottom <= hero.vh);
    for (const k of ["resume", "contact", "github"]) {
      const b = hero[k];
      check(`[${vp.name}] ${k} CTA inside first viewport`, !!b && b.width > 0 && b.top >= 0 && b.bottom <= hero.vh,
        JSON.stringify(b));
    }

    // sections
    const sections = await inPage(page, () => {
      const wanted = ["work", "experience", "skills", "contact"];
      const secs = [...document.querySelectorAll("main section[id]")].filter((s) => wanted.includes(s.id));
      return secs.map((s) => {
        const r = s.getBoundingClientRect();
        const cs = getComputedStyle(s);
        return { id: s.id, h2: !!s.querySelector("h2"), visible: r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden" };
      });
    });
    check(`[${vp.name}] sections work, experience, skills, contact in DOM order`,
      sections.map((s) => s.id).join(",") === "work,experience,skills,contact", JSON.stringify(sections));
    check(`[${vp.name}] each section has an h2`, sections.length === 4 && sections.every((s) => s.h2));
    check(`[${vp.name}] all sections visible without clicks`, sections.length === 4 && sections.every((s) => s.visible));

    // computed style rules
    const css = await inPage(page, () => {
      const visible = (el) => {
        const cs = getComputedStyle(el);
        return el.getClientRects().length > 0 && cs.visibility !== "hidden" && cs.display !== "none";
      };
      const parse = (s) => {
        let m = s.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
          return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
        }
        m = s.match(/color\(srgb ([^)]+)\)/);
        if (m) {
          const p = m[1].split(/[ /]+/).filter(Boolean).map(Number);
          return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] === undefined ? 1 : p[3]];
        }
        return [0, 0, 0, 1];
      };
      const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3]));
      const lum = (c) => {
        const f = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
        return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
      };
      const bgOf = (el) => {
        const chain = [];
        for (let e = el; e; e = e.parentElement) chain.unshift(e);
        let bg = [255, 255, 255];
        for (const e of chain) {
          const c = parse(getComputedStyle(e).backgroundColor);
          if (c[3] > 0) bg = over(c, bg);
        }
        return bg;
      };
      const contrast = (el) => {
        const bg = bgOf(el);
        const fg = over(parse(getComputedStyle(el).color), bg);
        const a = lum(fg), b = lum(bg);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      };
      const ps = [...document.querySelectorAll("main p")].filter(visible);
      const chWidth = (el) => {
        const probe = document.createElement("span");
        probe.style.cssText = "display:block;width:80ch;height:0;visibility:hidden";
        el.appendChild(probe);
        const w = probe.getBoundingClientRect().width;
        probe.remove();
        return w;
      };
      const flow = [...document.querySelectorAll("main p, main li, main a")].filter(visible);
      const taps = [...document.querySelectorAll("a, button")].filter((e) => !e.closest("p") && visible(e));
      const body = getComputedStyle(document.body);
      const h1 = getComputedStyle(document.querySelector("h1"));
      const ratio = (el) => {
        const cs = getComputedStyle(el);
        return parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);
      };
      return {
        bodyFont: parseFloat(body.fontSize),
        pCount: ps.length,
        minPFont: Math.min(...ps.map((p) => parseFloat(getComputedStyle(p).fontSize))),
        minPLine: Math.min(...ps.map(ratio)),
        minLiLine: Math.min(...[...document.querySelectorAll("main li")].filter(visible).map(ratio)),
        widest: Math.max(...ps.map((p) => p.getBoundingClientRect().width - chWidth(p))),
        shadows: flow.filter((e) => getComputedStyle(e).textShadow !== "none").map((e) => e.tagName + "." + e.className).slice(0, 5),
        minContrast: Math.min(...ps.map(contrast)),
        h1Font: parseFloat(h1.fontSize),
        smallTaps: taps.filter((e) => e.getBoundingClientRect().height < 43.5).map((e) => `${e.tagName}:${(e.textContent || "").trim().slice(0, 20)}:${Math.round(e.getBoundingClientRect().height)}`),
        tapCount: taps.length,
      };
    });
    check(`[${vp.name}] body font-size >= 16px`, css.bodyFont >= 16, `${css.bodyFont}`);
    check(`[${vp.name}] paragraphs exist and are >= 16px`, css.pCount > 5 && css.minPFont >= 16, `n=${css.pCount} min=${css.minPFont}`);
    check(`[${vp.name}] line-height >= 1.5 on p and li`, css.minPLine >= 1.5 && css.minLiLine >= 1.5, `${css.minPLine} ${css.minLiLine}`);
    check(`[${vp.name}] paragraph width <= 80ch`, css.widest <= 1, `${css.widest}px over`);
    check(`[${vp.name}] p, li, a have no text-shadow at rest`, css.shadows.length === 0, css.shadows.join(","));
    check(`[${vp.name}] paragraph contrast >= 7:1`, css.minContrast >= 7, css.minContrast.toFixed(2));
    check(`[${vp.name}] hero h1 size`, vp.width >= 1000 ? css.h1Font >= 40 : css.h1Font >= 28, `${css.h1Font}px`);
    if (vp.name === "390") {
      check(`[390] tap targets >= 44px high`, css.tapCount > 5 && css.smallTaps.length === 0, css.smallTaps.join(" | "));
    }

    // work cards (desktop only, same data on all)
    if (vp.name === "1440") {
      const cards = await inPage(page, () =>
        [...document.querySelectorAll("[data-project]")].map((c) => ({
          id: c.getAttribute("data-project-id"),
          status: (c.querySelector("[data-status]")?.textContent || "").trim(),
        })));
      check("[1440] at least 4 project cards", cards.length >= 4, String(cards.length));
      check("[1440] every project card has an honest status label", cards.length > 0 && cards.every((c) => STATUSES.includes(c.status)), JSON.stringify(cards));
      check("[1440] llm-tutor is labelled early", cards.some((c) => c.id === "llm-tutor" && c.status === "early"));
      const growth = await inPage(page, () => {
        const els = [...document.querySelectorAll('[data-growth="true"]')];
        return { n: els.length, labelled: els.every((e) => /learning/i.test(e.textContent || "")), dashed: els.every((e) => getComputedStyle(e).borderStyle.includes("dashed")) };
      });
      check("[1440] growth skills are visually marked", growth.n >= 1 && growth.labelled && growth.dashed, JSON.stringify(growth));
      const contact = await inPage(page, () => (document.querySelector("#contact")?.textContent || ""));
      check("[1440] contact section mentions contract work", /contract/i.test(contact));
      check("[1440] contact section links the resume pdf", await inPage(page, () => !!document.querySelector('#contact a[href="/resume.pdf"]')));
    }

    // numeric claims must come from the resume or about copy
    const text = await inPage(page, () => document.body.innerText);
    const tokens = [...new Set(text.match(/\d[\d,.]*\s?(%|K|GB)/g) || [])];
    const unknown = tokens.filter((t) => !truth.includes(t));
    check(`[${vp.name}] every numeric claim appears in resume.md or about.md`, tokens.length > 0 && unknown.length === 0, `unknown: ${unknown.join(" | ")}`);

    // boot controls (desktop shows the boot panel)
    if (vp.name === "1440") {
      check("[1440] boot has a skip control", await inPage(page, () => {
        const b = document.querySelector("button[data-skip-boot]");
        return !!b && b.getClientRects().length > 0;
      }));
    }

    // scroll to trigger reveals, then axe and screenshot
    await autoScroll(page);
    const axe = await new AxeBuilder({ page }).analyze();
    check(`[${vp.name}] axe: zero violations`, axe.violations.length === 0,
      JSON.stringify(axe.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, t: v.nodes.slice(0, 2).map((n) => n.target.join(" ")) }))));
    check(`[${vp.name}] axe checked color-contrast`, axe.passes.some((r) => r.id === "color-contrast"));
    await page.screenshot({ path: path.join(shotsDir, `${vp.name}.png`), fullPage: true });
    check(`[${vp.name}] screenshot saved`, fs.existsSync(path.join(shotsDir, `${vp.name}.png`)));

    // terminal overlay (desktop and phone)
    if (vp.name !== "768") {
      const toggle = page.locator("button[data-terminal-toggle]");
      check(`[${vp.name}] terminal toggle is a labelled button`, ((await toggle.getAttribute("aria-label")) || "").length > 3);
      await toggle.click();
      await page.waitForTimeout(250);
      check(`[${vp.name}] terminal opens as an overlay`, await page.$eval("dialog.term", (d) => d.open));
      await page.fill("#term-input", "help");
      await page.press("#term-input", "Enter");
      await page.waitForTimeout(250);
      const out = await page.locator(".term__out").innerText();
      check(`[${vp.name}] help prints the commands`, /about/.test(out) && /projects/.test(out) && /contact/.test(out), out.slice(0, 80));
      await page.fill("#term-input", "projects");
      await page.press("#term-input", "Enter");
      await page.waitForTimeout(250);
      check(`[${vp.name}] projects command reads the data file`, /llm-tutor \[early\]/.test(await page.locator(".term__out").innerText()));
      const tOverflow = await inPage(page, () => {
        const d = document.querySelector("dialog.term");
        return { doc: document.documentElement.scrollWidth - window.innerWidth, dlg: d.scrollWidth - d.clientWidth };
      });
      check(`[${vp.name}] terminal has no horizontal overflow`, tOverflow.doc <= 0 && tOverflow.dlg <= 1, JSON.stringify(tOverflow));
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
      check(`[${vp.name}] Escape closes the terminal`, !(await page.$eval("dialog.term", (d) => d.open)));
      check(`[${vp.name}] focus returns to the toggle`, await inPage(page, () => document.activeElement?.hasAttribute("data-terminal-toggle")));
    }

    const clsEnd = await inPage(page, () => window.__cls);
    check(`[${vp.name}] CLS over the whole session under 0.05`, clsEnd < 0.05, String(clsEnd));

    // boot does not replay on a second visit in the same session
    if (vp.name === "1440") {
      await page.reload({ waitUntil: "domcontentloaded" });
      const done = await page
        .waitForFunction(() => document.querySelector("[data-boot]")?.getAttribute("data-boot") === "done", null, { timeout: 500 })
        .then(() => true, () => false);
      await page.waitForTimeout(400);
      const stillDone = await inPage(page, () => document.querySelector("[data-boot]")?.getAttribute("data-boot") === "done");
      check("[1440] boot does not replay on a second visit", done && stillDone);
    }
    await ctx.close();
  }

  // ---------- reduced motion ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const rm = await inPage(page, () => ({
      anims: document.getAnimations().length,
      hidden: [...document.querySelectorAll("[data-reveal]")].filter((e) => Number(getComputedStyle(e).opacity) < 1 || getComputedStyle(e).transform !== "none").length,
      reveal: document.querySelectorAll("[data-reveal]").length,
      boot: document.querySelector("[data-boot]")?.getAttribute("data-boot"),
    }));
    check("[reduced-motion] no running animations", rm.anims === 0, String(rm.anims));
    check("[reduced-motion] every reveal element is visible immediately", rm.reveal > 5 && rm.hidden === 0, JSON.stringify(rm));
    check("[reduced-motion] boot log is static", rm.boot === "done", String(rm.boot));
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}

const min = Number(fs.existsSync(minChecksFile) ? fs.readFileSync(minChecksFile, "utf8").trim() : 0) || 0;
const countOk = passed >= 40 && passed >= min;
if (failures.length) console.log(failures.join("\n"));
if (!countOk) console.log(`FAIL check count ${passed} is below the floor (40 and min-checks ${min})`);
console.log(`CHECKS: ${passed} passed, ${failed} failed`);
if (failed === 0 && countOk && passed > min) fs.writeFileSync(minChecksFile, `${passed}\n`);
process.exit(failed === 0 && countOk ? 0 : 1);
