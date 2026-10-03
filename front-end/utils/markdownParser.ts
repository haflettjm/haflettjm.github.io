import MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token.mjs";
import type Renderer from "markdown-it/lib/renderer.mjs";

const md = new MarkdownIt({
  html: true, // allow raw HTML
  linkify: true, // Turn URLs into clickable links
  typographer: true, // Convert quotes & dashes into typographic versions
});

md.renderer.rules.link_open = (
  tokens: Token[],
  idx: number,
  options: MarkdownIt.Options,
  _env: unknown,
  self: Renderer,
): string => {
  const token = tokens[idx];
  const existingClass = (token.attrGet("class") || "").trim();
  token.attrSet("class", `${existingClass} md-link`.trim());
  return self.renderToken(tokens, idx, options);
};

export function renderMarkdown(markdown: string): string {
  return md.render(markdown);
}
