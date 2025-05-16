# haflettjm.github.io

This is the personal portfolio site for **Jacob Haflett**, built with:

- 🧠 [Nuxt 3](https://nuxt.com) – Frontend framework (Vue-based)
- 🎨 [Tailwind CSS v4](https://tailwindcss.com) – Utility-first styling
- ⚙️ [Deno](https://deno.land) – Used for package management and tooling
- 📝 Custom CSS variables – For dynamic theming and terminal-inspired CRT effects
- 🧾 Markdown-based content – Served via Go backend (WIP)

---

## 🖥️ Project Structure

```
root/
├── assets/
│   └── css/
│       └── main.css            # Tailwind + custom CRT styles
├── components/                 # Nuxt components
├── layouts/
│   └── default.vue             # Global layout with CRT base style
├── pages/
│   └── index.vue               # Home page content
├── public/                     # Static assets
├── front-end/                 # Nuxt app source (same project, different folder name)
├── back-end/                  # Go server (WIP, not part of Nuxt build)
│   └── content-generator/     # Markdown to JSON static content gen (WIP)
├── nuxt.config.ts             # Nuxt configuration
├── deno.json                  # Deno configuration
└── tsconfig.json              # TypeScript config
```

---

## 🧪 Development

```bash
# Run the Nuxt frontend dev server (from project root)
deno task dev
```

Make sure you have `deno.json` or `deno.jsonc` configured like:

```jsonc
{
  "tasks": {
    "dev": "npx nuxt dev"
  }
}
```

---

## 🎨 Styling

- All styles and CRT effects are defined in `assets/css/main.css`
- Key custom properties:
  - `--crt-bg`: background color
  - `--crt-text`: text color
  - `--crt-text-shadow`: glow effect
  - `--crt-scanline-color`: scanline stripe overlay
  - `--crt-font`: monospace font

---

## 📦 TODO / In Progress

- [x] Configure Tailwind and Nuxt with Deno
- [ ] Apply CRT terminal styling
- [ ] Hook up Go backend to serve content
- [ ] Generate static blog/portfolio entries via Markdown
- [ ] Integrate resume parser into homepage
- [ ] Add routing and page transitions
- [ ] Improve mobile view and accessibility

---

## 🤘 Philosophy

Minimalist, retro-futuristic, accessible, and fast. A terminal-inspired UI for developers that want substance over fluff.
