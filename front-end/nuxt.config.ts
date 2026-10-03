export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: { cssPath: "~/assets/styles/tailwind.css" },
  css: ["~/assets/styles/site.css"],
  devtools: { enabled: false },
  compatibilityDate: "2025-05-01",
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: "Jacob Haflett | Senior Backend and AI Platform Engineer",
      meta: [
        {
          name: "description",
          content:
            "Jacob Haflett builds data platforms, multi-tenant APIs and LLM-powered systems, and runs them in production.",
        },
        { name: "theme-color", content: "#0c0b0f" },
      ],
      link: [{ rel: "icon", href: "/favicon.ico" }],
    },
  },
});
