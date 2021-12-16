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

#renderMovie = (movie) => {
  const moviePresenter = new MoviePresenter(this.#cardsContainer);
  moviePresenter.init(movie);
}

#renderMovies = (from, to) => {
  this.#movies.slice(from, to)
    .forEach((movie) => this.#renderMovie(movie));
}

#renderNoMovies = () => {
  renderElement(this.#cardsContainer, this.#emptyListComponent, RenderPosition.BEFOREEND);
  this.menuComponent.setEmptyMessage(this.#emptyListComponent.element);
}

#renderLoadMoreButton = () => {
  renderElement(this.#mainContainer, this.#buttonComponent, RenderPosition.BEFOREEND);
  this.#buttonComponent.addClickControlsEvent();
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

}


