<script setup lang="ts">
import type { Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.SideContentImageSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="flex flex-col gap-12 items-center min-h-screen]"
    :class="{
      'lg:flex-row': slice.variation === 'content_left_image_right',
      'lg:flex-row-reverse': slice.variation === 'imageLeftContentRight',
    }"
  >
    <!-- Content -->
    <div
      class="w-full lg:w-auto lg:flex-1 text-center pt-12 px-12 pb-0 lg:py-16 lg:px-12"
    >
      <div class="flex flex-col gap-8 lg:gap-11 w-full justify-center">
        <NuxtLink
          to="/"
          class="uppercase text-xs opacity-60 hover:opacity-100 transition-opacity"
          >Back to home</NuxtLink
        >
        <div class="title">
          <PrismicRichText :field="slice.primary.title" />
        </div>
        <div class="description">
          <PrismicRichText :field="slice.primary.description" />
        </div>
      </div>
    </div>

    <!-- Image -->
    <div class="w-full lg:flex-1 min-h-[400px] lg:h-screen">
      <NuxtImg
        :src="slice.primary.image.url ?? ''"
        class="w-full h-full object-cover"
        quality="70"
        width="900"
        height="600"
        format="webp,avif"
      />
    </div>
  </section>
</template>

<style scoped>
.title :deep(h2) {
  @apply font-serif text-5xl tracking-tight;
}

.description :deep(p) {
  @apply font-sans text-base w-[398px] mx-auto;
}
</style>
