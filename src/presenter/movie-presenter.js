import PopupView from '../view/popup-view';
import CommentView from '../view/comment-view';
import CardsView from '../view/cards-view.js';
import { renderElement } from '../mock/render';
import { RenderPosition } from '../mock/generate.js';
// import { presenter } from '../main.js';

export default class MoviePresenter {
  #movie = null;
  #popupComponent = null;
  #movieListPresenter = null;

#commentComponent = new CommentView();
#moviesContainer = null;

constructor(moviesContainer, movie, movieListPresenter) {
  this.#moviesContainer = moviesContainer;
  this.#movie = movie;
  this.#movieListPresenter = movieListPresenter;
  this.init();
}


init = () => {
  const cardComponent = new CardsView(this.#movie);
  this.#popupComponent = new PopupView(this.#movie);
  renderElement(this.#moviesContainer, cardComponent, RenderPosition.BEFOREEND);
  this.addPostClickHandler(cardComponent, () => {
    this.#popupComponent.postClickHandler(this.#movie, cardComponent);
  });
  this.addTo(cardComponent);
}

addTo(cardComponent) {
  const alreadyWatchedButtonInCard = cardComponent.element.querySelector('.film-card__controls-item--mark-as-watched');
  const alreadyWatchedButtonInPopup = this.#popupComponent.element.querySelector('.film-details__control-button--watched');
  const watchlistButtonInCard = cardComponent.element.querySelector('.film-card__controls-item--add-to-watchlist');
  const watchlistButtonInPopup = this.#popupComponent.element.querySelector('.film-details__control-button--watchlist');
  const favoriteButtonInCard = cardComponent.element.querySelector('.film-card__controls-item--favorite');
  const favoriteButtonInPopup = this.#popupComponent.element.querySelector('.film-details__control-button--favorite');

  alreadyWatchedButtonInCard.addEventListener('click', () => {
    this.markAs(alreadyWatchedButtonInPopup, cardComponent, alreadyWatchedButtonInCard, 'alreadyWatched');
  });

  alreadyWatchedButtonInPopup.addEventListener('click', () => {
    this.markAs(alreadyWatchedButtonInPopup, cardComponent, alreadyWatchedButtonInCard, 'alreadyWatched');
  });

  watchlistButtonInCard.addEventListener('click', () => {
    this.markAs(watchlistButtonInPopup, cardComponent, watchlistButtonInCard, 'watchlist');
  });

  watchlistButtonInPopup.addEventListener('click', () => {
    this.markAs(watchlistButtonInPopup, cardComponent, watchlistButtonInCard, 'watchlist');
  });

  favoriteButtonInCard.addEventListener('click', () => {
    // const {favorite} = cardComponent.movieInfo.userDetails;
    this.markAs(favoriteButtonInPopup, cardComponent, favoriteButtonInCard, 'favorite');
  });

  favoriteButtonInPopup.addEventListener('click', () => {
    // const {favorite} = cardComponent.movieInfo.userDetails;
    this.markAs(favoriteButtonInPopup, cardComponent, favoriteButtonInCard, 'favorite');
  });

}

markAs(popupButton, cardComponent, cardButtonIn, mark) {
  const status = cardComponent.movieInfo.userDetails[mark];
  cardComponent.movieInfo.userDetails[mark] = !status;
  popupButton.classList.toggle('film-details__control-button--active');
  cardButtonIn.classList.toggle('film-card__controls-item--active');
  this.#movieListPresenter.menuComponent.setFiltersCount();
}

addPostClickHandler(cardComponent, callback) {
  cardComponent._callback.postClick = callback;
  cardComponent.movieInfo = this.#movie;
  cardComponent.element.querySelector('a').addEventListener('click', cardComponent.postClickHandler);
}


}

