import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Api URL
// Check if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

// Set the API URL based on the environment
const endpointUrl = isProduction
	? 'https://strapi-portfolio-l13w.onrender.com/api/proyectos?filters[categorias][nombre][$eq]=Design&populate=*'
	: 'http://localhost:1337/api/proyectos?filters[categorias][nombre][$eq]=Design&populate=*';


// Root node to inject designs
const rootNode = document.querySelector('.designs-wrapper')

// Generate project templates
const generateDesignsTemplate = (data) => {
	return `
		<figure class="design__item">
			<div class="design__item-img">
				<div class="design__item-imginner" style="background-image: url(${data.attributes.imagen.data.attributes.url})"></div>
			</div>
			<figcaption class="design__item-caption">
				<h2 class="design__item-title">${data.attributes.titulo}</h2>
				<p class="design__item-tags">${getTechnologies(data.attributes.technologies)}</p>
			</figcaption>
		</figure>
  `
}

// Render the data to de DOM
const renderDesignsData = (node, data) => {
	const designsHtml = data.data.map(project => generateDesignsTemplate(project)).join('')
	node.innerHTML += designsHtml
}

// Render the technologies inside a span tag
const getTechnologies = (tech) => {
	const techNewArray = []
	const technologiesHtml = tech.data
	technologiesHtml.forEach(el => {
		techNewArray.push(`<span>${el.attributes.Nombre}</span>`)
	});
	// Remove comma separator
	return techNewArray.join('<span class="separator">*</span>')
}

// Fetch data from Strapi
const getDesigns = async (url) => {
	try {
		const response = await fetch(url)
		const data = await response.json()

		renderDesignsData(rootNode, data)

		const container = document.querySelector('.designs-wrapper')
		let containerWidth = container.scrollWidth - document.documentElement.clientWidth;

		let skewSetter = gsap.quickTo(".design__item-img", "skewY")
		let clamp = gsap.utils.clamp(-5, 5);

		gsap.to(container, {
			x: () => -containerWidth,
			scrollTrigger: {
				trigger: container,
				start: 'top top',
				scrub: 0.5,
				pin: container,
				end: () => "+=" + containerWidth,
				invalidateOnRefresh: true,
				onUpdate: self => skewSetter(clamp(self.getVelocity() / -50)),
				onStop: () => skewSetter(0)
			}
		})
		gsap.to('.design__item-title', {
			xPercent: -10,
			scrollTrigger: {
				trigger: container,
				start: 'top top',
				scrub: 0.5,
			}
		})

	} catch (error) {
		console.log('Error', error.message)
	}
}

export default getDesigns(endpointUrl)
