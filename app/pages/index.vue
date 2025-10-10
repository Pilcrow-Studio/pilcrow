<script setup lang="ts">
import { components } from "~/slices";
import { Motion } from "motion-v";

const prismic = usePrismic();

const { data: page } = await useAsyncData("homepage", () =>
  prismic.client.getSingle("home")
);

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
  <div class="md:h-screen grid grid-cols-1 grid-rows-3 lg:grid-cols-12">
    <Container class="row-start-1 lg:col-start-4 lg:col-span-6">
      <motion
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
      >
        <NuxtImg
          ref="logoImage"
          to="/"
          :src="page?.data.logo?.url ?? ''"
          class="mb-24 mx-auto w-[100px] object-contain"
          :alt="page?.data.logo?.alt ?? ''"
          fetchpriority="high"
          loading="eager"
          format="webp,avif"
          quality="70"
          width="120"
          height="80"
        />
      </motion>

      <motion
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.25 }"
      >
        <div class="mx-auto">
          <SliceZone
            :slices="page?.data.slices ?? []"
            :components="components"
          />
        </div>
      </motion>
      <motion
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.5 }"
      >
        <NewsletterForm />
      </motion>
    </Container>

    <Container>
      <div
        class="fixed bg-[#0F1112] bg-opacity-10 backdrop-blur-sm bottom-0 left-0 right-0 px-4 py-2 flex justify-between"
      >
        <p class="text-sm text-white/60 font-serif">© 2025 Pilcrow</p>
        <NuxtLink
          to="mailto:jonas@pilcrow.no"
          class="text-sm text-white/60 font-serif hover:text-white transition-all"
          >jonas@pilcrow.no</NuxtLink
        >
      </div>
    </Container>

    <RegenerationTimestamp />
  </div>
</template>
