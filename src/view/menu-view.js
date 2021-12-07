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

setEmptyMessage(elementToChange) {
  const filters = Array.from(this.element.querySelectorAll('.main-navigation__item'));
  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filters.forEach((oterFilter) => {
        oterFilter.classList.remove('main-navigation__item--active');
      });
      filter.classList.add('main-navigation__item--active');
      this.changeEmtyTitle(filter, elementToChange);
    });
  });
}

changeEmtyTitle(filter, elementToChange) {
//Я не уверена, что ссылка должна выглядеть так
  if (filter.href === 'http://localhost:8081/#all') {
    elementToChange.textContent = 'There are no movies in our database';
  } else if (filter.href === 'http://localhost:8081/#watchlist') {
    elementToChange.textContent = 'There are no movies to watch now';
  } else if (filter.href === 'http://localhost:8081/#history') {
    elementToChange.textContent = 'There are no watched movies now';
  } else if (filter.href === 'http://localhost:8081/#favorites') {
    elementToChange.textContent = 'There are no favorite movies now';
  }
}


removeElement() {
  this.#element = null;
}
}
