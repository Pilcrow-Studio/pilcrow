export default defineEventHandler(async () => {
  return {
    message: "API is working",
    timestamp: new Date().toISOString(),
  };
});
