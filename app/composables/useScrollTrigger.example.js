/**
 * Example usage of the global useScrollTrigger composable
 * This file demonstrates various ways to use ScrollTrigger with the global management system
 */

import { gsap } from 'gsap'
import { useScrollTrigger } from './useScrollTrigger'

// Example 1: Simple ScrollTrigger animation
export const exampleSimpleAnimation = () => {
  const { createScrollTrigger } = useScrollTrigger()
  
  let context = null
  
  const initAnimation = () => {
    const element = document.querySelector('.my-element')
    
    if (element) {
      context = createScrollTrigger(
        'simple-animation', // Unique ID
        {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
        (timeline) => {
          timeline.from(element, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out"
          })
        }
      )
    }
  }
  
  onMounted(() => {
    initAnimation()
  })
  
  onUnmounted(() => {
    if (context) {
      context.cleanup()
    }
  })
}

// Example 2: Multiple animations in one component
export const exampleMultipleAnimations = () => {
  const { createScrollTrigger } = useScrollTrigger()
  
  let contexts = []
  
  const initAnimations = () => {
    const elements = document.querySelectorAll('.animate-on-scroll')
    
    elements.forEach((element, index) => {
      const context = createScrollTrigger(
        `animation-${index}`,
        {
          trigger: element,
          start: "top 90%",
          end: "bottom 10%",
          scrub: false, // No scrub for this animation
        },
        (timeline) => {
          timeline.from(element, {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: "back.out(1.7)"
          })
        }
      )
      
      contexts.push(context)
    })
  }
  
  onMounted(() => {
    initAnimations()
  })
  
  onUnmounted(() => {
    contexts.forEach(context => context.cleanup())
  })
}

// Example 3: Complex timeline with multiple elements
export const exampleComplexTimeline = () => {
  const { createScrollTrigger } = useScrollTrigger()
  
  let context = null
  
  const initComplexAnimation = () => {
    const container = document.querySelector('.complex-container')
    const title = document.querySelector('.complex-title')
    const subtitle = document.querySelector('.complex-subtitle')
    const image = document.querySelector('.complex-image')
    
    if (container && title && subtitle && image) {
      context = createScrollTrigger(
        'complex-timeline',
        {
          trigger: container,
          start: "top 70%",
          end: "bottom 30%",
          scrub: true,
        },
        (timeline) => {
          // Staggered animation sequence
          timeline
            .from(title, {
              opacity: 0,
              y: 30,
              duration: 0.6,
              ease: "power2.out"
            })
            .from(subtitle, {
              opacity: 0,
              y: 20,
              duration: 0.5,
              ease: "power2.out"
            }, "-=0.3")
            .from(image, {
              opacity: 0,
              scale: 1.1,
              duration: 0.8,
              ease: "power2.out"
            }, "-=0.2")
        }
      )
    }
  }
  
  onMounted(() => {
    initComplexAnimation()
  })
  
  onUnmounted(() => {
    if (context) {
      context.cleanup()
    }
  })
}

// Example 4: Using batch creation for multiple similar animations
export const exampleBatchCreation = () => {
  const { batchCreate } = useScrollTrigger()
  
  let contexts = []
  
  const initBatchAnimations = () => {
    const cards = document.querySelectorAll('.card')
    
    const animations = Array.from(cards).map((card, index) => ({
      id: `card-animation-${index}`,
      config: {
        trigger: card,
        start: "top 85%",
        end: "bottom 15%",
        scrub: false,
      },
      animationFunction: (timeline) => {
        timeline.from(card, {
          opacity: 0,
          y: 40,
          rotation: 5,
          duration: 0.7,
          ease: "power2.out"
        })
      }
    }))
    
    contexts = batchCreate(animations)
  }
  
  onMounted(() => {
    initBatchAnimations()
  })
  
  onUnmounted(() => {
    contexts.forEach(context => context.cleanup())
  })
}

// Example 5: Advanced usage with custom context scope
export const exampleCustomScope = () => {
  const { createContext } = useScrollTrigger()
  
  let context = null
  
  const initCustomScope = () => {
    const section = document.querySelector('.custom-section')
    
    if (section) {
      context = createContext(
        'custom-scope',
        () => {
          // Create multiple animations within this context
          const title = section.querySelector('.title')
          const content = section.querySelector('.content')
          const image = section.querySelector('.image')
          
          // Animation 1: Title
          gsap.from(title, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: title,
              start: "top 80%",
              end: "bottom 20%",
              scrub: false
            }
          })
          
          // Animation 2: Content
          gsap.from(content, {
            opacity: 0,
            x: -50,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: content,
              start: "top 85%",
              end: "bottom 15%",
              scrub: false
            }
          })
          
          // Animation 3: Image
          gsap.from(image, {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: image,
              start: "top 75%",
              end: "bottom 25%",
              scrub: false
            }
          })
        },
        { scope: section } // Limit scope to this section
      )
    }
  }
  
  onMounted(() => {
    initCustomScope()
  })
  
  onUnmounted(() => {
    if (context) {
      context.cleanup()
    }
  })
}

// Example 6: Using ScrollTrigger utilities
export const exampleScrollTriggerUtilities = () => {
  const { refresh, getAll, getById } = useScrollTrigger()
  
  const debugScrollTriggers = () => {
    console.log('All ScrollTrigger instances:', getAll())
    console.log('Specific instance:', getById('my-animation'))
  }
  
  const refreshAnimations = () => {
    refresh() // Refresh all ScrollTrigger instances
  }
  
  return {
    debugScrollTriggers,
    refreshAnimations
  }
}
