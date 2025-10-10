<script setup lang="ts">
import { components } from "~/slices";

const route = useRoute();
const { data: page } = await useFetch(`/api/pages/${route.params.uid}`, {
  key: `page-${route.params.uid}`,
});

useHead({});
</script>

<template>
  <div>
    <SliceZone
      wrapper="main"
      :slices="(page?.data?.slices as any) ?? []"
      :components="components"
    />
  </div>
</template>
