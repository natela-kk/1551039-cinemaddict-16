import AbctractView from './abstract-view.js';
import { allMovies } from '../main.js';
const ACTIVE_CLASS = 'main-navigation__item--active';

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

export default class MenuView extends AbctractView{

  get template() {
    return createMenuTemplate();
  }

  setActiveFilter(elementToChange) {
    this.element.querySelector(`.${ACTIVE_CLASS}`).classList.remove(ACTIVE_CLASS);
    const locationHash = window.location.hash.split('#')[1];
    if (locationHash) {
      elementToChange.textContent = titlesList[locationHash];
      this.element.querySelector(`a[href="#${locationHash}"`).classList.add(ACTIVE_CLASS);
    }
  }

  setEmptyMessage(elementToChange) {
    const filterList = this.element.querySelector('.main-navigation__items');
    let currentFilter = filterList.querySelector(`.${ACTIVE_CLASS}`);
    filterList.addEventListener('click', (evt) => {
      if (evt.target.className === 'main-navigation__item' && currentFilter !== evt.target) {
        currentFilter.classList.remove(ACTIVE_CLASS);
        currentFilter = evt.target;
        currentFilter.classList.add(ACTIVE_CLASS);
        this.changeEmtyTitle(currentFilter, elementToChange);
      }
    });
  }

  changeEmtyTitle(filter, elementToChange) {
    elementToChange.textContent = titlesList[filter.href.split('#')[1]];
  }

  setFiltersCount() {
    const watchListCount = this.element.querySelector('a[href="#watchlist"]').querySelector('span');
    const historyCount = this.element.querySelector('a[href="#history"]').querySelector('span');
    const favoritesCount = this.element.querySelector('a[href="#favorites"]').querySelector('span');
    const watchlistMovies = allMovies.filter((movie) =>
      movie.userDetails.watchlist);
    watchListCount.textContent = watchlistMovies.length;
    const historyMovies = allMovies.filter((movie) =>
      movie.userDetails.alreadyWatched);
    historyCount.textContent = historyMovies.length;

    const favoritesMovies = allMovies.filter((movie) =>
      movie.userDetails.favorite);
    favoritesCount.textContent = favoritesMovies.length;
  }

}

