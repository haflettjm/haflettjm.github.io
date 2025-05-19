export default defineNuxtConfig({
  ssr: true,
  target: 'static',
  modules: ["@nuxtjs/tailwindcss"],
  app:{
    baseURL:'/',
  }
});
