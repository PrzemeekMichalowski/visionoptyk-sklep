import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-12',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],

  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  runtimeConfig: {
    public: {
      // Publiczny token Storefront API jest z założenia jawny — trafia do bundla
      // przeglądarki. Prywatny token (server-side) NIE należy tu nigdy dodawać.
      shopifyDomain: '',
      shopifyToken: '',
      shopifyApiVersion: '2026-07',
    },
  },
})
