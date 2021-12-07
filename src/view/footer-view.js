import { createElement } from './render.js';
import { POSTSCOUNT } from './extra-view.js';

const createFooterTemplate = () => (
  `<p>${POSTSCOUNT} movies inside</p>`
);

export default class FooterView {
#element = null;

get element() {
  if (!this.#element) {
    this.#element = createElement(this.template);
  }
  return this.#element;
}

get template() {
  return createFooterTemplate();
}

removeElement() {
  this.#element = null;
}
}
