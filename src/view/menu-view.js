import { createElement } from './render.js';

const createMenuTemplate = () => (
  `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">0</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">0</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">0</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>
</section>`
);

export default class MenuView {
#element = null;

get element() {
  if (!this.#element) {
    this.#element = createElement(this.template);
  }
  return this.#element;
}

get template() {
  return createMenuTemplate();
}

removeElement() {
  this.#element = null;
}
}
