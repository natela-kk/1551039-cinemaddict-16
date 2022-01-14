import PopupView from '../view/popup-view';
import CardsView from '../view/cards-view.js';
import { renderElement, remove } from '../mock/render';
import { RenderPosition } from '../mock/generate.js';
import { replace, isFavorite, isAlreadyWatched, isWatchlistAdded } from '../mock/utils/utils';
import {UserAction, UpdateType} from '../const.js';

export const PopupMode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};

export default class MoviePresenter {
  #movie = null;
  popupComponent = null;
  #movieListPresenter = null;
  cardComponent = null;
  #moviesContainer = null;
  #changeData = null;
  #changePopupMode = null;

  popupMode = PopupMode.CLOSED;

  constructor(moviesContainer, movieListPresenter, changeData, changePopupMode) {
    this.#moviesContainer = moviesContainer;
    this.#movieListPresenter = movieListPresenter;
    this.#changeData = changeData;
    this.#changePopupMode = changePopupMode;
  }

  init = (movie, scrollCoords) => {
    this.#movie = movie;
    const cardComponent = this.cardComponent;
    const popupComponent = this.popupComponent;

    this.cardComponent = new CardsView(this.#movie);
    this.popupComponent = new PopupView(this.#movie, this.#changePopupMode.bind(this.#movieListPresenter), this, this.#changeData, scrollCoords);

    this.cardComponent.setPostClickHandler(this.#handlePostClick);

    this.cardComponent.setFavoriteClickHandler(this.handleFavoriteClick);
    this.cardComponent.setWatchlistClickHandler(this.handleWatchlistClick);
    this.cardComponent.setHistoryClickHandler(this.handleHistoryClick);

    if (cardComponent === null || popupComponent === null) {
      renderElement(this.#moviesContainer, this.cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.popupMode === PopupMode.CLOSED) {
      replace(this.cardComponent, cardComponent);
    }

    if (this.popupMode === PopupMode.OPENED) {
      this.#handlePostClick();
      replace(this.popupComponent, popupComponent);
      // if (!cardComponent.element || this.#cardComponent.element) {
      replace(this.cardComponent, cardComponent);
      // }
    }
  }

  destroy = () => {
    remove(this.cardComponent);
  }

  handleFavoriteClick = (scrollCoordinates) => {

    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}},
      scrollCoordinates
    );
  }

  handleWatchlistClick = (scrollCoordinates) => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}},
      scrollCoordinates
    );
  }

  handleHistoryClick = (scrollCoordinates) => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}},
      scrollCoordinates
    );
  }

  handleFormSubmit = (movie, scrollCoordinates) => {
    const isMinorUpdate =
    !isFavorite(this.#movie.userDetails.favorite, movie.userDetails.favorite) ||
    !isWatchlistAdded(this.#movie.userDetails.watchlist, movie.userDetails.watchlist) ||
    !isAlreadyWatched(this.#movie.userDetails.alreadyWatched, movie.userDetails.alreadyWatched);

    this.#changeData(
      UserAction.UPDATE_MOVIE,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      movie,
      this.popupComponent,
      scrollCoordinates,
    );
  }

  #handlePostClick = () => {
    this.popupComponent.postClickHandler(this.#movie, this);
  }

  resetView = () => {
    if (this.popupMode !== PopupMode.CLOSED) {
      this.popupComponent.closePopup(this);
    }
  }
}


