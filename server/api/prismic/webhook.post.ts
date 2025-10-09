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

    // Extract document IDs from the webhook payload
    const documentIds: string[] = [];

    // Prismic webhooks can have different structures depending on the event
    // Most commonly, documents are in body.documents array
    if (body.documents && Array.isArray(body.documents)) {
      body.documents.forEach((doc: { id?: string }) => {
        if (doc.id) {
          documentIds.push(doc.id);
        }
      });
    }

    // Some webhooks have a single document
    if (body.document?.id) {
      documentIds.push(body.document.id);
    }

    console.log("Document IDs to purge:", documentIds);

    // Use Netlify's Cache Tag Purge API
    const netlifyApiToken = process.env.NETLIFY_API_TOKEN;
    const netlifySiteId = process.env.NETLIFY_SITE_ID;

    if (netlifyApiToken && netlifySiteId && documentIds.length > 0) {
      console.log("Purging Netlify cache by tags...");

      // Create cache tags from document IDs
      const cacheTags = documentIds.map((id) => `prismic-${id}`);
      console.log("Cache tags to purge:", cacheTags);

      const response = await fetch(
        `https://api.netlify.com/api/v1/purge?cache_tags=${cacheTags.join(",")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${netlifyApiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            site_id: netlifySiteId,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to purge cache:", response.status, errorText);
      } else {
        const responseText = await response.text();
        console.log(
          `Cache purged successfully for tags: ${cacheTags.join(", ")}`
        );
        if (responseText) {
          console.log("Response:", responseText);
        }
      }
    } else {
      if (!netlifyApiToken || !netlifySiteId) {
        console.warn(
          "NETLIFY_API_TOKEN or NETLIFY_SITE_ID not configured - skipping cache purge"
        );
      } else if (documentIds.length === 0) {
        console.warn("No document IDs found in webhook - skipping cache purge");
      }
    }

    setResponseStatus(event, 200);
    return {
      message: "Webhook processed - targeted cache purge initiated",
      documentIds,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to handle webhook",
    });
  }
});
