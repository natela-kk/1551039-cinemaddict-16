import PopupView from '../view/popup-view';
import CardsView from '../view/cards-view.js';
import {renderElement, remove} from '../mock/render';
import {RenderPosition} from '../mock/generate.js';
import {replace} from '../mock/utils/utils';

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
  comments = null;

  popupMode = PopupMode.CLOSED;

  constructor(moviesContainer, movieListPresenter, changeData, changePopupMode) {
    this.#moviesContainer = moviesContainer;
    this.#movieListPresenter = movieListPresenter;
    this.#changeData = changeData;
    this.#changePopupMode = changePopupMode;
  }

  initCard = (movie) => {
    this.#movie = movie;
    const cardComponent = this.cardComponent;

    this.cardComponent = new CardsView(this.#movie);

    this.cardComponent.setPostClickHandler(this.#handlePostClick);

    this.cardComponent.setFavoriteClickHandler(this.handleFavoriteClick);
    this.cardComponent.setWatchlistClickHandler(this.handleWatchlistClick);
    this.cardComponent.setHistoryClickHandler(this.handleHistoryClick);

    if (cardComponent === null) {
      renderElement(this.#moviesContainer, this.cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.popupMode === PopupMode.CLOSED) {
      replace(this.cardComponent, cardComponent);
    }

    if (this.popupMode === PopupMode.OPENED) {
      replace(this.cardComponent, cardComponent);
    }
  };

  initPopup = (movie) => {
    this.#movie = movie;
    const popupComponent = this.popupComponent;
    this.popupComponent = new PopupView(this.#movie, this.#changePopupMode.bind(this.#movieListPresenter), this, this.#changeData);

    if (this.popupMode === PopupMode.OPENED) {
      this.#handlePostClick();
      replace(this.popupComponent, popupComponent);
    }
    this.popupComponent.element.scrollTo(...this.popupComponent.scrollCoordinates);
  };

  destroy = () => {
    remove(this.cardComponent);
  };

  handleFavoriteClick = () => {
    this.#changeData(
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          favorite: !this.#movie.userDetails.favorite
        }
      },
      this.popupComponent.scrollCoordinates,
    );
  };

  handleWatchlistClick = () => {
    this.#changeData(
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          watchlist: !this.#movie.userDetails.watchlist
        }
      },
      this.popupComponent.scrollCoordinates,
    );
  };

  handleHistoryClick = () => {
    this.#changeData(
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          alreadyWatched: !this.#movie.userDetails.alreadyWatched
        }
      },
      this.popupComponent.scrollCoordinates,
    );
  };

  handleFormSubmit = (movie) => {
    this.#changeData(
      movie,
      this.popupComponent.scrollCoordinates,
    );
  };

  #handlePostClick = () => {
    this.popupComponent.postClickHandler(this.#movie, this);
  };

  resetView = () => {
    if (this.popupMode !== PopupMode.CLOSED) {
      this.popupComponent.closePopup(this);
    }
  };
}


