<template>
  <NuxtLayout name="404">
    <div>
      <template v-if="error.statusCode === 404">
        <h1>404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </template>
      <template v-else>
        <h1>{{ error.statusCode }}</h1>
        <p>{{ error.statusMessage || error.message }}</p>
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars, vue/require-default-prop
const props = defineProps({ error: Object });
</script>
