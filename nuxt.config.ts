import { repositoryName, apiEndpoint } from "./slicemachine.config.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  experimental: {
    appManifest: false,
    viewTransition: false,
    crossOriginPrefetch: true,
    payloadExtraction: false,
    componentIslands: true,
  },

  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    buildAssetsDir: "/_nuxt/",
    head: {
      htmlAttrs: {
        lang: "no",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
        { rel: "dns-prefetch", href: "https://pilcrow.cdn.prismic.io" },
      ],
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
    "motion-v/nuxt",
  ],

  site: {
    name: "Pilcrow",
    url: "https://www.pilcrow.no",
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
        {
          type: "page",
          uid: "lab",
          path: "/lab",
        },
      ],
    },
  },

  compatibilityDate: "2025-07-16",

  vue: {
    compilerOptions: {
      // Removed unused mux-player custom element
    },
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor chunks for better caching
            "prismic-vendor": ["@prismicio/client", "@prismicio/vue"],
            motion: ["motion-v"],
          },
        },
      },
    },
  },

  build: {
    transpile: ["motion-v"],
  },

  nitro: {
    preset: "netlify",
    output: {
      publicDir: ".output/public",
    },
  },

  routeRules: {
    // Cached API endpoints for Prismic content
    "/api/pages/**": { swr: 3600 },
    // Webhook should not be cached
    "/api/prismic/**": { cache: false },
    // Other API routes should not be cached
    "/api/**": { cache: false },
    // Page routes with ISR
    "/": { isr: 600, swr: 1200 },
    "/lab": { isr: 3600, swr: 7200 },
    "/**": { isr: 600, swr: true },
  },
  hooks: {
    "pages:extend"(pages) {
      if (process.env.NODE_ENV === "production") {
        // Remove slice-simulator page in production
        const sliceSimIndex = pages.findIndex(
          (page) => page.path === "/slice-simulator"
        );
        if (sliceSimIndex !== -1) {
          pages.splice(sliceSimIndex, 1);
        }
      }
    },
  },
});
