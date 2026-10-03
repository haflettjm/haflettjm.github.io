// Renders public/content/resume.md to public/resume.pdf with headless Chromium.
// Run after editing the resume: npm run resume:pdf
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
const body = md.render(fs.readFileSync(path.join(root, "public/content/resume.md"), "utf8"));

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Jacob Haflett resume</title>
<style>
  @page { size: Letter; margin: 0.55in; }
  body { font: 10pt/1.45 system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #111; }
  h1 { font-size: 20pt; margin: 0 0 2pt; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #999; padding-bottom: 2pt; margin: 14pt 0 6pt; }
  h3 { font-size: 10.5pt; margin: 8pt 0 0; }
  ul { margin: 3pt 0 0; padding-left: 14pt; }
  li { margin: 1.5pt 0; }
  p { margin: 3pt 0; }
  a { color: #111; text-decoration: none; }
  hr { border: 0; border-top: 1px solid #ccc; margin: 6pt 0; }
</style></head><body>${body}</body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.pdf({
    path: path.join(root, "public/resume.pdf"),
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log("wrote public/resume.pdf");
} finally {
  await browser.close();
}
