// Preloader
import startPreLoader from './assets/js/preloader';
import { preloadImages, isInViewport } from '/assets/js/extras';
import { Menu } from '/assets/js/menu';
import getProjects from '/assets/js/getProjects'
import { Project } from '/assets/js/projects';
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Logo
import logoDarkUrl from './logorcDevDark.svg'
import logoLightUrl from './logorcDevLight.svg'
document.getElementById('logo').src = logoDarkUrl

// Call Preloader
startPreLoader()
gsap.to('.counter', 0.25, {
	delay: 3.5,
	opacity: 0
})

/* -------------------------------------------------------------------------- */
/*                                Custom cursor                               */
/* -------------------------------------------------------------------------- */
let cursor = document.querySelector('.cursor'),
	cursorScale = document.querySelectorAll('.cursor-scale'),
	mouseX = 0,
	mouseY = 0

gsap.to({}, 0.016, {
	repeat: -1,

	onRepeat: function () {
		gsap.set(cursor, {
			css: {
				left: mouseX,
				top: mouseY
			}
		})
	}
});

window.addEventListener("mousemove", function (e) {
	mouseX = e.clientX;
	mouseY = e.clientY
});

cursorScale.forEach(link => {
	link.addEventListener('mouseleave', () => {
		cursor.classList.remove('grow');
		cursor.classList.remove('grow-small');
	});
	link.addEventListener('mouseenter', () => {
		cursor.classList.add('grow');
		if (link.classList.contains('small')) {
			cursor.classList.remove('grow');
			cursor.classList.add('grow-small');
		}
	});
});

/* -------------------------------------------------------------------------- */
/*                                  Dark Mode                                 */
/* -------------------------------------------------------------------------- */
const html = document.documentElement;
const logo = document.getElementById('logo')
const switcher = document.querySelector(".color__switcher");
const preferenceQuery = window.matchMedia("(prefers-color-scheme: dark)");

const addDarkMode = () => {
	html.classList.remove("light");
	html.classList.add("dark");
	logo.src = logoDarkUrl
	switcher.classList.remove('light')
	switcher.classList.add('dark')
};

const addLightMode = () => {
	html.classList.remove("dark");
	html.classList.add("light");
	logo.src = logoLightUrl
	switcher.classList.remove('dark')
	switcher.classList.add('light')
};

const toggleTheme = () =>
	!html.classList.contains("dark") ? addDarkMode() : addLightMode();

const checkPreference = () =>
	preferenceQuery.matches ? addDarkMode() : addLightMode();

switcher.addEventListener("click", toggleTheme);
preferenceQuery.addEventListener("change", checkPreference);

(() => checkPreference())();

/* -------------------------------------------------------------------------- */
/*                           Lenis smooth scrolling                           */
/* -------------------------------------------------------------------------- */
const lenis = new Lenis()

function raf(time) {
	lenis.raf(time)
	requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

/* -------------------------------------------------------------------------- */
/*                             Initialize the menu                            */
/* -------------------------------------------------------------------------- */
new Menu(document.querySelector('.social__menu'));


/* -------------------------------------------------------------------------- */
/*                             DOM elements query                             */
/* -------------------------------------------------------------------------- */
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
		socialList: document.querySelectorAll('.social__menu'),
		bottomImages: document.querySelectorAll('.menu__content-image--1 > .menu__content-image-inner, .menu__content-image--2 > .menu__content-image-inner, .menu__content-image--3 > .menu__content-image-inner')
	},
	// Toggle button
	toggleBtn: document.querySelector('.toggle__btn'),
	// Projects
	projects: document.querySelector('.projects'),
	// Project technologies
	technologies: document.querySelector('.project__technologies')
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
		document.body.classList[menuStatus.isOpen ? 'add' : 'remove']('menu__open');
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
	.to(DOM.menuContent.socialList, {
		duration: 1,
		startAt: { y: '20%', opacity: 0 },
		opacity: 1,
		y: '0%',
		stagger: .2
	}, 'images')


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


/* -------------------------------------------------------------------------- */
/*              Animate the content background title as we scroll             */
/* -------------------------------------------------------------------------- */
const headingAnimateOnScroll = () => {

	let windowWidth = window.innerWidth;
	gsap.to(DOM.content.backgroundTitles, {
		scrollTrigger: {
			start: 0,
			end: '+=50000px',
			scrub: true
		},
		ease: 'none',
		x: () => -DOM.content.backgroundTitles.offsetWidth - (13.25 * windowWidth / 100 + 25 * windowWidth / 100 + windowWidth / 100) + windowWidth
	})
}

/* -------------------------------------------------------------------------- */
/*                               Preload images                               */
/* -------------------------------------------------------------------------- */
preloadImages('.project__image-inner').then(() => {
	document.body.classList.remove('loading');

	setTimeout(() => {
		headingAnimateOnScroll();
	}, 600)
});

