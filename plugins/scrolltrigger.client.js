import { useScrollTrigger } from '~/composables/useScrollTrigger'

export default defineNuxtPlugin(() => {
  const { initGlobalScrollTrigger } = useScrollTrigger()
  
  // Initialize global ScrollTrigger management
  initGlobalScrollTrigger()
})
