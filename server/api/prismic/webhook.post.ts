import * as prismic from "@prismicio/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Verify the webhook is from Prismic
  const config = useRuntimeConfig();
  const prismicWebhookSecret = config.prismicWebhookSecret;

  if (
    prismicWebhookSecret &&
    event.headers.get("prismic-webhook-secret") !== prismicWebhookSecret
  ) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    console.log("Prismic webhook received:", JSON.stringify(body, null, 2));

    const routesToRevalidate: string[] = [];

    // Parse the webhook payload to get updated documents
    if (
      body.type === "api-update" &&
      body.documents &&
      body.documents.length > 0
    ) {
      // Initialize Prismic client to fetch document details
      const prismicClient = prismic.createClient("pilcrow");

      for (const docId of body.documents) {
        try {
          // Fetch the document to get its type and UID
          const doc = await prismicClient.getByID(docId);

          const route = getRouteFromDocument({
            id: doc.id,
            type: doc.type,
            uid: doc.uid ?? undefined,
            lang: doc.lang,
          });

          if (route) {
            routesToRevalidate.push(route);
            console.log(
              `Mapped document ${doc.type}:${doc.uid || doc.id} to route: ${route}`
            );
          }
        } catch (docError) {
          console.error(`Failed to fetch document ${docId}:`, docError);
          // Continue processing other documents
        }
      }
    }

    // Clear cache and update timestamps for affected routes
    const purgedRoutes: string[] = [];

    for (const route of routesToRevalidate) {
      try {
        await purgeRouteCache(route);
        await setRegenerationTimestamp(route);
        purgedRoutes.push(route);
        console.log(`Cache cleared and timestamp updated for route: ${route}`);
      } catch (error) {
        console.error(`Failed to purge cache for route ${route}:`, error);
      }
    }

    setResponseStatus(event, 200);
    return {
      message: "Webhook processed - on-demand revalidation completed",
      timestamp: new Date().toISOString(),
      routesRevalidated: purgedRoutes,
      totalRoutes: purgedRoutes.length,
    };
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to handle webhook",
    });
  }
});
