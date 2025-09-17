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
    // Extract the document ID from the webhook payload
    const documentId = body.documents?.[0] || body.document?.id;

    if (!documentId) {
      console.log("No document ID found in webhook payload");
      setResponseStatus(event, 200);
      return { message: "No document ID found" };
    }

    // Determine the cache tag based on document type
    const cacheTag = `document-${documentId}`;

    // You can also add specific tags based on document type if needed
    // if (body.type === "art_piece") {
    //   cacheTag = `art-piece-${documentId}`;
    // } else if (body.type === "exhibitions") {
    //   cacheTag = `exhibition-${documentId}`;
    // }

    console.log(
      `Purging cache for document: ${documentId} with tag: ${cacheTag}`
    );

    // Purge the cache for this specific document
    await purgeCache({ tags: [cacheTag] });

    // Also purge the homepage cache since it might list this content
    await purgeCache({ tags: ["homepage"] });

    setResponseStatus(event, 200);
    return {
      message: "Cache purged successfully",
      documentId,
      cacheTag,
    };
  } catch (error) {
    console.error("Error purging cache:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to purge cache",
    });
  }
});
