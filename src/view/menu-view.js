import AbstractView from './abstract-view.js';
export const ACTIVE_CLASS = 'main-navigation__item--active';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  console.log(name, count);
  return `<a href="#all" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''} main-navigation__item--active">All movies</a>`;
};

const createMenuTemplate = (filterItems, currentFilterType) =>
  // const filterItemsTemplate = filterItems
  //   .map((filter) => createFilterItemTemplate(filter, currentFilterType))
  //   .join('');
  // const {type, name, count} = filter;
  (
    `<nav class="main-navigation">
  <div class="main-navigation__items">
  <a href="#all" class="main-navigation__item {type === currentFilterType ? 'main-navigation__item--active' : ''} main-navigation__item--active">All movies</a>
  <a href="#watchlist" class="main-navigation__item {type === currentFilterType ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">0</span></a>
  <a href="#history" class="main-navigation__item {type === currentFilterType ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">0</span></a>
  <a href="#favorites" class="main-navigation__item {type === currentFilterType ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">0</span></a>
  <a href="#stats" class="main-navigation__additional">Stats</a>
  </div>
  </nav>
  </section>`
  // ${filterItemsTemplate}
  );
const titlesList = {
  all: 'There are no movies in our database',
  watchlist: 'There are no movies to watch now',
  history: 'There are no watched movies now',
  favorites: 'There are no favorite movies now',
};

export default class MenuView extends AbstractView{

  #currentFilter = null;
  #filters = null;

  #watchListCount = this.element.querySelector('a[href="#watchlist"]').querySelector('span');
  #historyCount = this.element.querySelector('a[href="#history"]').querySelector('span');
  #favoritesCount = this.element.querySelector('a[href="#favorites"]').querySelector('span');

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    // console.log(filters, currentFilterType);
    console.log('конструктор меню');

  }

  get template() {
    // console.log(this.#filters, this.#currentFilter);
    console.log('template меню');
    return createMenuTemplate(this.#filters, this.#currentFilter);
  }

  setActiveFilter(elementToChange) {
    this.element.querySelector(`.${ACTIVE_CLASS}`).classList.remove(ACTIVE_CLASS);
    const locationHash = window.location.hash.split('#')[1];
    if (locationHash) {
      elementToChange.textContent = titlesList[locationHash];
      this.element.querySelector(`a[href="#${locationHash}"`).classList.add(ACTIVE_CLASS);
    }
    this._callback.setFilter = this.changeActiveFilter.bind(this);
    this.element.addEventListener('click', this._callback.setFilter);
  }

  changeActiveFilter(evt) {
    this.#currentFilter = this.element.querySelector(`.${ACTIVE_CLASS}`);

    if ((evt.target.className === 'main-navigation__item' || evt.target.className === 'main-navigation__item-count') && this.#currentFilter !== evt.target) {
      this.#currentFilter.classList.remove(ACTIVE_CLASS);
      this.#currentFilter = evt.target.closest('.main-navigation__item');
      this.#currentFilter.classList.add(ACTIVE_CLASS);
    }
  }

  changeEmptyTitle(filter, elementToChange) {
    elementToChange.textContent = titlesList[filter.href.split('#')[1]];
  }

  setFiltersCount(movies) {
    const watchlistMovies = movies.filter((movie) =>
      movie.userDetails.watchlist);
    this.#watchListCount.textContent = watchlistMovies.length;

    const historyMovies = movies.filter((movie) =>
      movie.userDetails.alreadyWatched);
    this.#historyCount.textContent = historyMovies.length;

    const favoritesMovies = movies.filter((movie) =>
      movie.userDetails.favorite);
    this.#favoritesCount.textContent = favoritesMovies.length;
  }

  ///////////
  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
//////////
}

