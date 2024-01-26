// Spline
import { Application } from '@splinetool/runtime';
// Gsap
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const figureAnim = () => {

	const canvas = document.getElementById('cubesFig');
	const app = new Application(canvas);
	app
		.load('https://prod.spline.design/Lc21rEwxZf6KYSSw/scene.splinecode')
		.then(() => {
			const body = app.findObjectByName("body")

			gsap.set(body.scale, { x: 2, y: 2, z: 2 })
			gsap.set(body.position, { x: -1000, y: -500 })
			gsap.set(body.rotation, { x: -0.2, y: 1.9 })

			const bodyTimeline01 = gsap.timeline({
				scrollTrigger: {
					trigger: '.projects',
					start: 'top center',
					end: 'bottom bottom',
					scrub: 1.5,
				}
			})
				.to(body.position, { x: -1050, y: -1000 }, 0)
				.to(body.scale, { x: 3, y: 3, z: 3 }, 0)
				.to(body.rotation, { x: -Math.PI / 14, z: Math.PI / 46 }, 0)

			// Add another trigger
			const bodyTimeline02 = gsap.timeline({
				scrollTrigger: {
					duration: 6,
					trigger: '.designs',
					start: 'top bottom',
					end: 'top center',
					scrub: 1.5,
				},
			})
				.to(body.position, { x: -1000, y: -900 }, 0)
				.to(body.scale, { x: 2.7, y: 2.7, z: 2.7 }, 0)
				.to(body.rotation, { x: -0.2, y: 1, z: 0 }, 0)
		})

	// Add another trigger
	// 	const bodyTimeline02 = gsap.timeline({
	// 		scrollTrigger: {
	// 			trigger: '.designs',
	// 			start: 'top bottom',
	// 			end: 'bottom bottom',
	// 			scrub: true,
	// 		},
	// 	})
	// 		.to(body.position, { x: 0, y: -500 }, 0)
	// 		.to(body.scale, { x: 1.2, y: 1.2, z: 1.2 }, 0)
	// 		.to(body.rotation, { x: -0.1, y: 0, z: 0 }, 0)
	// })

}

export default figureAnim
