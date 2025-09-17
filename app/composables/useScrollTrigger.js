import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Global state for ScrollTrigger management
const globalState = reactive({
  contexts: new Map(),
  resizeHandler: null,
  routeHandler: null,
  isInitialized: false,
})

export const useScrollTrigger = () => {
  const router = useRouter()

  /**
   * Initialize global ScrollTrigger management
   * This should be called once in your app
   */
  const initGlobalScrollTrigger = () => {
    if (globalState.isInitialized) return

    // Global resize handler
    globalState.resizeHandler = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', globalState.resizeHandler)

    // Global route change handler
    globalState.routeHandler = () => {
      // Clean up all contexts on route change
      cleanupAllContexts()
      
      // Refresh ScrollTrigger after a short delay to allow DOM updates
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)
    }
    router.afterEach(globalState.routeHandler)

    globalState.isInitialized = true
  }

  /**
   * Create a new ScrollTrigger context with automatic cleanup
   * @param {string} id - Unique identifier for this context
   * @param {Function} setupFunction - Function that sets up ScrollTrigger animations
   * @param {Object} options - Additional options
   * @returns {Object} Context management object
   */
  const createContext = (id, setupFunction, options = {}) => {
    // Clean up existing context with same ID
    cleanupContext(id)

    // Wait for DOM to be ready
    nextTick(() => {
      const context = gsap.context(setupFunction, options.scope || document)
      globalState.contexts.set(id, context)
    })

    return {
      id,
      cleanup: () => cleanupContext(id),
      refresh: () => ScrollTrigger.refresh()
    }
  }

  /**
   * Clean up a specific context
   * @param {string} id - Context identifier
   */
  const cleanupContext = (id) => {
    const context = globalState.contexts.get(id)
    if (context) {
      context.revert()
      globalState.contexts.delete(id)
    }
  }

  /**
   * Clean up all contexts
   */
  const cleanupAllContexts = () => {
    globalState.contexts.forEach((context) => {
      context.revert()
    })
    globalState.contexts.clear()
  }

  /**
   * Create a ScrollTrigger animation with automatic context management
   * @param {string} id - Unique identifier
   * @param {Object} config - ScrollTrigger configuration
   * @param {Function} animationFunction - Function that creates the animation
   * @param {Object} options - Additional options
   * @returns {Object} Context management object
   */
  const createScrollTrigger = (id, config, animationFunction, options = {}) => {
    return createContext(id, () => {
      // For scrub animations, create the animation directly
      if (config.scrub) {
        animationFunction()
      } else {
        // For non-scrub animations, use timeline
        const timeline = gsap.timeline({
          scrollTrigger: config
        })
        
        animationFunction(timeline)
        
        return timeline
      }
    }, options)
  }

  /**
   * Refresh all ScrollTrigger instances
   */
  const refresh = () => {
    ScrollTrigger.refresh()
  }

  /**
   * Kill all ScrollTrigger instances
   */
  const killAll = () => {
    ScrollTrigger.killAll()
    cleanupAllContexts()
  }

  /**
   * Get ScrollTrigger instance by ID
   * @param {string} id - ScrollTrigger instance ID
   * @returns {ScrollTrigger} ScrollTrigger instance
   */
  const getById = (id) => {
    return ScrollTrigger.getById(id)
  }

  /**
   * Get all ScrollTrigger instances
   * @returns {Array} Array of ScrollTrigger instances
   */
  const getAll = () => {
    return ScrollTrigger.getAll()
  }

  /**
   * Batch create multiple ScrollTrigger animations
   * @param {Array} animations - Array of animation configurations
   * @returns {Array} Array of context management objects
   */
  const batchCreate = (animations) => {
    return animations.map(({ id, config, animationFunction, options }) => 
      createScrollTrigger(id, config, animationFunction, options)
    )
  }

  /**
   * Cleanup function for component unmounting
   */
  const cleanup = () => {
    cleanupAllContexts()
  }

  /**
   * Destroy global ScrollTrigger management
   */
  const destroy = () => {
    cleanupAllContexts()
    
    if (globalState.resizeHandler) {
      window.removeEventListener('resize', globalState.resizeHandler)
      globalState.resizeHandler = null
    }
    
    if (globalState.routeHandler) {
      router.afterEach(globalState.routeHandler)
      globalState.routeHandler = null
    }
    
    globalState.isInitialized = false
  }

  return {
    // State
    contexts: readonly(ref(globalState.contexts)),
    isInitialized: readonly(ref(globalState.isInitialized)),
    
    // Core methods
    initGlobalScrollTrigger,
    createContext,
    createScrollTrigger,
    cleanupContext,
    cleanupAllContexts,
    
    // Utility methods
    refresh,
    killAll,
    getById,
    getAll,
    batchCreate,
    cleanup,
    destroy,
    
    // Direct access to ScrollTrigger for advanced usage
    ScrollTrigger
  }
}
