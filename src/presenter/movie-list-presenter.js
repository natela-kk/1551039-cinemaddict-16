import {filter} from '../mock/utils/filter.js';
import SortView from '../view/sort-view.js';
import CardsContainerView from '../view/cards-container-view.js';
import ButtonView from '../view/button-view.js';
import FooterView from '../view/footer-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import {remove, renderElement} from '../mock/render.js';
import {RenderPosition} from '../const.js';
import MoviePresenter from './movie-presenter.js';
import {
  replace,
  sortMovieDateDown,
  sortMovieRatingDown
} from '../mock/utils/utils.js';
import {UpdateType, SortType} from '../const.js';
import {FilterType} from '../const.js';
import {handleSiteMenuClick} from '../main.js';
import LoadingView from '../view/loading-view.js';

const MOVIES_COUNT_PER_STEP = 5;

const footer = document.querySelector('.footer');

export default class MovieListPresenter {
  #mainContainer = null;
  #moviesModel = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;
  #filterModel = null;
  #noMoviesComponent = null;
  #cardsContainerComponent = null;
  #cardsContainer = null;
  #filterPresenter = null;

  scrollCoordinates = [0, 0];

  #loadingComponent = new LoadingView();
  #footerComponent = new FooterView();
  moviePresenter = new Map();
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(mainContainer, moviesModel, filterModel, filterPresenter) {
    this.#mainContainer = mainContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#filterPresenter = filterPresenter;
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
    this.#renderMovieList();

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filterPresenter.addObservers();
  };

