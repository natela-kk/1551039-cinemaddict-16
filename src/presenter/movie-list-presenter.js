import { filter } from '../mock/utils/filter.js';
import SortView from '../view/sort-view.js';
import CardsContainerView from '../view/cards-container-view.js';
import ButtonView from '../view/button-view.js';
import FooterView from '../view/footer-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import { remove, renderElement } from '../mock/render.js';
import { RenderPosition } from '../mock/generate.js';
import MoviePresenter from './movie-presenter.js';
import { replace, sortMovieDateDown, sortMovieRatingDown } from '../mock/utils/utils.js';
import { UpdateType, UserAction, SortType } from '../const.js';
import { FilterType } from '../const.js';

const MOVIES_COUNT_PER_STEP = 5;

const footer = document.querySelector('.footer');

export default class MovieListPresenter {
  #mainContainer = null;
  #moviesModel = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;
  #filterModel = null;
  #noMoviesComponent = null;

  #cardsContainerComponent = new CardsContainerView();
  #footerComponent = new FooterView();
  moviePresenter = new Map();
  #cardsContainer = this.#cardsContainerComponent.element.querySelector('.films-list__container');
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(mainContainer, moviesModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[this.#filterType](movies);
    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortMovieDateDown);
      case SortType.RATING:
        return filteredMovies.sort(sortMovieRatingDown);
    }
    return filteredMovies;
  }

  init = () => {
    this.#renderSort();
    this.#renderMovieList();
  }

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.renderMovie(movie));
  }

  renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#cardsContainer, this, this.handleViewAction, this.handleModeChange);
    moviePresenter.initCard(movie);
    moviePresenter.initPopup(movie);
    this.moviePresenter.set(movie.id, moviePresenter);
  }

  #renderNoMovies = () => {
    const noMoviesComponent = this.#noMoviesComponent;
    this.#noMoviesComponent = new NoMoviesView(this.#filterType);
    if (noMoviesComponent) {
      replace(this.#noMoviesComponent, noMoviesComponent);
      return;
    }
    renderElement(this.#cardsContainer, this.#noMoviesComponent, RenderPosition.BEFOREEND);
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
    remove(this.#loadMoreButtonComponent);

    if(this.noMoviesComponent) {
      remove(this.noMoviesComponent);
    }

    this.#renderedMoviesCount = resetRenderedMoviesCount ? MOVIES_COUNT_PER_STEP : Math.min(moviesCount, this.#renderedMoviesCount);

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

  handleViewAction = (actionType, updateType, update, scrollCoordinates) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        if (this.#filterType !== 'all' && this.moviePresenter.get(update.id)) {
          const oldPopup = this.moviePresenter.get(update.id).popupComponent;
          this.#moviesModel.updateMovie('MINOR', update, scrollCoordinates);
          if (this.moviePresenter.get(update.id)) {
            const updatedPopup = this.moviePresenter.get(update.id).popupComponent;
            replace(updatedPopup, oldPopup);
            this.moviePresenter.get(update.id).popupComponent.postClickHandler(update, this.moviePresenter);
          } else {
            this.#moviesModel.updateMovie('PATCH_POPUP', update);
          }
        } else if (this.#filterType === 'all') {
          this.#moviesModel.updateMovie('PATCH', update);
        }
        this.moviePresenter.get(update.id).popupComponent.element.scrollTo(...scrollCoordinates);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.moviePresenter.get(data.id).initCard(data);
        this.moviePresenter.get(data.id).initPopup(data);
        break;
      case UpdateType.PATCH_POPUP:
        {
          const moviePresenter = new MoviePresenter(this.#cardsContainer, this, this.handleViewAction, this.handleModeChange);
          this.moviePresenter.set(data.id, moviePresenter);
          this.moviePresenter.get(data.id).initPopup(data);
          this.moviePresenter.get(data.id).popupComponent.postClickHandler(data, moviePresenter);
          replace(this.moviePresenter.get(data.id).popupComponent, document.querySelector('form'));
        }
        break;
      case UpdateType.MINOR:
        this.#clearMoviesContainer();
        this.#renderMoviesContainer();
        break;
      case UpdateType.MAJOR:
        this.#clearMoviesContainer({resetRenderedMoviesCount: true, resetSortType: true});
        this.#renderMoviesContainer();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#clearMoviesContainer();
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
    this.moviePresenter.forEach((presenter) => presenter.resetView());
  }


}

