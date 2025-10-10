import { createClient } from "@prismicio/client";
import { repositoryName } from "../../../slicemachine.config.json";

export default defineCachedEventHandler(
  async (event) => {
    const uid = getRouterParam(event, "uid");
    if (!uid) {
      throw createError({ statusCode: 400, message: "UID parameter required" });
    }
    const client = createClient(repositoryName);
    return await client.getByUID("page", uid);
  },
  {
    maxAge: 3600, // 1 hour cache
    swr: true, // Stale-while-revalidate
    getKey: (event) => `page-${getRouterParam(event, "uid")}`,
  }
);
