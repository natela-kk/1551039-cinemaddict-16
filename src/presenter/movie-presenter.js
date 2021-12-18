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
}


init = () => {
  const cardComponent = new CardsView(this.#movie);
  this.#popupComponent = new PopupView(this.#movie);
  renderElement(this.#moviesContainer, cardComponent, RenderPosition.BEFOREEND);
  this.addToFavorite(cardComponent);
  this.addToWatchlist(cardComponent);
  this.addToHistory(cardComponent);
  this.addPostClickHandler(cardComponent, () => {

    this.#popupComponent.postClickHandler(this.#movie, cardComponent);
    this.addToFavoriteInPopup(cardComponent);
    this.addToWatchlistInPopup(cardComponent);
    this.addToHistoryInPopup(cardComponent);
  });
}

addToFavoriteInPopup(cardComponent) {
  const favoriteButton = this.#popupComponent.element.querySelector('.film-details__control-button--favorite');
  const favoriteButtonInCard = cardComponent.element.querySelector('.film-card__controls-item--favorite');
  favoriteButton.addEventListener('click', () => {
    const favoriteSign = cardComponent.movieInfo.userDetails.favorite;
    cardComponent.movieInfo.userDetails.favorite = !favoriteSign;
    favoriteButton.classList.toggle('film-details__control-button--active');
    favoriteButtonInCard.classList.toggle('film-card__controls-item--active');
    this.#movieListPresenter.menuComponent.setFiltersCount();
  });
}

addToWatchlistInPopup(cardComponent) {
  const watchlistButton = this.#popupComponent.element.querySelector('.film-details__control-button--watchlist');
  const watchlistButtonInCard = cardComponent.element.querySelector('.film-card__controls-item--add-to-watchlist');
  watchlistButton.addEventListener('click', () => {
    const watchlistSign = cardComponent.movieInfo.userDetails.watchlist;
    cardComponent.movieInfo.userDetails.watchlist = !watchlistSign;
    watchlistButton.classList.toggle('film-details__control-button--active');
    watchlistButtonInCard.classList.toggle('film-card__controls-item--active');
    this.#movieListPresenter.menuComponent.setFiltersCount();
  });
}

addToHistoryInPopup(cardComponent) {
  const alreadyWatchedButton = this.#popupComponent.element.querySelector('.film-details__control-button--watched');
  const alreadyWatchedButtonInCard = cardComponent.element.querySelector('.film-card__controls-item--mark-as-watched');
  alreadyWatchedButton.addEventListener('click', () => {
    const alreadyWatchedSign = cardComponent.movieInfo.userDetails.alreadyWatched;
    cardComponent.movieInfo.userDetails.alreadyWatched = !alreadyWatchedSign;
    alreadyWatchedButton.classList.toggle('film-details__control-button--active');
    alreadyWatchedButtonInCard.classList.toggle('film-card__controls-item--active');
    this.#movieListPresenter.menuComponent.setFiltersCount();
  });
}

addToFavorite(cardComponent) {
  const favoriteButton = cardComponent.element.querySelector('.film-card__controls-item--favorite');
  const favoriteButtonInPopup = this.#popupComponent.element.querySelector('.film-details__control-button--favorite');
  favoriteButton.addEventListener('click', () => {
    const favoriteSign = cardComponent.movieInfo.userDetails.favorite;
    cardComponent.movieInfo.userDetails.favorite = !favoriteSign;
    favoriteButton.classList.toggle('film-card__controls-item--active');
    favoriteButtonInPopup.classList.toggle('film-details__control-button--active');
    this.#movieListPresenter.menuComponent.setFiltersCount();
  });
}

addToWatchlist(cardComponent) {
  const watchlistButton = cardComponent.element.querySelector('.film-card__controls-item--add-to-watchlist');
  const watchlistButtonInPopup = this.#popupComponent.element.querySelector('.film-details__control-button--watchlist');
  watchlistButton.addEventListener('click', () => {
    const watchlistSign = cardComponent.movieInfo.userDetails.watchlist;
    cardComponent.movieInfo.userDetails.watchlist = !watchlistSign;
    watchlistButton.classList.toggle('film-card__controls-item--active');
    watchlistButtonInPopup.classList.toggle('film-details__control-button--active');
    this.#movieListPresenter.menuComponent.setFiltersCount();
  });
}

addToHistory(cardComponent) {
  const alreadyWatchedButton = cardComponent.element.querySelector('.film-card__controls-item--mark-as-watched');
  const alreadyWatchedButtonInPopup = this.#popupComponent.element.querySelector('.film-details__control-button--watched');
  alreadyWatchedButton.addEventListener('click', () => {
    const alreadyWatchedSign = cardComponent.movieInfo.userDetails.alreadyWatched;
    cardComponent.movieInfo.userDetails.alreadyWatched = !alreadyWatchedSign;
    alreadyWatchedButton.classList.toggle('film-card__controls-item--active');
    alreadyWatchedButtonInPopup.classList.toggle('film-details__control-button--active');
    this.#movieListPresenter.menuComponent.setFiltersCount();
  });
}

addPostClickHandler(cardComponent, callback) {
  cardComponent._callback.postClick = callback;
  cardComponent.movieInfo = this.#movie;
  cardComponent.element.querySelector('a').addEventListener('click', cardComponent.postClickHandler);
}


}

