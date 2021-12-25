import MenuView from '../view/menu-view.js';
import FilterView from '../view/filter-view.js';
import CardsContainerView from '../view/cards-container-view.js';
import ButtonView from '../view/button-view.js';
import AvatarView from '../view/user-name-view.js';
import ExtraView from '../view/extra-view.js';
import FooterView from '../view/footer-view.js';
import EmtyListView from '../view/empty-list-view.js';
import { remove, renderElement } from '../mock/render.js';
import { RenderPosition } from '../mock/generate.js';
import MoviePresenter from './movie-presenter.js';
import { ACTIVE_CLASS } from '../view/menu-view.js';
import { allMovies, renderMovies } from '../main.js';
import { updateItem } from '../mock/utils.js';

const NEXT_POSTS_COUNT = 5;
const footer = document.querySelector('.footer');

export default class MovieListPresenter {
  #mainContainer = null;

  #cardsContainerComponent = new CardsContainerView();
  menuComponent = new MenuView();
  #filterComponent = new FilterView();
  #buttonComponent = new ButtonView();
  #avatarComponent = new AvatarView();
  #extraComponent = new ExtraView();
  #footerComponent = new FooterView();
  #emptyListComponent = new EmtyListView();
  moviePresenter = new Map();
  #cardsContainer = this.#cardsContainerComponent.element.querySelector('.films-list__container');
  #renderedMoviesCount = NEXT_POSTS_COUNT;

  movies = [];

  constructor(mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (movies) => {
    this.movies = [...movies];
    renderElement(this.#mainContainer, this.menuComponent, RenderPosition.BEFOREEND);
    this.menuComponent.setFiltersCount(this.movies);
    this.menuComponent.setActiveFilter(this.#emptyListComponent.element);
    this.#renderMovieList();
  }


  #renderSort = () => {
    renderElement(this.#mainContainer, this.#filterComponent, RenderPosition.BEFOREEND);
  }

  renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#cardsContainer, this, this.handleMovieChange.bind(this), this.handleModeChange);
    moviePresenter.init(movie);
    this.moviePresenter.set(movie.id, moviePresenter);
  }

  #renderMovies = (from, to) => {
    if(this.movies.length === 0) {
      this.#renderNoMovies();
    } else {
      this.movies.slice(from, to)
        .forEach((movie) => this.renderMovie(movie));
    }
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

    this.#renderMovies(0, Math.min(this.movies.length, NEXT_POSTS_COUNT));

    if (this.movies.length > NEXT_POSTS_COUNT) {
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
        this.changeEmptyTitle(currentFilter, elementToChange);
      }
    });
  }

  addNextPosts() {
    this.#buttonComponent.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      renderMovies(this.#renderedMoviesCount, this.#renderedMoviesCount + NEXT_POSTS_COUNT);
      this.#renderedMoviesCount += NEXT_POSTS_COUNT;
      if (this.#renderedMoviesCount >= allMovies.length) {
        this.#buttonComponent.element.remove();
      }
    });
  }

  clearMovieList() {
    this.moviePresenter.forEach((presenter) => presenter.destroy());
    this.moviePresenter.clear();
    this.#renderedMoviesCount = NEXT_POSTS_COUNT;
    remove(this.#buttonComponent);
  }

  handleMovieChange (updatedMovie) {
    this.movies = updateItem(this.movies, updatedMovie);
    this.moviePresenter.get(updatedMovie.id).init(updatedMovie);
    this.menuComponent.setFiltersCount(this.movies);
  }

  handleModeChange() {
    this.moviePresenter.forEach((presenter) => presenter.resetView());
  }
}

