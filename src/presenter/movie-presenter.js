import PopupView from '../view/popup-view';
import CardsView from '../view/cards-view.js';
import {renderElement, remove} from '../mock/render';
import {RenderPosition} from '../const.js';
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

  initCard = (movie, renderRemovedCard, firstCard) => {
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
    if (renderRemovedCard) {
      renderElement(firstCard, this.cardComponent, RenderPosition.BEFOREBEGIN);
      return;
    }
    if(!cardComponent.element.parentElement) {
      return;
    }
    replace(this.cardComponent, cardComponent);

  };

  initPopup = (movie, commentToDelete, filterPresenter) => {
    this.#movie = movie;
    this.popupComponent = new PopupView(this.#movie, this.#changePopupMode.bind(this.#movieListPresenter), this, this.#changeData, this.cardComponent, filterPresenter);
    this.popupComponent.element.scrollTo(...this.popupComponent.scrollCoordinates);
  };

  destroy = () => {
    remove(this.cardComponent);
  };

  handleFavoriteClick = (data) => {
    this.#changeData(
      {
        ...data,
        userDetails: {
          ...this.#movie.userDetails,
          favorite: !this.#movie.userDetails.favorite
        }
      },
      this.popupComponent.scrollCoordinates,
    );
  };

  handleWatchlistClick = (data) => {
    this.#changeData(
      {
        ...data,
        userDetails: {
          ...this.#movie.userDetails,
          watchlist: !this.#movie.userDetails.watchlist
        }
      },
      this.popupComponent.scrollCoordinates,
    );
  };

  handleHistoryClick = (data) => {
    this.#changeData(
      {
        ...data,
        userDetails: {
          ...this.#movie.userDetails,
          alreadyWatched: !this.#movie.userDetails.alreadyWatched
        }
      },
      this.popupComponent.scrollCoordinates,
    );
  };

  handleFormSubmit = (movie, comment) => {
    this.popupComponent.commentsModel.addComment(movie, comment, this.popupComponent).then((data) => this.updateCommentList(data));
  };

  updateCommentList(movie) {
    this.popupComponent.setComments(this.popupComponent.commentsModel.comments);
    this.#changeData(
      movie,
      this.popupComponent.scrollCoordinates,
    );
  }

  #handlePostClick = (commentToDelete) => {
    this.popupComponent.postClickHandler(this.#movie, this, commentToDelete);
  };

  resetView = () => {
    if (document.querySelector('.film-details__inner')) {
      // if(this.PopupMode === 'OPENED') {
      this.popupComponent.closePopup(this);
    }
  };
}


