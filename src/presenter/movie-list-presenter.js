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
import { RenderPosition } from '../view/render-data.js';
import { mainElement } from '../view/render-data.js';

const NEXT_POSTS_COUNT = 5;
const footer = document.querySelector('.footer');

export default class MovieListPresenter {
#movieListContainer = null;

#cardsContainerComponent = new CardsContainerView();
#cardsComponent = new CardsView();
#menuComponent = new MenuView();
#filterComponent = new FilterView();
#buttonComponent = new ButtonView();
#avatarComponent = new AvatarView();
#extraComponent = new ExtraView();
#footerComponent = new FooterView();
#emptyListComponent = new EmtyListView();

#movies = [];

constructor(movieListContainer) {
  this.#movieListContainer = movieListContainer;
}

init = (movies) => {
  renderElement(mainElement, this.#menuComponent, RenderPosition.BEFOREEND);
  this.#menuComponent.setActiveFilter(this.#emptyListComponent.element);
  this.#menuComponent.setEmptyMessage(this.#emptyListComponent.element);

  this.#movies = [...movies];
  this.#renderMovieList();
}

#renderSort = () => {
  renderElement(mainElement, this.#filterComponent, RenderPosition.BEFOREEND);
}

#renderMovie = (movie) => {
  const cardsContainer = this.#cardsContainerComponent.element.querySelector('.films-list__container');
  const cardComponent = new CardsView(movie);
  // cardComponent.addClickHandler(movie, () => {
  //   new PopupView().postClickHandler(movie, cardComponent);
  // });
  renderElement(cardsContainer, cardComponent, RenderPosition.BEFOREEND);
}

#renderMovies = (from, to) => {
  this.#movies.slice(from, to)
    .forEach((movie) => this.#renderMovie(movie));
}

#renderNoMovies = () => {
  renderElement(this.#cardsContainerComponent, this.#filterComponent, RenderPosition.AFTERBEGIN);
  // Метод для рендеринга заглушки
}

#renderLoadMoreButton = () => {
  renderElement(mainElement, this.#buttonComponent, RenderPosition.BEFOREEND);
  this.#buttonComponent.addClickControlsEvent();
}

#renderMovieList = () => {
  this.#renderSort();

  renderElement(mainElement, this.#cardsContainerComponent, RenderPosition.BEFOREEND);

  this.#renderMovies(0, Math.min(this.#movies.length, NEXT_POSTS_COUNT));

  if (this.#movies.length > NEXT_POSTS_COUNT) {
    this.#renderLoadMoreButton();
  }
  renderElement(footer, this.#footerComponent, RenderPosition.BEFOREEND);


}

}


