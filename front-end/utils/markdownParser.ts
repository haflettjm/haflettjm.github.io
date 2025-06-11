import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true, // allow raw HTML
  linkify: true, // Turn URLs into clickable links
  typographer: true, // Convert quotes & dashes into typographic versions
});
md.renderer.rules.link_open = (
  tokens: Token[],
  idx: number,
  options: MarkdownIt.Options,
  env: any,
  self: Renderer,
): string => {
  const token = tokens[idx];
  const existingClass = (token.attrGet("class") || "")
    .replace(/\btext-[^\s]+\b/g, "")
    .trim();

  token.attrSet(
    "class",
    `${existingClass} font-weight-300 text-pink-400 hover:text-pink-300 visited:text-pink-600`.trim(),
  );

  return self.renderToken(tokens, idx, options);
};
export function renderMarkdown(markdown: string): string {
  return md.render(markdown);
}
