export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const route = query.route as string;

  if (!route) {
    throw createError({
      statusCode: 400,
      statusMessage: "Route parameter is required",
    });
  }

  try {
    const timestamp = await getRegenerationTimestamp(route);

    return {
      route,
      timestamp,
      regenerated: timestamp !== null,
    };
  } catch (error) {
    console.error("Error fetching regeneration timestamp:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch regeneration timestamp",
    });
  }
});
