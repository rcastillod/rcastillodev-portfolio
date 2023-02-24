import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

// Lenis smooth scrolling
let lenis;
// Initialize Lenis smooth scrolling
const initSmoothScrolling = () => {
  lenis = new Lenis({
    lerp: 0.1,
    smooth: true,
  });
  const scrollFn = (time) => {
    lenis.raf(time);
    requestAnimationFrame(scrollFn);
  };
  requestAnimationFrame(scrollFn);
};

// DOM elements query
const DOM = {
  // Cover image elements
  cover: {
    wrap: document.querySelector('.cover-wrap'),
    outer: document.querySelector('.cover'),
    inner: document.querySelector('.cover__inner'),
  },
  // Hero content elements
  content: {
    titles: document.querySelector('.content__caption-title'),
    backgroundTitles: document.querySelector('.content__caption-background-title')
  },
  // Menu element
  menu: document.querySelector('.menu'),
  // Element that slides out
  menuContent: document.querySelector('.menu__content'),
  // Close button
  toggleBtn: document.querySelector('.menu__toggle-btn'),
};

// Variables to set menu status
let menuStatus = {
  isOpen: false,
  isAnimating: false
};

// Animation gsap timeline hero section
const menuTimeline = gsap.timeline({
  paused: true,
  onComplete: () => menuStatus.isAnimating = false,
  onReverseComplete: () => menuStatus.isAnimating = false,
  defaults: {
    duration: 1.2,
    ease: 'power4.inOut'
  }
})
  .addLabel('start', 0)
  .add(() => {
    // Add pointer events to auto/none
    DOM.menu.classList[menuStatus.isOpen ? 'add' : 'remove']('menu--open');
  }, 'start')
  .to(DOM.cover.wrap, {
    duration: 1.6,
    startAt: { scale: '1.1' },
    ease: 'power3.inOut',
    scale: 1
  }, 'start')
  .to(DOM.cover.outer, {
    startAt: { y: '-100%' },
    y: '0%'
  }, 'start')
  .to(DOM.cover.inner, {
    startAt: { y: '100%' },
    y: '0%'
  }, 'start')
  .to(DOM.content.imgs, {
    //ease: 'power3.inOut',
    y: position => `${position % 2 === 0 ? -20 : 20}%`,
  }, 'start')
  .to(DOM.content.titles, {
    //ease: 'power3.inOut',
    y: position => `${position % 2 === 0 ? 20 : -20}%`,
  }, 'start')
  .addLabel('menu', 0.5)
  .to(DOM.menuContent, {
    duration: 1,
    startAt: { y: '-100%' },
    y: '0%',
  }, 'menu')
  .addLabel('extra', 'menu+=0.6')
  .set(DOM.extra, {
    y: '400%',
    opacity: 0
  }, 'start');


// Menu expand
const expandMenu = () => {
  if (menuStatus.isAnimating || menuStatus.isOpen) return;
  menuStatus.isAnimating = true;
  menuStatus.isOpen = true;
  menuTimeline.play();
};

// Menu collapse
const collapseMenu = () => {
  if (menuStatus.isAnimating || !menuStatus.isOpen) return;
  menuStatus.isAnimating = true;
  menuStatus.isOpen = false;
  menuTimeline.reverse(0);
}


DOM.toggleBtn.addEventListener('click', ev => {
  ev.preventDefault()
  if (!menuStatus.isOpen) {
    expandMenu()
  }
  collapseMenu()
})


// ScrollTrigger animations for scrolling
const animateOnScroll = () => {
  // animate the content background title element as we scroll (horizontally)
  let windowWidth = window.innerWidth;
  gsap.to(DOM.content.backgroundTitles, {
    scrollTrigger: {
      start: 0,
      end: 'max',
      scrub: true
    },
    ease: 'none',
    x: () => -DOM.content.backgroundTitles.offsetWidth - (13.25 * windowWidth / 100 + 25 * windowWidth / 100 + windowWidth / 100) + windowWidth
  });
}

initSmoothScrolling();
animateOnScroll();