import { createElement } from './render.js';

const activeClass = 'main-navigation__item--active';

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

const titlesList = {
  all: 'There are no movies in our database',
  watchlist: 'There are no movies to watch now',
  history: 'There are no watched movies now',
  favorites: 'There are no favorite movies now',
};

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

getActiveFilter(elementToChange) {
  this.element.querySelector(`.${activeClass}`).classList.remove(activeClass);
  const locationHash = window.location.hash.split('#')[1];
  if (locationHash) {
    elementToChange.textContent = titlesList[locationHash];
    this.element.querySelector(`a[href="#${locationHash}"`).classList.add((activeClass));
  }
}

setEmptyMessage(elementToChange) {
  const filters = Array.from(this.element.querySelectorAll('.main-navigation__item'));
  let currentFilter = this.element.querySelector(`.${activeClass}`);
  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      if (filter !== currentFilter) {
        filter.classList.add(activeClass);
        this.changeEmtyTitle(filter, elementToChange);
        currentFilter.classList.remove(activeClass);
        currentFilter = filter;
      }
    });
  });
}

changeEmtyTitle(filter, elementToChange) {
  elementToChange.textContent = titlesList[filter.href.split('#')[1]];
}


removeElement() {
  this.#element = null;
}
}
