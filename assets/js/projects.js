/**
 * Class representing a Projects element (.project)
 */
export class Project {
  // DOM elements
  DOM = {
    // main element (.project)
    el: null,
    // caption (.project__caption)
    caption: null,
    // imageWrap (.project__image-wrap)
    imageWrap: null,
    // image (.project__image)
    image: null,
    // imageInner (.project__image > .project__image-inner)
    imageInner: null,
    // title (.project__caption-title)
    title: null,
    // titleInner (.project__caption-title > .project__inner)
    titleInner: null,
    // description (.project__caption-description)
    description: null,
  };

  /**
   * Constructor.
   * @param {Element} DOM_el - main element (.project)
   */
  constructor(DOM_el) {
    this.DOM.el = DOM_el;
    this.DOM.caption = this.DOM.el.querySelector('.project__caption');
    this.DOM.imageWrap = this.DOM.el.querySelector('.project__image-wrap');
    this.DOM.image = this.DOM.el.querySelector('.project__image');
    this.DOM.imageInner = this.DOM.image.querySelector('.project__image-inner');
    this.DOM.title = this.DOM.el.querySelector('.project__caption-title');
    this.DOM.titleInner = this.DOM.title.querySelector('.project__inner');
    this.DOM.description = this.DOM.el.querySelector('.project__caption-description');
    this.DOM.technologies = this.DOM.el.querySelector('.project__technologies > div');
  }
}