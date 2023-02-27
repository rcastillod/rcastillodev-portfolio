// Api URL
const endpointUrl = 'http://localhost:1337/api/proyectos?populate=*'

// Root node to inject projects
const rootNode = document.getElementById('projects')

// Generate project templates
const generateProjectsTemplate = (data) => {
  return `
    <figure class="project">
      <figcaption class="project__caption">
        <h2 class="project__caption-title oh"><span class="project__inner">${data.attributes.titulo}</span></h2>
        <p class="project__caption-description">
          In all energy exchanges, if no energy
          Enters or leaves an isolated system
          The entropy of that system increases</p>
      </figcaption>
      <div class="project__image-wrap"><div class="project__image"><div class="project__image-inner" style="background-image:url(http://localhost:1337${data.attributes.imagen.data.attributes.url})"></div></div></div>
    </figure>
  `
}

// Rende the data to de DOM
const renderProjectsData = (node, data) => {
  const projectsHtml = data.data.map(project => generateProjectsTemplate(project)).join('')
  node.innerHTML = projectsHtml
}

// Fetch data from Strapi
const getProjects = async (url) => {
  try {
    const response = await fetch(url)
    const data = await response.json()

    renderProjectsData(rootNode, data)

  } catch (error) {
    console.log('Error', error.message)
  }
}

export default getProjects(endpointUrl)