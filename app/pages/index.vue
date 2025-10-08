<script setup lang="ts">
import { components } from "~/slices";
import type { ServerResponse } from "http";

const prismic = usePrismic();

const { data: page } = await useAsyncData("homepage", async () => {
  console.log(
    "[Homepage] Fetching fresh data from Prismic at",
    new Date().toISOString()
  );
  const result = await prismic.client.getSingle("home");
  console.log(
    "[Homepage] Data fetched, last_publication_date:",
    result.last_publication_date
  );
  return result;
});

const { ssrContext } = useNuxtApp();

if (ssrContext && ssrContext.res) {
  const res = ssrContext.res as ServerResponse;

  // Set cache control to allow CDN caching but make it short-lived
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=60, must-revalidate"
  );

  // Tag with front page ID for cache purging
  if (page.value?.id) {
    res.setHeader("Netlify-Cache-Tag", `front-page-${page.value.id}`);
  }
}

// Form handling
const email = ref("");
const isLoading = ref(false);
const message = ref("");
const messageType = ref<"success" | "error" | "">("");

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  if (!email.value) {
    showMessage("Please enter your email address", "error");
    return;
  }

  isLoading.value = true;
  message.value = "";

  try {
    const response = await $fetch("/api/send", {
      method: "POST",
      body: { email: email.value },
    });

    if (response.success) {
      showMessage(
        "Tusen takk for at du abonnerer! Vi vil holde deg oppdatert når det skjer noe kult.",
        "success"
      );
      email.value = ""; // Clear the form
    }
  } catch (error: unknown) {
    console.error("Signup error:", error);
    const errorMessage =
      error &&
      typeof error === "object" &&
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data
        ? (error.data as { message: string }).message
        : "Noe gikk galt. Prøv igjen.";
    showMessage(errorMessage, "error");
  } finally {
    isLoading.value = false;
  }
};

const showMessage = (text: string, type: "success" | "error") => {
  message.value = text;
  messageType.value = type;

  // Clear message after 5 seconds
  setTimeout(() => {
    message.value = "";
    messageType.value = "";
  }, 5000);
};

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
  <div class="md:h-screengrid grid-cols-1 grid-rows-3 lg:grid-cols-12">
    <Container class="row-start-1 lg:col-start-4 lg:col-span-6">
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

      <div class="mx-auto">
        <SliceZone :slices="page?.data.slices ?? []" :components="components" />
      </div>

      <form
        name="newsletter"
        class="mt-8 p-4 lg:p-8 bg-white/[0.03] rounded-sm max-w-[640px] mx-auto"
        @submit="handleSubmit"
      >
        <p class="text-white mb-4">Hold deg i loopen</p>

        <!-- Success/Error Message -->
        <div
          v-if="message"
          :class="[
            'mb-4 p-3 rounded-sm text-sm',
            messageType === 'success'
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30',
          ]"
        >
          {{ message }}
        </div>

        <div class="mb-4">
          <label
            for="email"
            class="block text-sm/[130%] font-medium text-white mb-2"
          >
            E-post
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            required
            :disabled="isLoading"
            class="transition-all text-sm/[130%] block w-full bg-white/20 hover:border-white/40 text-white placeholder-white/70 px-3 py-2 rounded-sm border border-white/20 focus:border-white/40 focus:bg-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 disabled:opacity-50"
            placeholder="Din e-post"
          />
        </div>
        <div class="mb-4">
          <input
            id="consent"
            type="checkbox"
            name="consent"
            class="mr-2 text-white bg-white/20 border-white/30 rounded focus:ring-white/20 focus:ring-2"
            required
          />
          <label for="consent" class="text-sm/[130%] text-white/60"
            >Jeg godtar at Pilcrow kan bruke min e-postadresse til å sende meg
            nyhetsbrev.</label
          >
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full md:w-auto bg-white/80 text-black text-sm px-6 py-2 rounded-sm hover:bg-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isLoading">2 sek...</span>
          <span v-else>Abonner</span>
        </button>
      </form>
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
  </div>
</template>
