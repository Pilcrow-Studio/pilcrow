import { purgeCache } from "@netlify/functions";

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

    // Purge all ISR caches to force fresh content
    // This invalidates the entire ISR cache, causing pages to regenerate on next request
    await purgeCache();

    console.log("Cache purged successfully");

    setResponseStatus(event, 200);
    return {
      message:
        "Cache purged successfully - content will update on next request",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error purging cache:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to purge cache",
    });
  }
});
