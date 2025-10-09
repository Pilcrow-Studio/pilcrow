import { repositoryName, apiEndpoint } from "./slicemachine.config.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  experimental: {
    appManifest: false,
    viewTransition: false,
    crossOriginPrefetch: true,
    payloadExtraction: false,
  },

  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    buildAssetsDir: "/_nuxt/",
    head: {
      title: "Pilcrow Digitalstudio",
      htmlAttrs: {
        lang: "no",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxtjs/prismic",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/seo",
    "@pinia/nuxt",
    "nuxt-vitalizer",
    "@nuxt/scripts",
  ],

  site: {
    name: "Pilcrow",
  },

  components: true,

  css: ["~/assets/css/tailwind.css", "~/assets/css/main.css"],

  image: {
    provider: "prismic",
    prismic: {
      endpoint: repositoryName,
    },
    screens: {
      mobile: 600,
      tablet: 800,
      desktop: 1200,
    },
    quality: 70,
    format: ["avif", "webp"],
    ipx: {
      modifiers: {
        format: "avif",
      },
    },
    imgix: {
      defaultParams: {
        fm: "avif",
        q: 70,
      },
    },
  },

  build: {
    transpile: ["gsap"],
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    prismicWebhookSecret: process.env.PRISMIC_WEBHOOK_SECRET,

    // Public keys (exposed to client-side)
    public: {
      // Add any client-side config here if needed
    },
  },

  prismic: {
    endpoint: apiEndpoint || repositoryName,
    preview: "/api/preview",
    clientConfig: {
      routes: [
        {
          type: "page",
          path: "/:uid",
        },
        {
          type: "page",
          uid: "home",
          path: "/",
        },
      ],
    },
  },

  compatibilityDate: "2025-07-16",

  nitro: {
    preset: "netlify",
    output: {
      publicDir: ".output/public",
    },
  },

  routeRules: {
    // API routes should not be cached
    "/api/**": { cache: false },
    "/**": { isr: 300 },
  },
});
