import { createElement } from './render.js';

export const POSTSCOUNT = 22;

const createExtraTemplate = () => (
  `<div class="films-list__container">
  <section class="films-list films-list--extra">
  <h2 class="films-list__title">Top rated</h2>
  <div class="films-list__container">
  </div>
</section>

<section class="films-list films-list--extra">
  <h2 class="films-list__title">Most commented</h2>

  <div class="films-list__container">
  </div>
</section>
</div>`
);

export default class ExtraView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createExtraTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
