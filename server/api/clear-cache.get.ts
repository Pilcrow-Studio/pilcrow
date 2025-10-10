/**
 * Development helper to clear all caches
 * Usage: http://localhost:3000/api/clear-cache
 */
export default defineEventHandler(async (_event) => {
  if (process.env.NODE_ENV === "production") {
    throw createError({
      statusCode: 403,
      message: "Cache clearing is disabled in production",
    });
  }

  const storage = useStorage("cache");
  const keys = await storage.getKeys();

  let cleared = 0;
  for (const key of keys) {
    await storage.removeItem(key);
    cleared++;
  }

  return {
    success: true,
    message: `Cleared ${cleared} cache entries`,
    timestamp: new Date().toISOString(),
  };
});
