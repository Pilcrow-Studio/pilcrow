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

    // Use Netlify's Purge API to clear the cache
    const netlifyApiToken = process.env.NETLIFY_API_TOKEN;
    const netlifySiteId = process.env.NETLIFY_SITE_ID;

    if (netlifyApiToken && netlifySiteId) {
      console.log("Purging Netlify cache via API...");

      const response = await fetch(
        `https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys/latest/purge_cache`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${netlifyApiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to purge cache:", await response.text());
      } else {
        console.log("Cache purged successfully via Netlify API");
      }
    } else {
      console.warn(
        "NETLIFY_API_TOKEN or NETLIFY_SITE_ID not configured - skipping cache purge"
      );
    }

    setResponseStatus(event, 200);
    return {
      message: "Webhook processed - cache purge initiated",
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
