<script setup lang="ts">
import { Motion } from "motion-v";

const prismic = usePrismic();

const { data: page } = await useAsyncData("lab", () =>
  prismic.client.getSingle("lab")
);

// Set cache tag for targeted cache purging
if (import.meta.server) {
  const event = useRequestEvent();
  if (event && page.value?.id) {
    setResponseHeader(event, "Netlify-Cache-Tag", `prismic-${page.value.id}`);
  }
}

useHead({
  title: page.value?.data.meta_title,
  meta: [
    {
      name: "description",
      content: page.value?.data.meta_description,
    },
    {
      property: "og:title",
      content: page.value?.data.meta_title,
    },
    {
      property: "og:description",
      content: page.value?.data.meta_description,
    },
    {
      property: "og:image",
      content: page.value?.data.meta_image?.url,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: page.value?.data.meta_title,
    },
    {
      name: "twitter:description",
      content: page.value?.data.meta_description,
    },
    {
      name: "twitter:image",
      content: page.value?.data.meta_image?.url,
    },
  ],
});
</script>

<template>
  <div>
    <Container class="max-w-[640px]">
      <NuxtLink to="/">Home</NuxtLink>
      <Motion
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 1 }"
      >
        <h1 class="mt-4 text-5xl font-serif">
          <PrismicRichText :field="page?.data.title" />
        </h1>
      </Motion>

      <Motion
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 0.5, delay: 0.25 }"
      >
        <div>
          <div class="mt-8 bg-gray-800 rounded-sm p-4 h-[800px]">
            <NuxtImg
              :src="page?.data.header_image?.url ?? ''"
              :alt="page?.data.header_image?.alt ?? ''"
              fetchpriority="high"
              loading="eager"
              class="w-full h-full object-cover"
              width="576"
              height="768"
              quality="80"
              format="avif"
            />
          </div>
        </div>
      </Motion>
    </Container>
  </div>
</template>

<style scoped></style>
