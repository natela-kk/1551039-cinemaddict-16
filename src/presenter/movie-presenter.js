import PopupView from '../view/popup-view';
import CommentView from '../view/comment-view';
import CardsView from '../view/cards-view.js';
import { renderElement } from '../mock/render';
import { RenderPosition } from '../mock/generate.js';
import { presenter } from '../main.js';

export default class MoviePresenter {
  #movie = null;

#popupComponent = new PopupView();
#commentComponent = new CommentView();
#moviesContainer = null;

constructor(moviesContainer) {
  this.#moviesContainer = moviesContainer;
}


init = (movie) => {
  const cardComponent = new CardsView(movie);
  renderElement(this.#moviesContainer, cardComponent, RenderPosition.BEFOREEND);
  this.addToFavorite(cardComponent);
  this.addToWatchlist(cardComponent);
  this.addToHistory(cardComponent);
  this.addPostClickHandler(cardComponent, movie, () => {
    new PopupView(movie).postClickHandler(movie, cardComponent);
  });
}

addToFavorite(cardComponent) {
  const favoriteButton = cardComponent.element.querySelector('.film-card__controls-item--favorite');
  favoriteButton.addEventListener('click', () => {
    const favoriteSign = cardComponent.movieInfo.userDetails.favorite;
    cardComponent.movieInfo.userDetails.favorite = !favoriteSign;
    favoriteButton.classList.toggle('film-card__controls-item--active');
    presenter.menuComponent.setFiltersCount();
  });
}

addToWatchlist(cardComponent) {
  const watchlistButton = cardComponent.element.querySelector('.film-card__controls-item--add-to-watchlist');
  watchlistButton.addEventListener('click', () => {
    const watchlistSign = cardComponent.movieInfo.userDetails.watchlist;
    cardComponent.movieInfo.userDetails.watchlist = !watchlistSign;
    watchlistButton.classList.toggle('film-card__controls-item--active');
    presenter.menuComponent.setFiltersCount();
  });
}

addToHistory(cardComponent) {
  const alreadyWatchedButton = cardComponent.element.querySelector('.film-card__controls-item--mark-as-watched');
  alreadyWatchedButton.addEventListener('click', () => {
    const alreadyWatchedSign = cardComponent.movieInfo.userDetails.alreadyWatched;
    cardComponent.movieInfo.userDetails.alreadyWatched = !alreadyWatchedSign;
    alreadyWatchedButton.classList.toggle('film-card__controls-item--active');
    presenter.menuComponent.setFiltersCount();
  });
}

addPostClickHandler(cardComponent, movie, callback) {
  cardComponent._callback.postClick = callback;
  cardComponent.movieInfo = movie;
  cardComponent.element.querySelector('a').addEventListener('click', cardComponent.postClickHandler);
}


}