  #renderMovies = (movies, commentToDelete) => {
    movies.forEach((movie) => this.renderMovie(movie, commentToDelete));
  };

  renderMovie = (movie, commentToDelete) => {
    const moviePresenter = new MoviePresenter(this.#cardsContainer, this, this.handleViewAction, this.handleModeChange);
    moviePresenter.initCard(movie);
    moviePresenter.initPopup(movie, commentToDelete, this.#filterPresenter);
    this.moviePresenter.set(movie.id, moviePresenter);
  };

  #renderLoading = () => {
    renderElement(this.#cardsContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderNoMovies = () => {
    const noMoviesComponent = this.#noMoviesComponent;
    this.#noMoviesComponent = new NoMoviesView(this.#filterType);
    if (noMoviesComponent && noMoviesComponent.element.parentElement) {
      replace(this.#noMoviesComponent, noMoviesComponent);
      return;
    }
    renderElement(this.#cardsContainer, this.#noMoviesComponent, RenderPosition.BEFOREEND);
  };

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new ButtonView();
    renderElement(this.#cardsContainer, this.#loadMoreButtonComponent, RenderPosition.AFTEREND);
    this.#loadMoreButtonComponent.setClickHandler(this.handleLoadMoreButtonClick.bind(this));
  };

  clearMoviesContainer = ({
    resetRenderedMoviesCount = false,
    resetSortType = false
  } = {}) => {
    const moviesCount = this.movies.length;

    this.moviePresenter.forEach((presenter) => presenter.destroy());
    this.moviePresenter.clear();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#loadMoreButtonComponent);

    if (this.noMoviesComponent) {
      remove(this.noMoviesComponent);
    }
    this.#renderedMoviesCount = resetRenderedMoviesCount ? MOVIES_COUNT_PER_STEP : Math.min(moviesCount, this.#renderedMoviesCount);
    this.#renderedMoviesCount = this.#renderedMoviesCount < MOVIES_COUNT_PER_STEP ? MOVIES_COUNT_PER_STEP : this.#renderedMoviesCount;

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  destroy = () => {
    this.clearMoviesContainer({
      resetRenderedMoviesCount: true,
      resetSortType: true
    });
    remove(this.#cardsContainerComponent);
    this.removeObservers();
  };


  removeObservers() {
    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#filterPresenter.removeObservers();
  }

  #renderMovieList = () => {
    this.#cardsContainerComponent = new CardsContainerView();
    this.#cardsContainer = this.#cardsContainerComponent.element.querySelector('.films-list__container');

    renderElement(this.#mainContainer, this.#cardsContainerComponent, RenderPosition.BEFOREEND);

    const moviesCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount));
    this.#renderMovies(movies);
    if (moviesCount > MOVIES_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
    renderElement(footer, this.#footerComponent, RenderPosition.BEFOREEND);
  };

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

  handleViewAction = (update, scrollCoordinates, commentToDelete) => {
    this.scrollCoordinates = scrollCoordinates;

    const oldPresenter = this.moviePresenter.get(update.id);
    oldPresenter.popupComponent.removeDocumentBindedClickHandler();
    oldPresenter.popupComponent.removeDocumentKeydownHandler();

    if (this.#filterType !== 'all' && oldPresenter) {
      const filteredMovies = this.movies;
      this.#moviesModel.sendUpdate('PATCH', update, commentToDelete);

      if(filteredMovies > this.movies) {
        this.moviePresenter.get(update.id).cardComponent.element.remove();
        if(document.querySelector('.films-list__show-more')) {
          this.renderMovie(this.movies[Array.from(document.querySelectorAll('.film-card')).length]);
        }
      } else if(filteredMovies <  this.movies) {
        const newPresenter = this.moviePresenter.get(update.id);

        const removedCardIndex = this.movies.findIndex((movie) => movie.id ===  newPresenter.popupComponent._data.id);
        const firstCard = Array.from(document.querySelectorAll('.film-card'))[removedCardIndex];

        newPresenter.initCard(newPresenter.popupComponent._data, true, firstCard);

        const newRenderedMovies = Array.from(document.querySelectorAll('.film-card'));
        if(document.querySelector('.films-list__show-more') && newRenderedMovies.length % MOVIES_COUNT_PER_STEP !== 0) {
          newRenderedMovies[newRenderedMovies.length - 1].remove();
        }

      } if(this.movies.length === MOVIES_COUNT_PER_STEP) {
        remove(this.#loadMoreButtonComponent);
      }

      if(this.movies.length === 0) {
        this.#renderNoMovies();
      }

      const updatedPresenter = this.moviePresenter.get(update.id);

      if (!updatedPresenter && document.querySelector('.film-details__inner')) {
        this.#moviesModel.sendUpdate('PATCH_POPUP', update, commentToDelete, oldPresenter);
      }

    } else if (this.#filterType === 'all') {
      this.#moviesModel.sendUpdate('PATCH', update, commentToDelete);

    } else if (this.#filterType !== 'all' && !oldPresenter) {
      this.#moviesModel.sendUpdate('PATCH_POPUP', update, commentToDelete, oldPresenter);
      this.#moviesModel.sendUpdate('MINOR', update, commentToDelete);
    }

    if (document.querySelector('.film-details__inner') && this.moviePresenter.get(update.id)) {
      this.moviePresenter.get(update.id).popupComponent.element.scrollTo(...this.scrollCoordinates);
    }
    oldPresenter.popupComponent.addDocumentKeydownHandler();
    this.#filterPresenter.filterComponent.setMenuClickHandler(handleSiteMenuClick);
  };

  #handleModelEvent = (updateType, data, commentToDelete, oldPresenter) => {
    switch (updateType) {
      case UpdateType.PATCH: {
        const newPresenter = this.moviePresenter.get(data.id);
        newPresenter.initCard(data);
        newPresenter.initPopup(data, commentToDelete, this.#filterPresenter);
        if (document.querySelector('.film-details__inner') && document.querySelector('.film-details__inner') !== newPresenter.popupComponent.element.querySelector('.film-details__inner')) {
          replace(newPresenter.popupComponent, document.querySelector('.film-details__inner'));
          newPresenter.popupComponent.postClickHandler(data, newPresenter, commentToDelete);
        }

        break;
      }
      case UpdateType.PATCH_POPUP: {
        const moviePresenter = new MoviePresenter(this.#cardsContainer, this, this.handleViewAction, this.handleModeChange);
        this.moviePresenter.set(data.id, moviePresenter);
        const newPresenter = this.moviePresenter.get(data.id);
        newPresenter.initPopup(data, commentToDelete, this.#filterPresenter);
        replace(newPresenter.popupComponent, document.querySelector('.film-details__inner'));
        newPresenter.popupComponent.postClickHandler(data, moviePresenter, commentToDelete, oldPresenter, this.scrollCoordinates);
      }
        break;
      case UpdateType.MINOR:
        this.clearMoviesContainer();
        this.renderMoviesContainer(commentToDelete);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.renderMoviesContainer();
        this.#footerComponent.setCount(this.movies.length);
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.clearMoviesContainer({resetRenderedMoviesCount: true});
    this.renderMoviesContainer();
  };

  renderMoviesContainer = (commentToDelete) => {

    const movies = this.movies;
    const moviesCount = movies.length;
    if (moviesCount === 0) {
      if (this.#isLoading) {
        this.#renderLoading();
        return;
      }
      this.#renderNoMovies();
      return;
    }

    if(moviesCount > 0 && this.#noMoviesComponent){
      this.#noMoviesComponent.element.remove();
    }

    this.#renderSort();

    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)), commentToDelete);

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderLoadMoreButton();
    }
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    renderElement(this.#cardsContainerComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  };

  handleModeChange() {
    this.moviePresenter.forEach((presenter) => presenter.resetView());
  }


}

