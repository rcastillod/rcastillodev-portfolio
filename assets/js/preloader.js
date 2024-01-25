import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis()

const startPreLoader = () => {

	// Add body class
	document.body.classList.add('loader__visible')
	// Pause the lenis scroll when the preview is open
	lenis.stop()

	const loader = document.querySelector('.loader__wrapper')
	const preCounter = document.querySelector('.counter')
	let currentValue = 0

	const updateCounter = () => {
		if (currentValue === 100) return

		currentValue += Math.floor(Math.random() * 10) + 1

		if (currentValue > 100) {
			currentValue = 100
		}

		if (currentValue === 100) {

			gsap.to(loader, {
				duration: 1,
				delay: 1,
				opacity: 0,
				onComplete: function () {
					// Hide the preloader overlay when the animation is complete
					loader.style.display = "none";
				},
			});
			gsap.to('.content__caption-background-title > div', {
				y: 0,
				delay: .3,
				ease: "power4.out",
			})
			gsap.to('.content__title > div', {
				duration: 1,
				ease: "power4.out",
				y: 0,
				delay: 1.6,
				stagger: .09
			})

			// Remove body class
			document.body.classList.remove('loader__visible')
			// Enable the scroll when preview is closed
			lenis.start()
		}

		preCounter.textContent = currentValue


		let delay = Math.floor(Math.random() * 200) + 50
		setTimeout(updateCounter, delay)

	}

	updateCounter()

}

export default startPreLoader

// gsap.to('.counter', 0.25, {
// 	delay: 3.5,
// 	opacity: 0
// })
