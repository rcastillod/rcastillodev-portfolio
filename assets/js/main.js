import { preloadImages, isInViewport } from './extras';
import { Menu } from './menu';
import { Project } from './projects';
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

// initialize the menu
new Menu(document.querySelector('.social__menu'));

// Project instances (Project is the .content > figure.project)
const projects = [];
[...document.querySelectorAll('.project')].forEach(project => {
  projects.push(new Project(project));
});

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
  // Element that slides out - About
  menuContent: {
    main: document.querySelector('.menu__content'),
    titleTop: document.querySelector('.menu__content-title--up'),
    titleBottom: document.querySelector('.menu__content-title--down'),
    about: document.querySelector('.menu__content-about'),
    aboutText: document.querySelector('.menu__content-about-text'),
    bottomImages: document.querySelectorAll('.menu__content-image--1 > .menu__content-image-inner, .menu__content-image--2 > .menu__content-image-inner, .menu__content-image--3 > .menu__content-image-inner')
  },
  // Toggle button
  toggleBtn: document.querySelector('.menu__toggle-btn'),
  // Projects
  projects: document.querySelector('.projects')
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
  .to(DOM.content.titles, {
    y: position => `${position % 2 === 0 ? 20 : -20}%`,
  }, 'start')
  .to(DOM.content.backgroundTitles, {
    y: position => `${position % 2 === 0 ? 20 : -20}%`,
  }, 'start')
  .to(DOM.projects, {
    y: position => `${position % 2 === 0 ? 20 : -20}%`,
  }, 'start')
  .addLabel('menu', 0.5)
  .to(DOM.menuContent.main, {
    duration: 1,
    startAt: { y: '-100%' },
    y: '0%',
  }, 'menu')
  .addLabel('extra', 'menu+=0.5')
  .to(DOM.menuContent.titleBottom, {
    duration: 0.9,
    startAt: { y: '-50%', opacity: 0 },
    opacity: 1,
    y: '0%'
  }, 'extra')
  .to(DOM.menuContent.titleTop, {
    duration: 1,
    startAt: { y: '-50%', opacity: 0 },
    opacity: 1,
    y: '0%'
  }, 'extra')
  .to(DOM.menuContent.about, {
    startAt: { yPercent: 10 },
    yPercent: 0,
    opacity: 1
  }, 'extra+=0.5')
  .addLabel('images', 'extra+=0.6')
  .set(DOM.menuContent.bottomImages, {
    y: '400%',
    opacity: 0
  }, 'images')
  .to(DOM.menuContent.bottomImages, {
    duration: 0.8,
    ease: 'power4',
    startAt: { opacity: 1 },
    opacity: 1,
    y: '0%',
    stagger: 0.1
  }, 'images');


// Menu expand
const expandMenu = () => {
  if (menuStatus.isAnimating || menuStatus.isOpen) return;
  // Add overflow hidden to body when menu is expanded
  document.body.style.overflow = 'hidden'
  menuStatus.isAnimating = true;
  menuStatus.isOpen = true;
  menuTimeline.play();
};

// Menu collapse
const collapseMenu = () => {
  if (menuStatus.isAnimating || !menuStatus.isOpen) return;
  // Remove overflow hidden from body when menu is collapse
  document.body.style.overflow = 'visible'
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

  for (const project of projects) {

    gsap.set(project.DOM.imageInner, { transformOrigin: '50% 0%' });

    gsap.timeline({
      scrollTrigger: {
        trigger: project.DOM.el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
      .addLabel('start', 0)
      // scale up the inner image
      .to(project.DOM.imageInner, {
        ease: 'none',
        scaleY: 2.4,
        scaleX: 1.2,
        opacity: 0
      }, 'start')
      // translate the title and number
      .to([project.DOM.title, project.DOM.number], {
        ease: 'none',
        yPercent: -150,
      }, 'start')
      // translate the inner title/number (overflow is hidden so they get hidden)
      .to(project.DOM.titleInner, {
        scrollTrigger: {
          trigger: project.DOM.el,
          start: 'top bottom',
          end: 'top 20%',
          scrub: true,
        },
        ease: 'expo.in',
        yPercent: -100
      }, 'start')

  }

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

// Preload images
preloadImages('.project__image-inner').then(() => {
  document.body.classList.remove('loading');

  initSmoothScrolling();
  animateOnScroll();
});