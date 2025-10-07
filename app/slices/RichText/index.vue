<script setup lang="ts">
import type { Content } from "@prismicio/client";

// The array passed to \`getSliceComponentProps\` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.RichTextSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);
</script>

<template>
  <PrismicRichText
    :field="slice.primary.content"
    class="richtext"
    wrapper="section"
  />
</template>

<style scoped>
.richtext {
  @apply max-w-[440px] mx-auto;
}
</style>
