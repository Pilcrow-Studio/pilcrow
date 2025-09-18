<script setup lang="ts">
import { components } from "~/slices";

const prismic = usePrismic();

const { data: page } = await useAsyncData("index", () =>
  prismic.client.getByUID("page", "home")
);

const { ssrContext } = useNuxtApp();

if (ssrContext && ssrContext.res) {
  // Tag with front page ID
  if (page.value?.id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ssrContext.res as any).setHeader(
      "Netlify-Cache-Tag",
      `front-page-${page.value.id}`
    );
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
    <Container>
      <h1 class="text-4xl font-bold mb-2" :field="page?.data.title">
        {{ prismic.asText(page?.data.title) }}
      </h1>
      <SliceZone
        wrapper="main"
        :slices="page?.data.slices ?? []"
        :components="components"
      />
    </Container>
  </div>
</template>
