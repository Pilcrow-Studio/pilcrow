/**
 * Cache utility functions for managing Nitro cache and regeneration timestamps
 */

interface PrismicDocument {
  id: string;
  type: string;
  uid?: string;
  lang?: string;
}

/**
 * Maps Prismic document type and UID to Nuxt route path
 */
export function getRouteFromDocument(doc: PrismicDocument): string | null {
  if (doc.type === "home") {
    return "/";
  }

  if (doc.type === "lab") {
    return "/lab";
  }

  if (doc.type === "page") {
    if (!doc.uid) return null;
    return `/${doc.uid}`;
  }

  return null;
}

/**
 * Stores the regeneration timestamp for a given route
 */
export async function setRegenerationTimestamp(route: string): Promise<void> {
  const storage = useStorage("cache");
  const key = `regenerated:${route}`;
  await storage.setItem(key, new Date().toISOString());
}

/**
 * Retrieves the regeneration timestamp for a given route
 */
export async function getRegenerationTimestamp(
  route: string
): Promise<string | null> {
  const storage = useStorage("cache");
  const key = `regenerated:${route}`;
  const value = await storage.getItem(key);
  return typeof value === "string" ? value : null;
}

/**
 * Clears the Nitro cache for a specific route
 */
export async function purgeRouteCache(route: string): Promise<void> {
  // Clear the route from Nitro's cache
  const storage = useStorage("cache");

  // Nitro caches routes with different keys, we need to clear all variants
  // The cache key pattern for routes is typically: nitro:routes:{path}:...
  const keys = await storage.getKeys("nitro:routes:");

  for (const key of keys) {
    if (key.includes(route) || key.startsWith(`nitro:routes:${route}`)) {
      await storage.removeItem(key);
    }
  }
}
