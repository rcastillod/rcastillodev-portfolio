import { preloadImages, isInViewport } from './extras';
import { Menu } from './menu';
import getProjects from './getProjects'
import { Project } from './projects';
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

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
	link.addEventListener('mousemove', () => {
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
	logo.src = 'assets/img/logorcDevDark.svg'
	switcher.classList.remove('light')
	switcher.classList.add('dark')
};

const addLightMode = () => {
	html.classList.remove("dark");
	html.classList.add("light");
	logo.src = 'assets/img/logorcDevLight.svg'
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

/* -------------------------------------------------------------------------- */
/*                             Initialize the menu                            */
/* -------------------------------------------------------------------------- */
new Menu(document.querySelector('.social__menu'));

// Project instances (Project is the .content > figure.project)
const projects = [];

setTimeout(() => {
	[...document.querySelectorAll('.project')].forEach(project => {
		projects.push(new Project(project));
	});
}, 500)


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
/*                   ScrollTrigger animations for scrolling                   */
/* -------------------------------------------------------------------------- */
const animateOnScroll = () => {

	for (const project of projects) {

		gsap.set(project.DOM.imageInner, {
			transformOrigin: '50% 0%',
			scaleY: 1.2,
			scaleX: 1.2,
		});

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
				scaleY: 1,
				scaleX: 1,
			}, 'start')
			// translate the title and number
			.to(project.DOM.title, {
				ease: 'none',
				yPercent: -150,
				opacity: 0
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
				yPercent: -10
			}, 'start')
			.to(project.DOM.description, {
				ease: 'none',
			}, 'start')
	}

	/* -------------------------------------------------------------------------- */
	/*              Animate the content background title as we scroll             */
	/* -------------------------------------------------------------------------- */
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

	initSmoothScrolling();
	setTimeout(() => {
		animateOnScroll();
	}, 600)
});


/* -------------------------------------------------------------------------- */
/*                          Image rotation animation                          */
/* -------------------------------------------------------------------------- */

// Sets up default animation settings and merges with options
const setupAnimationDefaults = (itemElement, options) => {
	// Default settings for clip paths and scroll trigger
	let defaults = {
		clipPaths: {
			step1: {
				initial: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
				final: 'polygon(50% 0%, 50% 50%, 50% 50%, 50% 100%)',
			},
			step2: {
				initial: 'polygon(50% 50%, 50% 0%, 50% 100%, 50% 50%)',
				final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
			}
		},
		// Default scroll trigger settings
		scrollTrigger: {
			trigger: itemElement,
			start: 'top 50%',
			end: '+=50%',
			scrub: true,
		},
		// Default perspective setting
		perspective: false
	};

	// Merge defaults with options provided
	if (options && options.scrollTrigger) {
		defaults.scrollTrigger = {
			...defaults.scrollTrigger,
			...options.scrollTrigger
		};
	}

	// Merge and return the complete settings
	return {
		...defaults,
		...options,
		scrollTrigger: defaults.scrollTrigger
	};
};

const fx3 = (itemElement, options) => {
	// Set up the animation settings
	const settings = setupAnimationDefaults(itemElement, options);
	// Select the elements to animate
	const imageElement = itemElement.querySelector('.about-content__img');
	const innerElements = imageElement.querySelectorAll('.about-content__img-inner'); // Now it selects both inners
	const text = itemElement.querySelector('.about-content__text');

	return gsap.timeline({
		defaults: {
			ease: 'none'
		},
		onStart: () => {
			if (settings.perspective) {
				gsap.set([imageElement, itemElement], {
					perspective: settings.perspective
				});
			}
		},
		scrollTrigger: settings.scrollTrigger
	})
		.fromTo(imageElement, {
			scale: 0.3,
			filter: 'brightness(100%) contrast(100%)',
			'clip-path': settings.clipPaths.step1.initial
		}, {
			ease: 'sine',
			rotationX: -35,
			rotationY: 35,
			filter: 'brightness(60%) contrast(400%)',
			scale: 0.7,
			'clip-path': settings.clipPaths.step1.final
		}, 0)
		.to(innerElements[0], {
			ease: 'sine',
			skewY: 10,
			scaleY: 1.2,
		}, 0)

		// Switch image
		.add(() => {
			// Toggle the visibility of the inner elements
			innerElements[0].classList.toggle('about-content__img-inner--hidden');
			innerElements[1].classList.toggle('about-content__img-inner--hidden');
		}, '>')
		.to(imageElement, {
			ease: 'sine.in',
			startAt: {
				'clip-path': settings.clipPaths.step2.initial
			},
			'clip-path': settings.clipPaths.step2.final,
			filter: 'brightness(100%) contrast(100%)',
			scale: 1,
			rotationX: 0,
			rotationY: 0,
		}, '<')
		.to(innerElements[1], {
			ease: 'sine.in',
			startAt: { skewY: 10, scaleY: 2 },
			skewY: 0,
			scaleY: 1,
		}, '<')

		.fromTo(text, {
			opacity: 0,
			yPercent: 40,
		}, {
			opacity: 1,
			yPercent: 0,
		}, '>')
		.to(imageElement, {
			ease: 'sine',
			startAt: { filter: 'brightness(100%) contrast(100%) opacity(100%)' },
			filter: 'brightness(60%) contrast(400%) opacity(0%)',
			rotationX: 25,
			rotationY: 2,
			scale: 1.2
		}, '<')
}

const items = [
	{
		id: '#item-3',
		animationProfile: fx3,
		options: {
			clipPaths: {
				step1: {
					initial: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
					final: 'polygon(50% 0%, 50% 50%, 50% 50%, 50% 100%)',
				},
				step2: {
					initial: 'polygon(50% 50%, 50% 0%, 50% 100%, 50% 50%)',
					final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
				}
			},
			scrollTrigger: {
				start: 'center center',
				end: '+=150%',
				pin: true
			},
			perspective: 400
		}
	},
]

// Iterate over the items and apply their animations
items.forEach(item => {
	const itemElement = document.querySelector(item.id);
	setTimeout(() => {
		// Check if element exists and has an animation profile
		if (itemElement && item.animationProfile) {
			// Apply the animation profile to the element with the specified options
			item.animationProfile(itemElement, item.options);

			// Check if the interactive tilt effect should be applied
			if (item.interactiveTilt) {
				// Instantiate the InteractiveTilt object for this item
				new InteractiveTilt(itemElement);
			}
		} else {
			// Warn if the element or animation profile is not found
			console.warn(`Element with ID ${item.id} or its animation profile is not defined.`);
		}
	}, 2000);
});
