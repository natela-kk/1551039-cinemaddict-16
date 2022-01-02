import MenuView from '../view/menu-view.js';
import SortView from '../view/sort-view.js';
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
import { allMovies } from '../main.js';
import { updateItem } from '../mock/utils.js';
import { sortMovieDateDown, sortMovieRatingDown } from '../mock/utils.js';
import { SortType } from '../view/sort-view.js';

const NEXT_POSTS_COUNT = 5;
const footer = document.querySelector('.footer');

export default class MovieListPresenter {
  #mainContainer = null;
  #currentFilter = null;
  #currentSortTypeButton = null;

  #cardsContainerComponent = new CardsContainerView();
  menuComponent = new MenuView();
  sortComponent = new SortView();
  #buttonComponent = new ButtonView();
  #avatarComponent = new AvatarView();
  #extraComponent = new ExtraView();
  #footerComponent = new FooterView();
  #emptyListComponent = new EmtyListView();
  moviePresenter = new Map();
  #cardsContainer = this.#cardsContainerComponent.element.querySelector('.films-list__container');
  #renderedMoviesCount = NEXT_POSTS_COUNT;
  #currentSortType = SortType.DEFAULT;
  #sourcedMovies = [];

  movies = [];

  constructor(mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (movies) => {
    this.movies = [...movies];

    this.#sourcedMovies = [...movies];

    renderElement(this.#mainContainer, this.menuComponent, RenderPosition.BEFOREEND);
    this.#renderSort();
    this.menuComponent.setFiltersCount(this.movies);
    this.menuComponent.setActiveFilter(this.#emptyListComponent.element);
    this.#renderMovieList();

  }

  #sortMovies = (sortType) => {

    switch (sortType) {
      case SortType.DATE:
        this.movies.sort(sortMovieDateDown);
        break;
      case SortType.RATING:
        this.movies.sort(sortMovieRatingDown);
        break;
      default:
        this.movies = [...this.#sourcedMovies];
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortMovies(sortType);
    this.clearMovieList();
    this.#renderMovieList();
  }

  #renderSort = () => {
    renderElement(this.#mainContainer, this.sortComponent, RenderPosition.BEFOREEND);
    this.sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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

    renderElement(this.#mainContainer, this.#cardsContainerComponent, RenderPosition.BEFOREEND);

    this.#renderMovies(0, Math.min(this.movies.length, NEXT_POSTS_COUNT));

    if (this.movies.length > NEXT_POSTS_COUNT) {
      this.#renderLoadMoreButton();
    }
    renderElement(footer, this.#footerComponent, RenderPosition.BEFOREEND);
  }

  setEmptyMessage(elementToChange) {
    const filterList = this.menuComponent.querySelector('.main-navigation__items');
    this.#currentFilter = filterList.querySelector(`.${ACTIVE_CLASS}`);

    filterList.addEventListener('click', (evt) => {
      if (evt.target.className === 'main-navigation__item' && this.#currentFilter !== evt.target) {
        this.#currentFilter.classList.remove(ACTIVE_CLASS);
        this.#currentFilter = evt.target;
        this.#currentFilter.classList.add(ACTIVE_CLASS);
        this.changeEmptyTitle(this.#currentFilter, elementToChange);
      }
    });
  }

  addNextPosts() {
    this.#buttonComponent.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#renderMovies(this.#renderedMoviesCount, this.#renderedMoviesCount + NEXT_POSTS_COUNT);
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

  handleMovieChange (updatedMovie, scrollCoordinates) {
    this.movies = updateItem(this.movies, updatedMovie);
    this.moviePresenter.get(updatedMovie.id).init(updatedMovie, scrollCoordinates);
    this.#sourcedMovies = updateItem(this.#sourcedMovies, updatedMovie);
  }

  handleModeChange() {
    this.moviePresenter.forEach((presenter) => presenter.resetView());
  }


}

