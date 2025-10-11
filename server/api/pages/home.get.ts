import { createClient } from "@prismicio/client";
import { repositoryName } from "../../../slicemachine.config.json";

export default defineCachedEventHandler(
  async (_event) => {
    const client = createClient(repositoryName);
    return await client.getSingle("home");
  },
  {
    maxAge: 600, // 10 minutes cache
    swr: true, // Stale-while-revalidate
    getKey: () => "page-home",
  }
);
