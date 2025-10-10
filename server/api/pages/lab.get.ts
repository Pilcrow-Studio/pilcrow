import { createClient } from "@prismicio/client";
import { repositoryName } from "../../../slicemachine.config.json";

export default defineCachedEventHandler(
  async (_event) => {
    const client = createClient(repositoryName);
    return await client.getSingle("lab");
  },
  {
    maxAge: 3600, // 1 hour cache
    swr: true, // Stale-while-revalidate
    getKey: () => "page-lab",
  }
);
