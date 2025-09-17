import gsap from 'gsap';

import { useTransitionComposable } from '../composables/transition-composable';

const { toggleTransitionComplete } = useTransitionComposable();

// Helper function to get scroll position from OverlayScrollbars or fallback to window
const getScrollPosition = () => {
  // Try to find OverlayScrollbars container
  const overlayScrollbarsHost = document.querySelector('[data-overlayscrollbars="host"]');
  if (overlayScrollbarsHost) {
    const viewport = overlayScrollbarsHost.querySelector('[data-overlayscrollbars-viewport]');
    if (viewport) {
      return viewport.scrollTop;
    }
  }
  // Fallback to window scroll position
  return window.scrollY;
};

const pageTransition = {
  name: 'page-transition',
  mode: 'out-in',
  onEnter: (el, done) => {
    gsap.set(el, {
      autoAlpha: 0,
      position: 'fixed',
      zIndex: 2,
      top: 0,
      left: 0,
      right: 0,
    });

    gsap.timeline({
      paused: true,
      onComplete: () => {
        gsap.set(el, { position: 'absolute' });
        toggleTransitionComplete(true);
        done();
      }
    })
    .to(el, { autoAlpha: 1, duration: 0.3, ease: "power1.out" })
    .play();
  },

  onLeave: (el, done) => {
    toggleTransitionComplete(false);

    const scrollY = getScrollPosition();

    gsap.set(el, { position: 'fixed', top: -scrollY, zIndex: 1, right: 0, left: 0}); 

    gsap.timeline({
      paused: true,
      onComplete: () => {
        done();
      }
    })

    .to(el, {
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power1.out',
      onUpdate: () => {
        gsap.set(el, { top: -scrollY });
      }
    })
    .play();
  },
};

export default pageTransition;