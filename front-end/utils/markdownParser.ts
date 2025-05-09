import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true, // allow raw HTML
  linkify: true, // Turn URLs into clickable links
  typographer: true, // Convert quotes & dashes into typographic versions
});

export function renderMarkdown(text: string): string {
  return md.render(text);
}
