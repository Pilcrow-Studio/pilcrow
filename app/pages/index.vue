<script setup lang="ts">
import { components } from "~/slices";
import type { ServerResponse } from "http";

const prismic = usePrismic();

const { data: page } = await useAsyncData("index", () =>
  prismic.client.getSingle("home")
);

const { ssrContext } = useNuxtApp();

if (ssrContext && ssrContext.res) {
  const res = ssrContext.res as ServerResponse;
  // Tag with front page ID
  if (page.value?.id) {
    res.setHeader("Netlify-Cache-Tag", `front-page-${page.value.id}`);
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
  <div class="h-screen grid grid-cols-12 grid-rows-4">
    <Container class="row-start-2 col-start-4 col-span-6">
      <SliceZone
        wrapper="main"
        class="max-w-prose"
        :slices="page?.data.slices ?? []"
        :components="components"
      />
    </Container>
    <Container class="row-start-4 col-span-12 flex justify-center">
      <NuxtImg
        :src="page?.data.logo?.url ?? ''"
        class="w-full max-w-[900px] object-contain"
      />
    </Container>
  </div>
</template>
