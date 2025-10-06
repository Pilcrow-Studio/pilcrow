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
  <div class="h-screen grid grid-cols-1 grid-rows-5 lg:grid-cols-12">
    <Container class="row-start-2 lg:col-start-4 lg:col-span-6">
      <Motion
        :initial="{ y: 10, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.5 }"
      >
        <NuxtImg
          ref="logoImage"
          :src="page?.data.logo?.url ?? ''"
          class="mb-24 w-full mx-auto max-w-[200px] object-contain"
          :alt="page?.data.logo?.alt ?? ''"
          fetchpriority="high"
          loading="eager"
          format="webp,avif"
          quality="70"
          width="200"
          height="200"
        />
      </Motion>
      <Motion
        :initial="{ y: 10, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.5, delay: 0.5 }"
      >
        <SliceZone
          ref="mainContent"
          wrapper="main"
          class="mx-auto"
          :slices="page?.data.slices ?? []"
          :components="components"
        />

        <form
          class="mt-24 p-4 lg:p-8 bg-white/10 rounded-sm"
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
            class="bg-white/20 text-white text-sm px-6 py-2 rounded-sm hover:bg-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isLoading">2 sek...</span>
            <span v-else>Abonner</span>
          </button>
        </form>
      </Motion>
    </Container>
  </div>
</template>
