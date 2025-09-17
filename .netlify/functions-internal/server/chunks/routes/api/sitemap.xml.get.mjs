import { d as defineEventHandler, a as setHeader, c as createError } from '../../nitro/nitro.mjs';
import { createClient } from '@prismicio/client';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'unhead';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'node:url';
import 'ipx';

var repositoryName = "gauken";

const sitemap_xml_get = defineEventHandler(async (event) => {
  const client = createClient(repositoryName);
  try {
    const [pages, exhibitions, artPieces, collections] = await Promise.all([
      client.getAllByType("page"),
      client.getAllByType("exhibitions"),
      client.getAllByType("art_piece"),
      client.getAllByType("collection")
    ]);
    const routes = [];
    routes.push(
      ...pages.map((doc) => ({
        url: doc.url || `/${doc.uid}`,
        lastmod: doc.last_publication_date,
        changefreq: "monthly",
        priority: 0.8
      }))
    );
    routes.push(
      ...exhibitions.map((doc) => ({
        url: `/exhibitions/${doc.uid}`,
        lastmod: doc.last_publication_date,
        changefreq: "monthly",
        priority: 0.7
      }))
    );
    routes.push(
      ...artPieces.map((doc) => ({
        url: `/work/${doc.uid}`,
        lastmod: doc.last_publication_date,
        changefreq: "monthly",
        priority: 0.6
      }))
    );
    routes.push(
      ...collections.map((doc) => ({
        url: doc.url || `/${doc.uid}`,
        lastmod: doc.last_publication_date,
        changefreq: "monthly",
        priority: 0.7
      }))
    );
    routes.push(
      {
        url: "/",
        lastmod: (/* @__PURE__ */ new Date()).toISOString(),
        changefreq: "weekly",
        priority: 1
      },
      {
        url: "/bio",
        lastmod: (/* @__PURE__ */ new Date()).toISOString(),
        changefreq: "monthly",
        priority: 0.8
      }
    );
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes.map(
      (route) => `  <url>
    <loc>https://gauken.art${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    </url>`
    ).join("\n")}
    </urlset>`;
    setHeader(event, "Content-Type", "application/xml");
    return sitemap;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate sitemap"
    });
  }
});

export { sitemap_xml_get as default };
//# sourceMappingURL=sitemap.xml.get.mjs.map
