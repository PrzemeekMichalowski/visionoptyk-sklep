import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-12',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/fonts'],

  /*
   * Waga 900 jest obowiązkowa — nagłówki na badanie.visionoptyk.pl i
   * promocje.visionoptyk.pl są w 900, nie 700. Bez tego sklep wygląda jak
   * inna marka mimo tych samych barw.
   */
  fonts: {
    families: [{ name: 'Roboto', provider: 'google', weights: [400, 500, 700, 900] }],
  },

  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  /*
   * Dopóki sklep stoi na *.vercel.app, nie może trafić do indeksu. Ta sama
   * treść pod adresem testowym i docelowym to duplikat, który konkurowałby
   * z visionoptyk.pl — domeną w szczycie widoczności. Zdejmij ten blok
   * dopiero razem z podpięciem sklep.visionoptyk.pl.
   */
  routeRules: {
    '/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
  },

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
