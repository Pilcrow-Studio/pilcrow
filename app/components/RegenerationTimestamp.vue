<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const route = useRoute();
const timestamp = ref<string | null>(null);
const loading = ref(true);
const isDev = import.meta.dev;

const relativeTime = computed(() => {
  if (!timestamp.value) return "Never regenerated";

  const now = new Date();
  const regeneratedAt = new Date(timestamp.value);
  const diffMs = now.getTime() - regeneratedAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
});

onMounted(async () => {
  if (!isDev) return;

  try {
    const response = await $fetch("/api/regeneration-time", {
      query: { route: route.path },
    });

    if (response.timestamp) {
      timestamp.value = response.timestamp;
    }
  } catch (error) {
    console.error("Failed to fetch regeneration timestamp:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div
    v-if="isDev"
    class="fixed bottom-2 right-2 bg-gray-900/80 backdrop-blur-sm text-white/60 text-xs px-3 py-1.5 rounded-md border border-white/10 font-mono z-50"
  >
    <span v-if="loading">Loading...</span>
    <span v-else>
      <span class="text-white/40">Last regenerated:</span> {{ relativeTime }}
    </span>
  </div>
</template>
