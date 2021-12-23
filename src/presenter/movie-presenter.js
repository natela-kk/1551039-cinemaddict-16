import PopupView from '../view/popup-view';
import CommentView from '../view/comment-view';
import CardsView from '../view/cards-view.js';
import { renderElement, remove } from '../mock/render';
import { RenderPosition } from '../mock/generate.js';
import { replace } from '../mock/utils';

export const PopupMode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};


export default class MoviePresenter {
  #movie = null;
  #popupComponent = null;
  #movieListPresenter = null;
  #cardComponent = null;
  #commentComponent = new CommentView();
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


init = (movie) => {
  this.#movie = movie;

  const cardComponent = this.#cardComponent;
  const popupComponent = this.#popupComponent;

  this.#cardComponent = new CardsView(this.#movie);
  this.#popupComponent = new PopupView(this.#movie, this.#changePopupMode.bind(this.#movieListPresenter));

  this.#cardComponent.setPostClickHandler(this.#handlePostClick);

  this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  this.#cardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
  this.#cardComponent.setHistoryClickHandler(this.#handleHistoryClick);
  this.#popupComponent.setFormSubmitHandler(this.#handleFormSubmit);

  const moviePresenter = this;

  this.addPostClickHandler(this.#cardComponent, () => {
    this.#popupComponent.postClickHandler(this.#movie, this.#cardComponent, moviePresenter);
    // this.#popupComponent.addFavoriteClickHandler(this.#movieListPresenter.menuComponent, this.#cardComponent);
    // this.#popupComponent.addToWatchlistClickHandler(this.#movieListPresenter.menuComponent, this.#cardComponent);
    // this.#popupComponent.addToHistoryClickHandler(this.#movieListPresenter.menuComponent, this.#cardComponent);
  });

  if (cardComponent === null || popupComponent === null) {
    renderElement(this.#moviesContainer, this.#cardComponent, RenderPosition.BEFOREEND);
    return;
  }

  // if (this.#moviesContainer.contains(cardComponent.element)) {
  if (this.popupMode === PopupMode.CLOSED) {
    replace(this.#cardComponent, cardComponent);
  }

  // if (this.#moviesContainer.contains(popupComponent.element)) {
  if (this.popupMode === PopupMode.OPENED) {
    replace(this.#popupComponent, popupComponent);
  }
}

addPostClickHandler(cardComponent, callback) {
  cardComponent._callback.postClick = callback;
  cardComponent.movieInfo = this.#movie;
  cardComponent.element.querySelector('a').addEventListener('click', cardComponent._callback.postClick);
}

destroy = () => {
  remove(this.#cardComponent);
}

#handleFavoriteClick = () => {
  this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
}

#handleWatchlistClick = () => {
  this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
}

#handleHistoryClick = () => {
  this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});

}

#handleFormSubmit = (movie) => {
  this.#changeData(movie);
}

#handlePostClick = () => {
  this.#popupComponent.postClickHandler();
}

resetView = () => {
  console.log('do if');
  if (this.popupMode !== PopupMode.CLOSED) {
  console.log('if');
    this.#popupComponent.closePopup();
  }
}

}


