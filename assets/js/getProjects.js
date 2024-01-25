// Gsap
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
// Figure Animation
import figureAnim from './figureAnim';
import getDesigns from '/assets/js/getDesigns'

// Api URL
// Check if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

// Set the API URL based on the environment
const endpointUrl = isProduction
	? 'https://strapi-portfolio-l13w.onrender.com/api/proyectos?filters[categorias][nombre][$eq]=Web%20development&populate=*'
	: 'http://localhost:1337/api/proyectos?filters[categorias][nombre][$eq]=Web%20development&populate=*';


// Root node to inject projects
const rootNode = document.querySelector('.projects-wrapper')

// Generate project templates
const generateProjectsTemplate = (data) => {
	return `
		<figure class="project">
			<figcaption class="project__caption">
				<h2 class="project__caption-title oh"><span class="project__inner">${data.attributes.titulo}</span></h2>
				<p class="project__caption-description">${data.attributes.descripcion}</p>
			</figcaption>
			<a href="${data.attributes.Url}" class="project__link cursor-scale" target="_blank">
				<div class="project__image-wrap">
					<div class="project__image"><div class="project__image-inner" style="background-image:url(${data.attributes.imagen.data.attributes.url})"></div></div>
					<div class="project__technologies"><div>${getTechnologies(data.attributes.technologies)}</div></div>
				</div>
			</a>
		</figure>
  `
}

// Render the data to de DOM
const renderProjectsData = (node, data) => {
	const projectsHtml = data.data.map(project => generateProjectsTemplate(project)).join('')
	node.innerHTML += projectsHtml
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
const getProjects = async (url) => {
	try {
		const response = await fetch(url)
		const data = await response.json()

		renderProjectsData(rootNode, data)

		// Call the animation when projects are already loaded
		figureAnim()

		// Call the designs projects when dev projects are already loaded
		getDesigns

		const projects = document.querySelectorAll('.project')

		projects.forEach((project) => {

			const imageInner = project.querySelector('.project__image-inner')
			const title = project.querySelector('.project__caption-title')
			const titleInner = project.querySelector('.project__inner')

			gsap.set(imageInner, {
				transformOrigin: '50% 0%',
				scaleY: 1.2,
				scaleX: 1.2,
			});

			gsap.timeline({
				scrollTrigger: {
					trigger: project,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true
				}
			})
				.addLabel('start', 0)
				// scale up the inner image
				.to(imageInner, {
					ease: 'none',
					scaleY: 1,
					scaleX: 1,
				}, 'start')
				// translate the title and number
				.to(title, {
					ease: 'none',
					yPercent: -150,
					opacity: 0
				}, 'start')
				// translate the inner title/number (overflow is hidden so they get hidden)
				.to(titleInner, {
					scrollTrigger: {
						trigger: project,
						start: 'top bottom',
						end: 'top 20%',
						scrub: true,
					},
					ease: 'expo.in',
					yPercent: -10
				}, 'start')

		})

	} catch (error) {
		console.log('Error', error.message)
	}
}

export default getProjects(endpointUrl)
