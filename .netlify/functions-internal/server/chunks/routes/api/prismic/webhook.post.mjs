import { d as defineEventHandler, r as readBody, u as useRuntimeConfig, c as createError, s as setResponseStatus } from '../../../nitro/nitro.mjs';
import { purgeCache } from '@netlify/functions';
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

const webhook_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const prismicWebhookSecret = config.prismicWebhookSecret;
  if (prismicWebhookSecret && event.headers.get("prismic-webhook-secret") !== prismicWebhookSecret) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  try {
    const documentId = ((_a = body.documents) == null ? void 0 : _a[0]) || ((_b = body.document) == null ? void 0 : _b.id);
    if (!documentId) {
      console.log("No document ID found in webhook payload");
      setResponseStatus(event, 200);
      return { message: "No document ID found" };
    }
    const cacheTag = `document-${documentId}`;
    console.log(
      `Purging cache for document: ${documentId} with tag: ${cacheTag}`
    );
    await purgeCache({ tags: [cacheTag] });
    await purgeCache({ tags: ["homepage"] });
    setResponseStatus(event, 200);
    return {
      message: "Cache purged successfully",
      documentId,
      cacheTag
    };
  } catch (error) {
    console.error("Error purging cache:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to purge cache"
    });
  }
});

export { webhook_post as default };
//# sourceMappingURL=webhook.post.mjs.map
