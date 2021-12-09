import { createElement } from './render.js';

export default class AbctractView {
  #element = null;

  constructor() {
    if (new.target === AbctractView) {
      throw new Error('Can\'t instantiate instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement() {
    this.#element = null;
  }
}
