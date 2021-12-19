import MenuView from '../view/menu-view.js';
import CardsView from '../view/cards-view.js';
import FilterView from '../view/filter-view.js';
import CardsContainerView from '../view/cards-container-view.js';
import ButtonView from '../view/button-view.js';
import AvatarView from '../view/user-name-view.js';
import ExtraView from '../view/extra-view.js';
import FooterView from '../view/footer-view.js';
import EmtyListView from '../view/empty-list-view.js';
import { renderElement } from '../mock/render.js';
import { RenderPosition } from '../mock/generate.js';
import MoviePresenter from './movie-presenter.js';
import { ACTIVE_CLASS } from '../view/menu-view.js';
import { allMovies, renderMovies } from '../main.js';

const NEXT_POSTS_COUNT = 5;
const footer = document.querySelector('.footer');

export default class MovieListPresenter {
#mainContainer = null;

#cardsContainerComponent = new CardsContainerView();
#cardsComponent = new CardsView();
menuComponent = new MenuView();
#filterComponent = new FilterView();
#buttonComponent = new ButtonView();
#avatarComponent = new AvatarView();
#extraComponent = new ExtraView();
#footerComponent = new FooterView();
#emptyListComponent = new EmtyListView();
#cardsContainer = this.#cardsContainerComponent.element.querySelector('.films-list__container');
#init = null;

#movies = [];

constructor(mainContainer) {
  this.#mainContainer = mainContainer;
}

init = (movies) => {
  this.#movies = [...movies];
  renderElement(this.#mainContainer, this.menuComponent, RenderPosition.BEFOREEND);
  this.menuComponent.setFiltersCount();
  this.menuComponent.setActiveFilter(this.#emptyListComponent.element);
  this.#renderMovieList();
}

#renderSort = () => {
  renderElement(this.#mainContainer, this.#filterComponent, RenderPosition.BEFOREEND);
}

renderMovie = (movie) => {
  new MoviePresenter(this.#cardsContainer, movie, this);
}

#renderMovies = (from, to) => {
  this.#movies.slice(from, to)
    .forEach((movie) => this.renderMovie(movie));
}

#renderNoMovies = () => {
  renderElement(this.#cardsContainer, this.#emptyListComponent, RenderPosition.BEFOREEND);
  this.menuComponent.setEmptyMessage(this.#emptyListComponent.element);
}

#renderLoadMoreButton = () => {
  renderElement(this.#mainContainer, this.#buttonComponent, RenderPosition.BEFOREEND);
  this.addNextPosts();
}

#renderMovieList = () => {
  this.#renderSort();

  renderElement(this.#mainContainer, this.#cardsContainerComponent, RenderPosition.BEFOREEND);

  this.#renderMovies(0, Math.min(this.#movies.length, NEXT_POSTS_COUNT));

  if (this.#movies.length > NEXT_POSTS_COUNT) {
    this.#renderLoadMoreButton();
  }
  renderElement(footer, this.#footerComponent, RenderPosition.BEFOREEND);


}

setEmptyMessage(elementToChange) {
  const filterList = this.menuComponent.querySelector('.main-navigation__items');
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

addNextPosts() {
  let renderedMoviesCount = NEXT_POSTS_COUNT;
  this.#buttonComponent.element.addEventListener('click', (evt) => {
    evt.preventDefault();
    renderMovies(renderedMoviesCount, renderedMoviesCount + NEXT_POSTS_COUNT);
    renderedMoviesCount += NEXT_POSTS_COUNT;
    if (renderedMoviesCount >= allMovies.length) {
      this.#buttonComponent.element.remove();
    }
  });
}


}


