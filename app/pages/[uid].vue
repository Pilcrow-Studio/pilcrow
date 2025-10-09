<script setup lang="ts">
import { components } from "~/slices";

const prismic = usePrismic();
const route = useRoute();
const { data: page } = await useAsyncData(route.params.uid as string, () =>
  prismic.client.getByUID("page", route.params.uid as string)
);

// Set cache tag for targeted cache purging
if (import.meta.server) {
  const event = useRequestEvent();
  if (event && page.value?.id) {
    setResponseHeader(event, "Netlify-Cache-Tag", `prismic-${page.value.id}`);
  }
}

useHead({});
</script>

<template>
  <SliceZone
    wrapper="main"
    :slices="page?.data.slices ?? []"
    :components="components"
  />
</template>
