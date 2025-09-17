# Global ScrollTrigger Management System

This project now includes a centralized ScrollTrigger management system that handles context cleanup, resize events, and route changes automatically across all components and slices.

## Features

- **Automatic Context Management**: All ScrollTrigger contexts are automatically tracked and cleaned up
- **Global Resize Handling**: Single resize listener that refreshes all ScrollTrigger instances
- **Route Change Integration**: Automatic cleanup and refresh on route changes
- **Memory Leak Prevention**: Proper cleanup prevents memory leaks
- **TypeScript Support**: Full TypeScript support with proper type definitions
- **Batch Operations**: Create multiple animations efficiently

## Setup

The system is automatically initialized via the `plugins/scrolltrigger.client.js` plugin. No additional setup is required.

## Usage

### Basic Usage

```vue
<script setup>
const { createScrollTrigger } = useScrollTrigger()

let context = null

const initAnimation = () => {
  const element = document.querySelector('.my-element')
  
  if (element) {
    context = createScrollTrigger(
      'my-animation', // Unique ID
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
</script>
```

### Multiple Animations

```vue
<script setup>
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
        scrub: false,
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
</script>
```

### Batch Creation

```vue
<script setup>
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
</script>
```

### Custom Context Scope

```vue
<script setup>
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
</script>
```

## API Reference

### `useScrollTrigger()`

Returns an object with the following methods:

#### `createScrollTrigger(id, config, animationFunction, options)`
Creates a new ScrollTrigger animation with automatic context management.

- `id` (string): Unique identifier for the animation
- `config` (object): ScrollTrigger configuration object
- `animationFunction` (function): Function that receives a GSAP timeline
- `options` (object, optional): Additional options including `scope`

#### `createContext(id, setupFunction, options)`
Creates a custom GSAP context with ScrollTrigger management.

- `id` (string): Unique identifier for the context
- `setupFunction` (function): Function that sets up animations
- `options` (object, optional): Additional options including `scope`

#### `batchCreate(animations)`
Creates multiple ScrollTrigger animations efficiently.

- `animations` (array): Array of animation configuration objects

#### `cleanupContext(id)`
Cleans up a specific context by ID.

#### `cleanupAllContexts()`
Cleans up all tracked contexts.

#### `refresh()`
Refreshes all ScrollTrigger instances.

#### `killAll()`
Kills all ScrollTrigger instances and cleans up contexts.

#### `getById(id)`
Gets a ScrollTrigger instance by ID.

#### `getAll()`
Gets all ScrollTrigger instances.

## Migration from Manual ScrollTrigger

### Before (Manual Management)
```vue
<script setup>
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

let ctx = null
let handleResize = null

const initScrollTrigger = () => {
  if (ctx) {
    ctx.revert()
  }
  
  nextTick(() => {
    const element = document.querySelector('.my-element')
    
    if (element) {
      ctx = gsap.context(() => {
        gsap.from(element, {
          opacity: 0,
          y: 50,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          }
        })
      })
    }
  })
}

onMounted(() => {
  initScrollTrigger()
  
  const router = useRouter()
  router.afterEach(() => {
    setTimeout(() => {
      initScrollTrigger()
    }, 100)
  })

  handleResize = () => {
    ScrollTrigger.refresh()
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (ctx) {
    ctx.cleanup()
  }
  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }
})
</script>
```

### After (Global Management)
```vue
<script setup>
const { createScrollTrigger } = useScrollTrigger()

let context = null

const initAnimation = () => {
  const element = document.querySelector('.my-element')
  
  if (element) {
    context = createScrollTrigger(
      'my-animation',
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
</script>
```

## Benefits

1. **Reduced Code Duplication**: No need to repeat resize handlers and route change logic
2. **Automatic Cleanup**: Prevents memory leaks and conflicts
3. **Centralized Management**: All ScrollTrigger instances are tracked globally
4. **Better Performance**: Single resize listener instead of multiple
5. **Easier Debugging**: Centralized state makes debugging easier
6. **TypeScript Support**: Full type safety and IntelliSense support

## Best Practices

1. **Always use unique IDs**: Each animation should have a unique identifier
2. **Clean up on unmount**: Always call `context.cleanup()` in `onUnmounted`
3. **Use batch creation**: For multiple similar animations, use `batchCreate`
4. **Scope appropriately**: Use custom scopes for complex animations
5. **Test route changes**: Ensure animations work correctly after navigation

## Troubleshooting

### Animation not working after route change
- The system automatically handles route changes, but ensure your elements exist in the DOM
- Use `nextTick()` if needed to wait for DOM updates

### Memory leaks
- Always call `context.cleanup()` in `onUnmounted`
- The global system helps prevent leaks, but proper cleanup is still important

### Performance issues
- Use `scrub: false` for better performance when possible
- Consider using `batchCreate` for multiple similar animations
- Avoid creating too many ScrollTrigger instances simultaneously
