import MenuView from '../view/menu-view.js';
import SortView from '../view/sort-view.js';
import CardsContainerView from '../view/cards-container-view.js';
import ButtonView from '../view/button-view.js';
import ExtraView from '../view/extra-view.js';
import FooterView from '../view/footer-view.js';
import EmtyListView from '../view/empty-list-view.js';
import { remove, renderElement } from '../mock/render.js';
import { RenderPosition } from '../mock/generate.js';
import MoviePresenter from './movie-presenter.js';
import { ACTIVE_CLASS } from '../view/menu-view.js';
import { sortMovieDateDown, sortMovieRatingDown } from '../mock/utils/utils.js';
import { UpdateType, UserAction, SortType } from '../const.js';

const MOVIES_COUNT_PER_STEP = 5;
const filters = [
  {
    type: 'all',
    name: 'ALL',
    count: 0,
  },
];
const footer = document.querySelector('.footer');

export default class MovieListPresenter {
  #mainContainer = null;
  #currentFilter = null;
  #moviesModel = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;

  #cardsContainerComponent = new CardsContainerView();
  menuComponent = new MenuView(filters, 'all');
  #extraComponent = new ExtraView();
  #footerComponent = new FooterView();
  #emptyListComponent = new EmtyListView();
  moviePresenter = new Map();
  #cardsContainer = this.#cardsContainerComponent.element.querySelector('.films-list__container');
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;

  constructor(mainContainer, moviesModel) {
    this.#mainContainer = mainContainer;
    this.#moviesModel = moviesModel;
    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#moviesModel.movies].sort(sortMovieDateDown);
      case SortType.RATING:
        return [...this.#moviesModel.movies].sort(sortMovieRatingDown);
    }
    return this.#moviesModel.movies;
  }

    init = () => {
      // renderElement(this.#mainContainer, this.menuComponent, RenderPosition.BEFOREEND);
      this.#renderSort();
      // this.menuComponent.setFiltersCount(this.movies);
      // this.menuComponent.setActiveFilter(this.#emptyListComponent.element);
      this.#renderMovieList();
    }

    #renderMovies = (movies) => {
      movies.forEach((movie) => this.renderMovie(movie));
    }

  renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#cardsContainer, this, this.handleViewAction, this.handleModeChange);
    moviePresenter.init(movie);
    this.moviePresenter.set(movie.id, moviePresenter);
  }

  #renderNoMovies = () => {
    renderElement(this.#cardsContainer, this.#emptyListComponent, RenderPosition.BEFOREEND);
    this.setEmptyMessage(this.#emptyListComponent.element);
  }

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new ButtonView();
    renderElement(this.#mainContainer, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this.#loadMoreButtonComponent.setClickHandler(this.handleLoadMoreButtonClick.bind(this));
  }

  #clearMoviesContainer = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    this.moviePresenter.forEach((presenter) => presenter.destroy());
    this.moviePresenter.clear();

    remove(this.#sortComponent);
    remove(this.noMoviesComponent);
    remove(this.#loadMoreButtonComponent);

    if (resetRenderedMoviesCount) {
      this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this.#renderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderMovieList = () => {
    renderElement(this.#mainContainer, this.#cardsContainerComponent, RenderPosition.BEFOREEND);

    const moviesCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount));
    this.#renderMovies(movies);

    if (moviesCount > MOVIES_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
    renderElement(footer, this.#footerComponent, RenderPosition.BEFOREEND);
  }

  setEmptyMessage(elementToChange) {
    console.log('menu');
    const filterList = this.menuComponent.element.querySelector('.main-navigation__items');
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

  handleLoadMoreButtonClick() {
    const moviesCount = this.movies.length;
    const newRenderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMoviesCount, newRenderedMoviesCount);

    this.#renderMovies(movies);
    this.#renderedMoviesCount = newRenderedMoviesCount;

    if (this.#renderedMoviesCount >= moviesCount) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  clearMovieList() {
    this.moviePresenter.forEach((presenter) => presenter.destroy());
    this.moviePresenter.clear();
    this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  handleMovieChange (updatedMovie, scrollCoordinates) {
    // this.movies = updateItem(this.movies, updatedMovie);
    this.moviePresenter.get(updatedMovie.id).init(updatedMovie, scrollCoordinates);
    // this.#sourcedMovies = updateItem(this.#sourcedMovies, updatedMovie);
  }

  handleViewAction = (actionType, updateType, update, scrollCoordinates) => {
    console.log(actionType, updateType, update, scrollCoordinates);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_MOVIE:
        this.#moviesModel.addMovie(updateType, update);
        break;
      case UserAction.DELETE_MOVIE:
        this.#moviesModel.deleteMovie(updateType, update);
        break;
    }
  }

    #handleModelEvent = (updateType, data) => {
      console.log(updateType, data);
      // В зависимости от типа изменений решаем, что делать:
      // - обновить часть списка (например, когда поменялось описание)
      // - обновить список (например, когда задача ушла в архив)
      // - обновить всю доску (например, при переключении фильтра)
      switch (updateType) {
        case UpdateType.PATCH:
          // - обновить часть списка (например, когда поменялось описание)
          this.moviePresenter.get(data.id).init(data);
          break;
        case UpdateType.MINOR:
          // - обновить список (например, когда задача ушла в архив)
          this.clearMovies();
          this.#renderMoviesContainer();
          break;
        case UpdateType.MAJOR:
          this.clearMovies({resetRenderedTaskCount: true, resetSortType: true});
          this.#renderMoviesContainer();
          // - обновить всю доску (например, при переключении фильтра)
          break;
      }
    }

    #handleSortTypeChange = (sortType) => {
      if (this.#currentSortType === sortType) {
        return;
      }

      this.#currentSortType = sortType;
      this.#clearMoviesContainer({resetRenderedMoviesCount: true});
      this.#renderMoviesContainer();
    }

#renderMoviesContainer = () => {
  const movies = this.movies;
  const moviesCount = movies.length;

  if(moviesCount === 0) {
    this.#renderNoMovies();
    return;
  }

  this.#renderSort();

  this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)));

  if (moviesCount > this.#renderedMoviesCount) {
    this.#renderLoadMoreButton();
  }
}

    #renderSort = () => {
      this.#sortComponent = new SortView(this.#currentSortType);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
      renderElement(this.#mainContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    }

    handleModeChange() {
      // this.#taskNewPresenter.destroy();
      this.moviePresenter.forEach((presenter) => presenter.resetView());
    }


}

