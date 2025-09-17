import { createClient } from "@prismicio/client";
import { repositoryName } from "../../slicemachine.config.json";

export default defineEventHandler(async (event) => {
  const client = createClient(repositoryName);

  try {
    // Get all content types
    const [pages, exhibitions, artPieces, collections] = await Promise.all([
      client.getAllByType("page"),
      client.getAllByType("exhibitions"),
      client.getAllByType("art_piece"),
      client.getAllByType("collection"),
    ]);

    const routes = [];

    // Add dynamic routes from Prismic
    routes.push(
      ...pages.map((doc) => ({
        url: doc.url || `/${doc.uid}`,
        lastmod: doc.last_publication_date,
        changefreq: "monthly",
        priority: 0.8,
      }))
    );

    routes.push(
      ...exhibitions.map((doc) => ({
        url: `/exhibitions/${doc.uid}`,
        lastmod: doc.last_publication_date,
        changefreq: "monthly",
        priority: 0.7,
      }))
    );

    routes.push(
      ...artPieces.map((doc) => ({
        url: `/work/${doc.uid}`,
        lastmod: doc.last_publication_date,
        changefreq: "monthly",
        priority: 0.6,
      }))
    );

    routes.push(
      ...collections.map((doc) => ({
        url: doc.url || `/${doc.uid}`,
        lastmod: doc.last_publication_date,
        changefreq: "monthly",
        priority: 0.7,
      }))
    );

    // Add static routes
    routes.push(
      {
        url: "/",
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 1.0,
      },
      {
        url: "/bio",
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.8,
      }
    );

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes
      .map(
        (route) => `  <url>
    <loc>https://gauken.art${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    </url>`
      )
      .join("\n")}
    </urlset>`;

    setHeader(event, "Content-Type", "application/xml");
    return sitemap;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate sitemap",
    });
  }
});
