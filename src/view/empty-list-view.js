import { createElement } from './render.js';

const createEmtyListTemplate = () => ('<h2 class="films-list__title">There are no movies in our database</h2>');

export default class EmtyListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createEmtyListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
